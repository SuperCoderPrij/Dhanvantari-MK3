"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { vly } from '../lib/vly-integrations';

export const askAboutMedicine = action({
  args: {
    medicineName: v.string(),
    manufacturer: v.string(),
    details: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const prompt = `
      I have scanned a medicine with the following details:
      Name: ${args.medicineName}
      Manufacturer: ${args.manufacturer}
      Additional Details: ${args.details || "None"}

      Please provide a brief safety analysis and verification summary. 
      Is this a known manufacturer? What should I check on the packaging to ensure authenticity?
      Keep the response concise (under 150 words) and helpful for a consumer.
    `;

    const result = await vly.ai.completion({
      model: 'gpt-4o-mini', // Using GPT-4o-mini as a proxy for "Gemini" in this context or just a good model
      messages: [{ role: 'user', content: prompt }],
      maxTokens: 300
    });

    if (result.success && result.data) {
      return result.data.choices[0]?.message?.content || "No response from AI.";
    }
    return "Unable to verify with AI at this time.";
  },
});
