import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get medicines for a specific manufacturer
export const getManufacturerMedicines = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) return [];

    return await ctx.db
      .query("medicines")
      .withIndex("by_manufacturer", (q) => q.eq("manufacturerId", user._id))
      .order("desc")
      .collect();
  },
});

export const getManufacturerStats = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return { totalMedicines: 0, totalBatches: 0, totalScans: 0 };

        const user = await ctx.db
            .query("users")
            .withIndex("email", (q) => q.eq("email", identity.email!))
            .first();

        if (!user) return { totalMedicines: 0, totalBatches: 0, totalScans: 0 };

        const medicines = await ctx.db
            .query("medicines")
            .withIndex("by_manufacturer", (q) => q.eq("manufacturerId", user._id))
            .collect();

        const totalMedicines = medicines.length;
        // Assuming batches are same as medicines for now in this schema, or we count unique batch numbers
        const totalBatches = new Set(medicines.map(m => m.batchNumber)).size;
        
        // Mock scans count for now as it requires joining or separate aggregation
        const totalScans = 0; 

        return {
            totalMedicines,
            totalBatches,
            totalScans
        };
    }
});

// Create a new medicine batch
export const createMedicine = mutation({
  args: {
    medicineName: v.string(),
    manufacturerName: v.string(),
    batchNumber: v.string(),
    medicineType: v.string(),
    manufacturingDate: v.string(),
    expiryDate: v.string(),
    mrp: v.number(),
    quantity: v.number(),
    tokenId: v.string(),
    transactionHash: v.string(),
    contractAddress: v.string(),
    qrCodeData: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) throw new Error("User not found");

    const medicineId = await ctx.db.insert("medicines", {
      ...args,
      manufacturerId: user._id,
      isActive: true,
    });

    // Create individual units
    for (let i = 1; i <= args.quantity; i++) {
      const unitTokenId = `${args.tokenId}-${i}`;
      await ctx.db.insert("medicine_units", {
        medicineId,
        tokenId: unitTokenId,
        serialNumber: i,
        qrCodeData: JSON.stringify({
          contract: args.contractAddress,
          tokenId: unitTokenId,
          batch: args.batchNumber
        }),
        isVerified: false,
        status: "minted",
      });
    }

    return medicineId;
  },
});

// Get units for a medicine
export const getMedicineUnits = query({
  args: { medicineId: v.id("medicines") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("medicine_units")
      .withIndex("by_medicine", (q) => q.eq("medicineId", args.medicineId))
      .collect();
  },
});

// Get medicine by QR code data (for manual entry or scan)
export const getMedicineByQRCode = query({
  args: { qrCodeData: v.string() },
  handler: async (ctx, args) => {
    // Try to find by batch QR first
    const medicine = await ctx.db
      .query("medicines")
      .withIndex("by_qr_code", (q) => q.eq("qrCodeData", args.qrCodeData))
      .first();

    if (medicine) return medicine;

    // Try to find by unit QR
    const unit = await ctx.db
      .query("medicine_units")
      .withIndex("by_qr_code", (q) => q.eq("qrCodeData", args.qrCodeData))
      .first();

    if (unit) {
      return await ctx.db.get(unit.medicineId);
    }

    return null;
  },
});

// Get medicine by Unit Token ID (from URL param)
export const getMedicineByUnitTokenId = query({
  args: { tokenId: v.string() },
  handler: async (ctx, args) => {
    // Check if it's a unit token ID
    const unit = await ctx.db
      .query("medicine_units")
      .withIndex("by_token_id", (q) => q.eq("tokenId", args.tokenId))
      .first();

    if (unit) {
      const medicine = await ctx.db.get(unit.medicineId);
      return { ...medicine, unit };
    }

    // Check if it's a batch token ID
    const medicine = await ctx.db
      .query("medicines")
      .withIndex("by_token_id", (q) => q.eq("tokenId", args.tokenId))
      .first();
      
    return medicine;
  },
});

export const toggleMedicineStatus = mutation({
  args: { id: v.id("medicines"), isActive: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isActive: args.isActive });
  },
});

export const deleteMedicine = mutation({
  args: { id: v.id("medicines") },
  handler: async (ctx, args) => {
    // In a real app, we might archive instead of delete
    // Also need to delete units
    const units = await ctx.db
      .query("medicine_units")
      .withIndex("by_medicine", (q) => q.eq("medicineId", args.id))
      .collect();
      
    for (const unit of units) {
      await ctx.db.delete(unit._id);
    }
    
    await ctx.db.delete(args.id);
  },
});