import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getPublicReports = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("reports")
      .withIndex("by_status", (q) => q.eq("status", "resolved"))
      .order("desc")
      .take(20);
  },
});

export const getManufacturerReports = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    
    // In a real app, we would filter by manufacturer's medicines
    // For now, we return all reports for the manufacturer dashboard demo
    return await ctx.db
      .query("reports")
      .order("desc")
      .take(50);
  },
});

export const createReport = mutation({
  args: {
    medicineName: v.optional(v.string()),
    batchNumber: v.optional(v.string()),
    reason: v.string(),
    description: v.optional(v.string()),
    location: v.optional(v.string()),
    qrCodeData: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    
    // Find user if logged in
    let reporterId;
    if (identity) {
      const user = await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", identity.email!))
        .unique();
      reporterId = user?._id;
    }

    await ctx.db.insert("reports", {
      ...args,
      reporterId,
      status: "pending",
    });
  },
});

export const updateReportStatus = mutation({
  args: {
    reportId: v.id("reports"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    await ctx.db.patch(args.reportId, {
      status: args.status,
    });
  },
});
