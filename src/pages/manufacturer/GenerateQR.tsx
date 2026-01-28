import { motion } from "framer-motion";
import { QrCode, Layers } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BatchQRGenerator } from "./components/BatchQRGenerator";
import { ManualQRGenerator } from "./components/ManualQRGenerator";

export default function GenerateQR() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="text-3xl font-bold text-white">Generate QR Codes</h1>
        <p className="text-gray-400">Create verification QR codes for your medicines</p>
      </motion.div>

      <Tabs defaultValue="batch" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-900/50 border border-cyan-500/20">
          <TabsTrigger value="batch" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            <Layers className="mr-2 h-4 w-4" />
            Batch Generation
          </TabsTrigger>
          <TabsTrigger value="manual" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            <QrCode className="mr-2 h-4 w-4" />
            Manual Entry
          </TabsTrigger>
        </TabsList>

        <TabsContent value="batch" className="space-y-6 mt-6">
          <BatchQRGenerator />
        </TabsContent>

        <TabsContent value="manual">
          <ManualQRGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
}