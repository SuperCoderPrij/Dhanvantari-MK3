import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get user's health records
export const getUserRecords = query({
  args: {
    userId: v.optional(v.id("users")),
    recordType: v.optional(
      v.union(
        v.literal("prescription"),
        v.literal("diagnosis"),
        v.literal("lab_report"),
        v.literal("vaccination"),
        v.literal("allergy")
      )
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = args.userId || (identity.subject as any);

    let query = ctx.db.query("healthRecords").withIndex("by_user", (q) => q.eq("userId", userId));

    const records = await query.order("desc").take(100);

    if (args.recordType) {
      return records.filter((r) => r.recordType === args.recordType);
    }

    return records;
  },
});

// Create health record
export const createRecord = mutation({
  args: {
    recordType: v.union(
      v.literal("prescription"),
      v.literal("diagnosis"),
      v.literal("lab_report"),
      v.literal("vaccination"),
      v.literal("allergy")
    ),
    title: v.string(),
    description: v.string(),
    doctorId: v.optional(v.id("users")),
    hospitalId: v.optional(v.id("organizations")),
    date: v.string(),
    medications: v.optional(v.array(v.id("medicines"))),
    isPrivate: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const recordId = await ctx.db.insert("healthRecords", {
      userId: identity.subject as any,
      ...args,
    });

    return recordId;
  },
});

// Get record by ID
export const getRecordById = query({
  args: { recordId: v.id("healthRecords") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const record = await ctx.db.get(args.recordId);
    
    if (!record) {
      return null;
    }

    // Check if user has access
    if (record.userId !== identity.subject && record.isPrivate) {
      throw new Error("Access denied");
    }

    return record;
  },
});
