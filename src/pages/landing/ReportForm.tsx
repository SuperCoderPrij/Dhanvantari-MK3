import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

export function ReportForm() {
  const createReport = useMutation(api.reports.createReport);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    medicineName: "",
    batchNumber: "",
    reason: "",
    location: "",
    description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.medicineName || !formData.reason) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await createReport({
        medicineName: formData.medicineName,
        batchNumber: formData.batchNumber,
        reason: formData.reason,
        location: formData.location,
        description: formData.description,
      });
      
      toast.success("Report submitted successfully", {
        description: "Thank you for helping us keep the community safe."
      });
      
      // Reset form
      setFormData({
        medicineName: "",
        batchNumber: "",
        reason: "",
        location: "",
        description: ""
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative z-10 py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Spot a Fake? Report It.
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Help us build a safer world. If you suspect a medicine is counterfeit, report it immediately. 
            Your report helps manufacturers and authorities take action.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 md:p-10 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="medicineName" className="text-gray-300">Medicine Name *</Label>
                <Input
                  id="medicineName"
                  placeholder="e.g. Paracetamol 500mg"
                  value={formData.medicineName}
                  onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
                  className="bg-slate-950/50 border-slate-800 text-white placeholder:text-gray-600 focus:border-orange-500/50 focus:ring-orange-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="batchNumber" className="text-gray-300">Batch Number (if available)</Label>
                <Input
                  id="batchNumber"
                  placeholder="e.g. BATCH-123"
                  value={formData.batchNumber}
                  onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                  className="bg-slate-950/50 border-slate-800 text-white placeholder:text-gray-600 focus:border-orange-500/50 focus:ring-orange-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason" className="text-gray-300">Reason for Suspicion *</Label>
                <Select 
                  value={formData.reason} 
                  onValueChange={(val) => setFormData({ ...formData, reason: val })}
                >
                  <SelectTrigger className="bg-slate-950/50 border-slate-800 text-white focus:border-orange-500/50 focus:ring-orange-500/20">
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-white">
                    <SelectItem value="packaging_issue">Suspicious Packaging</SelectItem>
                    <SelectItem value="wrong_color_shape">Wrong Color/Shape</SelectItem>
                    <SelectItem value="bad_smell_taste">Bad Smell/Taste</SelectItem>
                    <SelectItem value="verification_failed">Verification Failed</SelectItem>
                    <SelectItem value="side_effects">Unexpected Side Effects</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-300">Location of Purchase</Label>
                <Input
                  id="location"
                  placeholder="Pharmacy Name, City"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="bg-slate-950/50 border-slate-800 text-white placeholder:text-gray-600 focus:border-orange-500/50 focus:ring-orange-500/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-300">Additional Details</Label>
              <Textarea
                id="description"
                placeholder="Please describe what you observed..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-slate-950/50 border-slate-800 text-white placeholder:text-gray-600 min-h-[120px] focus:border-orange-500/50 focus:ring-orange-500/20"
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-all duration-300"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Report
                    <Send className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}