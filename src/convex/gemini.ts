import { action } from "./_generated/server";
import { v } from "convex/values";

export const askAboutMedicine = action({
  args: {
    medicineName: v.string(),
    manufacturer: v.string(),
    details: v.string(),
  },
  handler: async (ctx, args) => {
    const prompt = `Please analyze this medicine for safety and authenticity verification. 
    Medicine Name: ${args.medicineName}
    Manufacturer: ${args.manufacturer}
    Details: ${args.details}
    
    Provide a concise assessment of what a consumer should look for to verify this specific medicine.`;
    
    try {
      // Reusing the n8n webhook for the verification assistant as well
      const response = await fetch("https://koreankimchi.app.n8n.cloud/webhook/3e2ca4cb-d824-400f-92d5-3634e18a4ba7", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-id": "verification-assistant",
        },
        body: JSON.stringify({ message: prompt }),
      });

      if (!response.ok) {
        throw new Error(`AI Service returned ${response.status}`);
      }

      const text = await response.text();
      return text;
    } catch (error) {
      console.error("AI Verification Error:", error);
      return "Unable to connect to AI verification service. Please rely on the blockchain verification status and physical inspection of the packaging.";
    }
  },
});
