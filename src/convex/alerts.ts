import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get user's alerts
export const getUserAlerts = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    return await ctx.db
      .query("alerts")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject as any))
      .order("desc")
      .take(50);
  },
});

// Get unread count
export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return 0;
    }

    const unread = await ctx.db
      .query("alerts")
      .withIndex("by_user_and_read", (q) => q.eq("userId", identity.subject as any).eq("isRead", false))
      .collect();

    return unread.length;
  },
});

// Mark alert as read
export const markAsRead = mutation({
  args: { alertId: v.id("alerts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const alert = await ctx.db.get(args.alertId);
    if (!alert || alert.userId !== identity.subject) {
      throw new Error("Alert not found or unauthorized");
    }

    await ctx.db.patch(args.alertId, { isRead: true });
  },
});

// Mark all as read
export const markAllAsRead = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const unreadAlerts = await ctx.db
      .query("alerts")
      .withIndex("by_user_and_read", (q) => q.eq("userId", identity.subject as any).eq("isRead", false))
      .collect();

    for (const alert of unreadAlerts) {
      await ctx.db.patch(alert._id, { isRead: true });
    }
  },
});
