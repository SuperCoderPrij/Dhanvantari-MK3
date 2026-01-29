import { useState, lazy, Suspense } from "react";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, AlertTriangle, Sparkles, Bot } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const QRScanner = lazy(() => import("@/components/QRScanner"));

export default function MedicineScan() {
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [scanResult, setScanResult] = useState<any>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAskingAi, setIsAskingAi] = useState(false);

  const recordScan = useMutation(api.scans.recordScan);
  const askGemini = useAction(api.gemini.askAboutMedicine);
  const getMedicineByQR = useQuery(api.medicines.getMedicineByQRCode, 
    manualCode ? { qrCodeData: manualCode } : "skip"
  );

  const handleScanSuccess = async (decodedText: string) => {
    console.log("Scanned:", decodedText);
    
    const isValidUrl = decodedText.includes("/verify?");
    let isValidJson = false;
    try {
      const parsed = JSON.parse(decodedText);
      if (parsed.id || parsed.batch || parsed.contract) isValidJson = true;
    } catch (e) {
      // Not JSON
    }

    if (!isValidUrl && !isValidJson) {
      toast.error("Invalid QR Code. Please scan a valid Dhanvantari medicine QR code.");
      return;
    }
    
    if (decodedText.includes("/verify?")) {
      window.location.href = decodedText;
      return;
    }

    setManualCode(decodedText);
    toast.success("QR Code Scanned! Verifying...");
    handleSimulateScan(decodedText);
  };

  const handleSimulateScan = async (codeOverride?: string) => {
    const code = codeOverride || manualCode;
    if (!code) {
      toast.error("Please enter a QR code or Batch ID");
      return;
    }

    setIsScanning(true);
    // Small delay to allow query to update if it was just set
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      if (getMedicineByQR) {
        await recordScan({
          medicineId: getMedicineByQR._id,
          scanResult: "genuine",
          location: "Web Scanner",
          deviceInfo: navigator.userAgent,
        });
        setScanResult({ status: "genuine", medicine: getMedicineByQR });
        setAiResponse(null);
        toast.success("Medicine Verified: Genuine");
      } else {
        if (getMedicineByQR === null) {
             setScanResult({ status: "unknown" });
             toast.warning("Medicine not found in registry");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Error processing scan");
    } finally {
      setIsScanning(false);
    }
  };

  const handleAskGemini = async () => {
    if (!scanResult?.medicine) return;
    
    setIsAskingAi(true);
    try {
      const response = await askGemini({
        medicineName: scanResult.medicine.medicineName,
        manufacturer: scanResult.medicine.manufacturerName,
        details: `Batch: ${scanResult.medicine.batchNumber}`
      });
      setAiResponse(response);
    } catch (error) {
      toast.error("Failed to get AI insights");
      console.error(error);
    } finally {
      setIsAskingAi(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold">Scan Medicine</h1>
        <p className="text-muted-foreground mt-2">
          Scan the QR code on the medicine packaging to verify authenticity
        </p>
      </motion.div>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-6 space-y-6">
          <div className="rounded-lg overflow-hidden border border-slate-800 bg-black aspect-square max-w-sm mx-auto relative">
             <Suspense fallback={<div className="flex items-center justify-center h-full text-gray-500">Loading Camera...</div>}>
                <QRScanner 
                  onScanSuccess={handleScanSuccess} 
                  onScanFailure={(err: any) => {}}
                />
             </Suspense>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-400 text-center">Or enter QR Data / Batch ID manually:</p>
            <div className="flex gap-2">
              <Input 
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder='e.g. {"id":"NFT-..."}'
                className="bg-slate-950 border-slate-800"
              />
              <Button onClick={() => handleSimulateScan()} disabled={isScanning}>
                {isScanning ? "Verifying..." : "Verify"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {scanResult && (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl border ${
            scanResult.status === "genuine" 
                ? "bg-green-500/10 border-green-500/30" 
                : "bg-red-500/10 border-red-500/30"
            }`}
        >
            <div className="flex items-center gap-3 mb-4">
                {scanResult.status === "genuine" ? (
                <CheckCircle className="h-8 w-8 text-green-400" />
                ) : (
                <AlertTriangle className="h-8 w-8 text-red-400" />
                )}
                <div>
                    <h3 className="font-bold text-xl capitalize">
                        {scanResult.status === "genuine" ? "Authentic Medicine" : "Verification Failed"}
                    </h3>
                    <p className="text-sm text-gray-400">
                        {scanResult.status === "genuine" 
                            ? "This medicine has been verified on the blockchain." 
                            : "We could not verify this medicine in our registry."}
                    </p>
                </div>
            </div>

            {scanResult.medicine && (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                            <p className="text-gray-500 mb-1">Medicine Name</p>
                            <p className="font-medium text-white">{scanResult.medicine.medicineName}</p>
                        </div>
                        <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                            <p className="text-gray-500 mb-1">Manufacturer</p>
                            <p className="font-medium text-white">{scanResult.medicine.manufacturerName}</p>
                        </div>
                        <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                            <p className="text-gray-500 mb-1">Batch Number</p>
                            <p className="font-medium text-white">{scanResult.medicine.batchNumber}</p>
                        </div>
                        <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                            <p className="text-gray-500 mb-1">Expiry Date</p>
                            <p className="font-medium text-white">{scanResult.medicine.expiryDate}</p>
                        </div>
                    </div>

                    {!aiResponse && (
                        <Button 
                        onClick={handleAskGemini} 
                        disabled={isAskingAi}
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0"
                        >
                        {isAskingAi ? (
                            <>
                            <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                            Asking Gemini...
                            </>
                        ) : (
                            <>
                            <Bot className="mr-2 h-4 w-4" />
                            Ask Gemini AI
                            </>
                        )}
                        </Button>
                    )}

                    {aiResponse && (
                        <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="pt-4 border-t border-slate-700/50"
                        >
                        <div className="flex items-center gap-2 mb-2 text-purple-300">
                            <Sparkles className="h-4 w-4" />
                            <span className="font-semibold text-sm">Gemini AI Insights</span>
                        </div>
                        <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed bg-slate-950/50 p-4 rounded-lg border border-purple-500/20">
                            {aiResponse}
                        </div>
                        </motion.div>
                    )}
                </div>
            )}
        </motion.div>
      )}
    </div>
  );
}