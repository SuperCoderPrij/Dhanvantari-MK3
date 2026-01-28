import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get user's scan history
export const getUserScanHistory = query({
  args: {
    userId: v.optional(v.id("users")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      // Return empty list if not authenticated, or throw
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email!))
      .unique();

    if (!user) return [];

    const scans = await ctx.db
      .query("medicineScans")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(args.limit || 50);

    // Enrich with medicine data
    const scansWithMedicine = await Promise.all(
      scans.map(async (scan) => {
        let medicine = null;
        if (scan.medicineId) {
          medicine = await ctx.db.get(scan.medicineId);
        }
        return { ...scan, medicine };
      })
    );

    return scansWithMedicine;
  },
});

// Create new scan record
export const recordScan = mutation({
  args: {
    medicineId: v.optional(v.id("medicines")),
    scanResult: v.string(), // "genuine", "counterfeit", "unknown"
    location: v.optional(v.string()),
    deviceInfo: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    let userId = undefined;

    if (identity) {
      const user = await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", identity.email!))
        .unique();
      userId = user?._id;
    }

    const scanId = await ctx.db.insert("medicineScans", {
      userId,
      medicineId: args.medicineId,
      scanResult: {
        isVerified: args.scanResult === "genuine",
        confidence: 1,
        medicineName: "Unknown", // Placeholder, would come from lookup
      },
      scanDate: Date.now(),
      location: args.location,
      deviceInfo: args.deviceInfo,
      imageStorageId: args.imageStorageId || ("" as any), // Handle optional storage
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
    let imageUrl = null;
    if (scan.imageStorageId) {
        imageUrl = await ctx.storage.getUrl(scan.imageStorageId);
    }

    return {
      ...scan,
      imageUrl,
    };
  },
});