import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { verificationStatusValidator } from "./schema";

// Get all medicines with optional filters
export const list = query({
  args: {
    searchQuery: v.optional(v.string()),
    verificationStatus: v.optional(verificationStatusValidator),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let medicines;

    if (args.verificationStatus) {
      medicines = await ctx.db
        .query("medicines")
        .withIndex("by_verification_status", (q) =>
          q.eq("verificationStatus", args.verificationStatus!)
        )
        .take(args.limit || 100);
    } else {
      medicines = await ctx.db
        .query("medicines")
        .take(args.limit || 100);
    }

    if (args.searchQuery) {
      const searchLower = args.searchQuery.toLowerCase();
      return medicines.filter(
        (med) =>
          med.name.toLowerCase().includes(searchLower) ||
          med.genericName.toLowerCase().includes(searchLower) ||
          med.manufacturer.toLowerCase().includes(searchLower)
      );
    }

    return medicines;
  },
});

// Get medicine by ID
export const getById = query({
  args: { id: v.id("medicines") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get medicine by QR code
export const getByQrCode = query({
  args: { qrCode: v.string() },
  handler: async (ctx, args) => {
    const medicine = await ctx.db
      .query("medicines")
      .withIndex("by_qr_code", (q) => q.eq("qrCode", args.qrCode))
      .unique();
    return medicine;
  },
});

// Verify medicine authenticity
export const verifyMedicine = query({
  args: { qrCode: v.string() },
  handler: async (ctx, args) => {
    const medicine = await ctx.db
      .query("medicines")
      .withIndex("by_qr_code", (q) => q.eq("qrCode", args.qrCode))
      .unique();

    if (!medicine) {
      return {
        isValid: false,
        message: "Medicine not found in database",
      };
    }

    const expiryDate = new Date(medicine.expiryDate);
    const isExpired = expiryDate < new Date();

    return {
      isValid: !isExpired && !medicine.isRecalled && medicine.verificationStatus === "verified",
      medicine,
      isExpired,
      isRecalled: medicine.isRecalled,
      message: isExpired
        ? "Medicine has expired"
        : medicine.isRecalled
        ? "Medicine has been recalled"
        : medicine.verificationStatus !== "verified"
        ? "Medicine verification pending"
        : "Medicine is authentic and safe to use",
    };
  },
});

// Add new medicine (for manufacturers)
export const create = mutation({
  args: {
    name: v.string(),
    genericName: v.string(),
    manufacturer: v.string(),
    manufacturerId: v.optional(v.id("organizations")),
    batchNumber: v.string(),
    manufacturingDate: v.string(),
    expiryDate: v.string(),
    composition: v.string(),
    dosageForm: v.string(),
    strength: v.string(),
    price: v.number(),
    description: v.string(),
    sideEffects: v.optional(v.string()),
    contraindications: v.optional(v.string()),
    storageConditions: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Generate unique QR code
    const qrCode = `MED-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const medicineId = await ctx.db.insert("medicines", {
      ...args,
      qrCode,
      verificationStatus: "pending",
      isRecalled: false,
    });

    return medicineId;
  },
});

// Update medicine verification status
export const updateVerificationStatus = mutation({
  args: {
    medicineId: v.id("medicines"),
    status: verificationStatusValidator,
    blockchainHash: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    await ctx.db.patch(args.medicineId, {
      verificationStatus: args.status,
      blockchainHash: args.blockchainHash,
    });

    return { success: true };
  },
});

// Mark medicine as recalled
export const recallMedicine = mutation({
  args: {
    medicineId: v.id("medicines"),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    await ctx.db.patch(args.medicineId, {
      isRecalled: true,
    });

    // Create alert for all users who have this medicine
    // This would be implemented with a more complex query in production

    return { success: true };
  },
});
