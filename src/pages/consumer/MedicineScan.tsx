import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Upload, Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function MedicineScan() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const recordScan = useMutation(api.scans.recordScan);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setScanResult(null);
    }
  };

  const handleScan = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }

    setIsScanning(true);
    try {
      // Upload image to Convex storage
      const uploadUrl = await generateUploadUrl();
      const uploadResult = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": selectedImage.type },
        body: selectedImage,
      });
      
      if (!uploadResult.ok) throw new Error("Upload failed");
      
      const { storageId } = await uploadResult.json();

      // Simulate AI scanning (in production, this would call an AI service)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock scan result
      const mockResult = {
        medicineName: "Sample Medicine",
        confidence: 0.85,
        detectedText: "Sample text from image",
        isVerified: Math.random() > 0.3,
      };

      // Save scan to database
      await recordScan({
          medicineId: undefined, // Or handle this if needed
          scanResult: mockResult.isVerified ? "genuine" : "suspicious",
          location: "Web Upload",
          deviceInfo: navigator.userAgent
      });

      setScanResult(mockResult);
      toast.success("Scan completed successfully!");
    } catch (error) {
      console.error("Scan error:", error);
      toast.error("Failed to scan medicine");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Scan Medicine</h1>
        <p className="text-muted-foreground mt-2">
          Upload or capture an image of medicine packaging to verify authenticity
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
            <CardDescription>Select an image of the medicine packaging</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center min-h-[200px] flex flex-col items-center justify-center">
              {previewUrl ? (
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded object-contain"
                />
              ) : (
                <div className="space-y-4">
                  <Camera className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">No image selected</p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <label className="flex-1 cursor-pointer">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <div className="w-full h-10 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Image
                </div>
              </label>
              <Button
                onClick={handleScan}
                disabled={!selectedImage || isScanning}
                className="flex-1"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4 mr-2" />
                    Scan
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scan Results</CardTitle>
            <CardDescription>Verification details and medicine information</CardDescription>
          </CardHeader>
          <CardContent>
            {scanResult ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div
                  className={`p-4 rounded-lg ${
                    scanResult.isVerified ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {scanResult.isVerified ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <p className={`font-semibold ${scanResult.isVerified ? "text-green-500" : "text-red-500"}`}>
                        {scanResult.isVerified ? "Verified Medicine" : "Unverified Medicine"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Medicine Name</p>
                    <p className="font-medium">{scanResult.medicineName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Confidence</p>
                    <p className="font-medium">{(scanResult.confidence * 100).toFixed(1)}%</p>
                  </div>
                  {scanResult.detectedText && (
                    <div>
                      <p className="text-sm text-muted-foreground">Detected Text</p>
                      <p className="font-medium text-sm">{scanResult.detectedText}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Scan results will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}