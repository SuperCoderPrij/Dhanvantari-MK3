import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { verificationStatusValidator } from "./schema";

// Get all medicines with optional filters
export const list = query({
  args: {
    searchQuery: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const medicines = await ctx.db
      .query("medicines")
      .take(args.limit || 100);

    if (args.searchQuery) {
      const searchLower = args.searchQuery.toLowerCase();
      return medicines.filter(
        (med) =>
          med.medicineName.toLowerCase().includes(searchLower) ||
          med.manufacturerName.toLowerCase().includes(searchLower)
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
      .withIndex("by_qr_code", (q) => q.eq("qrCodeData", args.qrCode))
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
      .withIndex("by_qr_code", (q) => q.eq("qrCodeData", args.qrCode))
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
      isValid: !isExpired && medicine.isActive,
      medicine,
      isExpired,
      message: isExpired
        ? "Medicine has expired"
        : !medicine.isActive
        ? "Medicine is not active"
        : "Medicine is authentic and safe to use",
    };
  },
});

// Add new medicine (for manufacturers)
export const create = mutation({
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
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Generate unique QR code
    const qrCodeData = `MED-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const medicineId = await ctx.db.insert("medicines", {
      ...args,
      manufacturerId: identity.subject as any,
      qrCodeData,
      isActive: true,
    });

    return medicineId;
  },
});