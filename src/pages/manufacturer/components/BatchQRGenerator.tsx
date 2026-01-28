import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Box, Loader2, Download, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function BatchQRGenerator() {
  const medicines = useQuery(api.medicines.getManufacturerMedicines);
  
  const [selectedMedicineId, setSelectedMedicineId] = useState<string>("");
  const medicineUnits = useQuery(api.medicines.getMedicineUnits, 
    selectedMedicineId ? { medicineId: selectedMedicineId as Id<"medicines"> } : "skip"
  );
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadSingleQR = (tokenId: string, fileName: string) => {
    const canvas = document.getElementById(`qr-canvas-${tokenId}`) as HTMLCanvasElement;
    if (canvas) {
      try {
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("QR Code downloaded");
      } catch (e) {
        console.error("Download failed", e);
        toast.error("Failed to download QR code");
      }
    } else {
      toast.error("QR Code not rendered yet");
    }
  };

  const downloadBatchQRs = async () => {
    if (!medicineUnits || medicineUnits.length === 0) return;
    
    setIsDownloading(true);
    
    try {
      // Dynamically import JSZip
      const JSZipModule = await import("jszip");
      const JSZip = JSZipModule.default || JSZipModule;
      
      const zip = new JSZip();
      const folder = zip.folder("qr-codes");
      
      if (!folder) throw new Error("Failed to create zip folder");

      let count = 0;
      
      // Generate QR for each unit
      for (const unit of medicineUnits) {
        const canvas = document.getElementById(`qr-canvas-${unit.tokenId}`) as HTMLCanvasElement;
        if (canvas) {
          try {
            const dataUrl = canvas.toDataURL("image/png");
            const base64Data = dataUrl.split(',')[1];
            folder.file(`${unit.tokenId}.png`, base64Data, { base64: true });
            count++;
          } catch (e) {
            console.warn("Canvas export failed for unit:", unit.tokenId);
          }
        }
      }
      
      if (count === 0) {
        toast.error("No QR codes found to download", {
          description: "Please ensure QR codes are visible on screen."
        });
        return;
      }

      const content = await zip.generateAsync({ type: "blob" });
      
      if (content.size === 0) {
        throw new Error("Generated zip file is empty");
      }

      const fileName = `batch-${selectedMedicineId}-qrs.zip`;
      
      // Direct download using anchor tag
      const url = window.URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.style.display = "none";
      document.body.appendChild(link);
      
      link.click();
      
      // Cleanup after a longer delay to ensure download starts
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 2000);
      
      toast.success("Download started", {
        description: `${count} QR codes zipped.`
      });
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download QR codes");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Box className="h-5 w-5 text-cyan-400" />
          Select Medicine Batch
        </CardTitle>
        <CardDescription>Choose a medicine batch to generate QR codes for all units</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="text-gray-300">Medicine Batch</Label>
          <Select onValueChange={setSelectedMedicineId} value={selectedMedicineId}>
            <SelectTrigger className="bg-slate-950/50 border-slate-800 text-white">
              <SelectValue placeholder="Select a medicine..." />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-white">
              {medicines?.map((medicine) => (
                <SelectItem key={medicine._id} value={medicine._id}>
                  {medicine.medicineName} (Batch: {medicine.batchNumber})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedMedicineId && medicineUnits && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Found {medicineUnits.length} units
              </div>
              <Button 
                type="button"
                onClick={downloadBatchQRs} 
                disabled={isDownloading || medicineUnits.length === 0}
                className="bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                {isDownloading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Download All QRs (ZIP)
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {medicineUnits.map((unit) => (
                <div key={unit._id} className="bg-slate-950/50 p-4 rounded-lg border border-slate-800 flex flex-col items-center gap-3 group relative">
                  <div className="bg-white p-2 rounded">
                    <QRCodeCanvas
                      id={`qr-canvas-${unit.tokenId}`}
                      value={`${window.location.origin}/verify?contract=${JSON.parse(unit.qrCodeData).contract}&tokenId=${unit.tokenId}`}
                      size={120}
                      level={"M"}
                      includeMargin={true}
                    />
                  </div>
                  <div className="text-center w-full">
                    <div className="text-xs text-gray-400 font-mono truncate w-full" title={unit.tokenId}>
                      {unit.tokenId}
                    </div>
                    <div className="text-xs text-cyan-500">Unit #{unit.serialNumber}</div>
                  </div>
                  
                  {/* Individual Download Button */}
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 hover:bg-cyan-600 text-white border border-slate-700"
                    onClick={() => downloadSingleQR(unit.tokenId, `qr-${unit.tokenId}.png`)}
                    title="Download PNG"
                  >
                    <FileDown className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
