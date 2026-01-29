import { useState, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Camera, QrCode, CheckCircle, AlertTriangle, Sparkles, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

const QRScanner = lazy(() => import("@/components/QRScanner"));

export function ScanActionCard() {
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [scanResult, setScanResult] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

    if (!isValidUrl && !isValidJson && !decodedText.startsWith("NFT-")) {
      toast.error("Invalid QR Code format. Please scan a valid Dhanvantari medicine QR code.");
      return;
    }
    
    if (decodedText.includes("/verify?")) {
      window.location.href = decodedText;
      return;
    }

    setManualCode(decodedText);
    toast.success("QR Code Scanned! Click Verify to confirm.");
  };

  const handleManualVerify = async () => {
    if (!manualCode) {
      toast.error("Please enter a QR code or Batch ID");
      return;
    }

    setIsScanning(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      if (getMedicineByQR === undefined && manualCode) {
         toast.info("Verifying...");
         return; 
      }

      if (getMedicineByQR) {
        await recordScan({
          medicineId: getMedicineByQR._id,
          scanResult: "genuine",
          location: "Web Dashboard",
          deviceInfo: navigator.userAgent,
        });
        setScanResult({ status: "genuine", medicine: getMedicineByQR });
        setAiResponse(null);
        toast.success("Medicine Verified: Genuine");
      } else {
        if (getMedicineByQR === null) {
             setScanResult({ status: "unknown" });
             toast.warning("Medicine not found in registry");
             
             await recordScan({
                scanResult: "counterfeit",
                location: "Web Dashboard",
                deviceInfo: navigator.userAgent,
             });
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
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="bg-[#0f172a] border-slate-800 shadow-xl overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <CardContent className="p-8 text-center space-y-8 relative z-10">
          <div className="h-32 w-32 mx-auto rounded-full flex items-center justify-center relative bg-slate-900 border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
            <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-[ping_3s_ease-in-out_infinite]" />
            <QrCode className="h-14 w-14 text-cyan-400" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Scan Medicine</h2>
            <p className="text-slate-400 text-sm">Point your camera at the QR code on the medicine pack</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white py-6 text-lg font-medium shadow-lg shadow-cyan-500/20 border-0 transition-all duration-300 hover:scale-[1.02]">
                <Camera className="mr-2 h-5 w-5" />
                Scan Now
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-950 border-slate-800 text-white sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Scan Medicine QR</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Suspense fallback={<div className="p-8 text-center text-gray-400">Loading Scanner...</div>}>
                  <QRScanner 
                    onScanSuccess={handleScanSuccess} 
                    onScanFailure={(err: any) => {}}
                  />
                </Suspense>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Or enter QR Data / Batch ID manually:</p>
                  <div className="flex gap-2">
                    <Input 
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      placeholder='e.g. {"id":"NFT-..."} or Batch ID'
                      className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleManualVerify();
                      }}
                    />
                    <Button 
                      onClick={handleManualVerify} 
                      disabled={isScanning || getMedicineByQR === undefined}
                      className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                    >
                      {isScanning ? "Verifying..." : "Verify"}
                    </Button>
                  </div>
                </div>
                
                {scanResult && (
                  <div className={`p-4 rounded-lg border ${
                    scanResult.status === "genuine" 
                      ? "bg-green-500/10 border-green-500/30" 
                      : "bg-red-500/10 border-red-500/30"
                  }`}>
                    <div className="flex items-center gap-3 mb-2">
                      {scanResult.status === "genuine" ? (
                        <CheckCircle className="h-6 w-6 text-green-400" />
                      ) : (
                        <AlertTriangle className="h-6 w-6 text-red-400" />
                      )}
                      <span className="font-bold text-lg capitalize">
                        {scanResult.status === "genuine" ? "Authentic Medicine" : "Verification Failed"}
                      </span>
                    </div>
                    {scanResult.medicine && (
                      <div className="text-sm space-y-1 text-gray-300">
                        <p>Name: <span className="text-white">{scanResult.medicine.medicineName}</span></p>
                        <p>Manufacturer: <span className="text-white">{scanResult.medicine.manufacturerName}</span></p>
                        <p>Batch: <span className="text-white">{scanResult.medicine.batchNumber}</span></p>
                        <p>Expiry: <span className="text-white">{scanResult.medicine.expiryDate}</span></p>
                        
                        {!aiResponse && (
                          <Button 
                            onClick={handleAskGemini} 
                            disabled={isAskingAi}
                            className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0"
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
                      </div>
                    )}
                    
                    {aiResponse && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4 pt-4 border-t border-slate-700/50"
                      >
                        <div className="flex items-center gap-2 mb-2 text-purple-300">
                          <Sparkles className="h-4 w-4" />
                          <span className="font-semibold text-sm">Gemini AI Insights</span>
                        </div>
                        <div className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed bg-slate-950/50 p-3 rounded-lg border border-purple-500/20">
                          {aiResponse}
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </motion.div>
  );
}