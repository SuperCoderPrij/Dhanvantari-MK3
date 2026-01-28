import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Shield, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { POLYGON_AMOY_CHAIN_ID } from "@/hooks/use-web3";

interface CreateMedicineFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isSubmitting: boolean;
  account: string | null;
  chainId: string | null;
  defaultManufacturerName?: string;
}

export function CreateMedicineForm({ 
  onSubmit, 
  isSubmitting, 
  account, 
  chainId, 
  defaultManufacturerName 
}: CreateMedicineFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="h-5 w-5 text-cyan-400" />
            Batch Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="medicineName" className="text-gray-300">Medicine Name</Label>
                <Input
                  id="medicineName"
                  name="medicineName"
                  placeholder="e.g. Amoxicillin 500mg"
                  className="bg-slate-950/50 border-slate-800 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="batchNumber" className="text-gray-300">Batch Number</Label>
                <Input
                  id="batchNumber"
                  name="batchNumber"
                  placeholder="e.g. BATCH-2024-001"
                  className="bg-slate-950/50 border-slate-800 text-white"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="manufacturerName" className="text-gray-300">Manufacturer Name</Label>
                <Input
                  id="manufacturerName"
                  name="manufacturerName"
                  defaultValue={defaultManufacturerName || ""}
                  placeholder="e.g. PharmaCorp Ltd."
                  className="bg-slate-950/50 border-slate-800 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicineType" className="text-gray-300">Type</Label>
                <Select name="medicineType" required>
                  <SelectTrigger className="bg-slate-950/50 border-slate-800 text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-white">
                    <SelectItem value="tablet">Tablet</SelectItem>
                    <SelectItem value="capsule">Capsule</SelectItem>
                    <SelectItem value="syrup">Syrup</SelectItem>
                    <SelectItem value="injection">Injection</SelectItem>
                    <SelectItem value="ointment">Ointment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-gray-300">Quantity (Units)</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  max="100"
                  placeholder="e.g. 50"
                  className="bg-slate-950/50 border-slate-800 text-white"
                  required
                />
                <p className="text-xs text-gray-500">Max 100 units for this demo</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="manufacturingDate" className="text-gray-300">Manufacturing Date</Label>
                <Input
                  id="manufacturingDate"
                  name="manufacturingDate"
                  type="date"
                  className="bg-slate-950/50 border-slate-800 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate" className="text-gray-300">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  className="bg-slate-950/50 border-slate-800 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mrp" className="text-gray-300">MRP ($)</Label>
                <Input
                  id="mrp"
                  name="mrp"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="bg-slate-950/50 border-slate-800 text-white"
                  required
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <Button
                type="submit"
                disabled={isSubmitting || !account || chainId !== POLYGON_AMOY_CHAIN_ID}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white py-6 text-lg font-semibold shadow-[0_0_20px_rgba(34,211,238,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Minting Batch NFTs...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Mint Medicine Batch
                  </>
                )}
              </Button>
              <p className="text-center text-xs text-gray-500 mt-4">
                This action will create a permanent record on the blockchain.
                Gas fees may apply.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
