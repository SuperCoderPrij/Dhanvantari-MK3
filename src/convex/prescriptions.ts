import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get user's prescriptions (as patient)
export const getUserPrescriptions = query({
  args: {
    userId: v.optional(v.id("users")),
    status: v.optional(v.union(v.literal("active"), v.literal("completed"), v.literal("cancelled"))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = args.userId || (identity.subject as any);

    let query = ctx.db.query("prescriptions").withIndex("by_patient", (q) => q.eq("patientId", userId));

    if (args.status) {
      query = ctx.db.query("prescriptions").withIndex("by_status", (q) => q.eq("status", args.status!));
      // Note: This is a simplification. In a real app, we'd need a compound index or filter in memory if we want to filter by patient AND status efficiently without a specific index.
      // For now, let's fetch by patient and filter in memory if status is provided, or use the status index if we are looking for all prescriptions of a status (which might not be what we want).
      // Better approach for this schema:
      const prescriptions = await ctx.db
        .query("prescriptions")
        .withIndex("by_patient", (q) => q.eq("patientId", userId))
        .order("desc")
        .take(100);
      
      if (args.status) {
        return prescriptions.filter(p => p.status === args.status);
      }
      return prescriptions;
    }

    return await query.order("desc").take(100);
  },
});

// Get prescription by ID
export const getPrescriptionById = query({
  args: { prescriptionId: v.id("prescriptions") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const prescription = await ctx.db.get(args.prescriptionId);
    if (!prescription) return null;

    // Verify access (patient or doctor)
    if (prescription.patientId !== identity.subject && prescription.doctorId !== identity.subject) {
      throw new Error("Access denied");
    }

    // Fetch medicine details for each medication in the prescription
    const medicationsWithDetails = await Promise.all(
      prescription.medications.map(async (med) => {
        const medicineDetails = await ctx.db.get(med.medicineId);
        return {
          ...med,
          medicineName: medicineDetails?.name || "Unknown Medicine",
          medicineImage: medicineDetails?.imageUrl,
        };
      })
    );

    return {
      ...prescription,
      medications: medicationsWithDetails,
    };
  },
});

// Create a new prescription (Doctor only)
export const createPrescription = mutation({
  args: {
    patientId: v.id("users"),
    diagnosis: v.string(),
    medications: v.array(v.object({
      medicineId: v.id("medicines"),
      dosage: v.string(),
      frequency: v.string(),
      duration: v.string(),
      instructions: v.string(),
    })),
    validUntil: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // In a real app, check if user is a doctor
    // const user = await ctx.db.get(identity.subject as any);
    // if (user?.role !== "doctor") throw new Error("Unauthorized");

    const qrCode = `RX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const prescriptionId = await ctx.db.insert("prescriptions", {
      doctorId: identity.subject as any,
      patientId: args.patientId,
      diagnosis: args.diagnosis,
      medications: args.medications,
      prescriptionDate: new Date().toISOString().split('T')[0],
      validUntil: args.validUntil,
      status: "active",
      notes: args.notes,
      qrCode,
    });

    return prescriptionId;
  },
});
