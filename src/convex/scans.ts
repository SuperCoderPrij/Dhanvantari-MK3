import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get user's scan history
export const getUserScans = query({
  args: {
    userId: v.optional(v.id("users")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = args.userId || (identity.subject as any);

    const scans = await ctx.db
      .query("medicineScans")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(args.limit || 50);

    return scans;
  },
});

// Create new scan record
export const createScan = mutation({
  args: {
    imageStorageId: v.id("_storage"),
    scanResult: v.object({
      medicineName: v.optional(v.string()),
      confidence: v.number(),
      detectedText: v.optional(v.string()),
      isVerified: v.boolean(),
      matchedMedicineId: v.optional(v.id("medicines")),
    }),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const scanId = await ctx.db.insert("medicineScans", {
      userId: identity.subject as any,
      imageStorageId: args.imageStorageId,
      scanResult: args.scanResult,
      scanDate: Date.now(),
      location: args.location,
    });

    return scanId;
  },
});

// Get scan by ID
export const getScanById = query({
  args: { scanId: v.id("medicineScans") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const scan = await ctx.db.get(args.scanId);
    
    if (!scan) {
      return null;
    }

    // Get the image URL
    const imageUrl = await ctx.storage.getUrl(scan.imageStorageId);

    return {
      ...scan,
      imageUrl,
    };
  },
});
