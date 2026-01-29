import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, CheckCircle, XCircle, AlertTriangle, Sparkles, Bot, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import QRScanner from "@/components/QRScanner";

export default function MedicineScan() {
  const [scanResult, setScanResult] = useState<any>(null);
  const [manualCode, setManualCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAskingAi, setIsAskingAi] = useState(false);

  const recordScan = useMutation(api.scans.recordScan);
  const askGemini = useAction(api.gemini.askAboutMedicine);
  
  // Query to check medicine validity when manual code is entered
  const medicineQuery = useQuery(api.medicines.getMedicineByQRCode, 
    manualCode ? { qrCodeData: manualCode } : "skip"
  );

  const handleScanSuccess = async (decodedText: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    try {
      console.log("Scanned:", decodedText);
      
      // Check if it's a URL or JSON
      let qrData = decodedText;
      
      // If it's a URL, try to extract relevant ID or just use the whole string
      // For this app, we expect JSON or specific ID formats usually
      
      setManualCode(decodedText);
      // The effect hook will handle the verification once medicineQuery updates
      
    } catch (error) {
      console.error("Scan error:", error);
      toast.error("Failed to process scanned code");
      setIsProcessing(false);
    }
  };

  // Handle verification when medicineQuery updates
  useEffect(() => {
    if (manualCode && medicineQuery !== undefined) {
      verifyMedicine(medicineQuery);
    }
  }, [medicineQuery, manualCode]);

  const verifyMedicine = async (medicine: any) => {
    try {
      if (medicine) {
        // Valid medicine found
        await recordScan({
          medicineId: medicine._id,
          scanResult: "genuine",
          location: "Web Scan",
          deviceInfo: navigator.userAgent,
        });
        
        setScanResult({
          status: "genuine",
          medicine: medicine
        });
        toast.success("Medicine Verified Successfully!");
      } else {
        // Invalid / Not found
        if (manualCode) {
            await recordScan({
              scanResult: "counterfeit", // or unknown
              location: "Web Scan",
              deviceInfo: navigator.userAgent,
            });
            
            setScanResult({
              status: "unknown",
              qrData: manualCode
            });
            toast.error("Medicine not found in registry");
        }
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Error recording scan");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualVerify = () => {
    if (!manualCode) {
      toast.error("Please enter a QR code or Batch ID");
      return;
    }
    setIsProcessing(true);
    // Trigger query update which triggers effect
  };

  const handleAskGemini = async () => {
    if (!scanResult?.medicine) return;
    
    setIsAskingAi(true);
    try {
      const response = await askGemini({
        medicineName: scanResult.medicine.medicineName,
        manufacturer: scanResult.medicine.manufacturerName,
        details: `Batch: ${scanResult.medicine.batchNumber}, Expiry: ${scanResult.medicine.expiryDate}`
      });
      setAiResponse(response);
    } catch (error) {
      toast.error("Failed to get AI insights");
      console.error(error);
    } finally {
      setIsAskingAi(false);
    }
  };

  const resetScan = () => {
    setScanResult(null);
    setManualCode("");
    setAiResponse(null);
    setIsProcessing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-samarkan tracking-wide">
          Scan Medicine
        </h1>
        <p className="text-gray-400">
          Verify authenticity instantly using blockchain technology
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Scanner Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-slate-900/50 border-slate-800 overflow-hidden h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <QrCode className="h-5 w-5 text-cyan-400" />
                QR Scanner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!scanResult ? (
                <div className="space-y-6">
                  <QRScanner 
                    onScanSuccess={handleScanSuccess}
                    onScanFailure={(err) => {}}
                  />
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-800" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-slate-900 px-2 text-gray-500">Or enter manually</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter Batch ID / QR Data"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      className="bg-slate-950 border-slate-800"
                    />
                    <Button 
                      onClick={handleManualVerify}
                      disabled={isProcessing || !manualCode}
                      className="bg-cyan-500 hover:bg-cyan-600"
                    >
                      {isProcessing ? <Search className="h-4 w-4 animate-spin" /> : "Verify"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-8 space-y-6">
                  <div className={`h-24 w-24 rounded-full flex items-center justify-center ${
                    scanResult.status === "genuine" 
                      ? "bg-green-500/10 text-green-500 shadow-[0_0_30px_rgba(34,197,94,0.2)]" 
                      : "bg-red-500/10 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
                  }`}>
                    {scanResult.status === "genuine" ? (
                      <CheckCircle className="h-12 w-12" />
                    ) : (
                      <XCircle className="h-12 w-12" />
                    )}
                  </div>
                  
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold text-white">
                      {scanResult.status === "genuine" ? "Authentic Medicine" : "Verification Failed"}
                    </h3>
                    <p className="text-gray-400 max-w-xs mx-auto">
                      {scanResult.status === "genuine" 
                        ? "This product has been verified against the manufacturer's blockchain record."
                        : "We could not verify this product in our registry. Please exercise caution."}
                    </p>
                  </div>

                  <Button onClick={resetScan} variant="outline" className="border-slate-700">
                    Scan Another
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Results / Info Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-slate-900/50 border-slate-800 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Sparkles className="h-5 w-5 text-purple-400" />
                Product Details & AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              {scanResult?.medicine ? (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">{scanResult.medicine.medicineName}</h3>
                        <p className="text-cyan-400 text-sm">{scanResult.medicine.manufacturerName}</p>
                      </div>
                      <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/5">
                        Verified
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 block mb-1">Batch Number</span>
                        <span className="text-white font-mono">{scanResult.medicine.batchNumber}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-1">Expiry Date</span>
                        <span className={`font-medium ${
                          new Date(scanResult.medicine.expiryDate) < new Date() ? "text-red-400" : "text-white"
                        }`}>
                          {scanResult.medicine.expiryDate}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-1">Type</span>
                        <span className="text-white capitalize">{scanResult.medicine.medicineType}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-1">MRP</span>
                        <span className="text-white">${scanResult.medicine.mrp}</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Section */}
                  <div className="bg-slate-950/50 rounded-xl p-4 border border-purple-500/20">
                    {!aiResponse ? (
                      <div className="text-center py-4 space-y-3">
                        <Bot className="h-8 w-8 text-purple-400 mx-auto opacity-50" />
                        <p className="text-sm text-gray-400">
                          Get safety information and usage guidelines powered by Gemini AI.
                        </p>
                        <Button 
                          onClick={handleAskGemini} 
                          disabled={isAskingAi}
                          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0"
                        >
                          {isAskingAi ? (
                            <>
                              <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Sparkles className="mr-2 h-4 w-4" />
                              Ask Gemini AI
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-3"
                      >
                        <div className="flex items-center gap-2 text-purple-300 border-b border-purple-500/20 pb-2">
                          <Sparkles className="h-4 w-4" />
                          <span className="font-semibold text-sm">Gemini Analysis</span>
                        </div>
                        <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                          {aiResponse}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12 opacity-50">
                  <div className="h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center">
                    <Search className="h-8 w-8 text-gray-500" />
                  </div>
                  <p className="text-gray-400">
                    Scan a medicine to view details and AI insights here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}