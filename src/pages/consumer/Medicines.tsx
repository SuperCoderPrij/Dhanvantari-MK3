import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pill, Calendar, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Medicines() {
  // Using scan history as a proxy for "My Medicines" for now
  const scans = useQuery(api.scans.getUserScanHistory, { limit: 50 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Medicines</h1>
        <p className="text-muted-foreground mt-2">
          History of your scanned and verified medicines
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {scans === undefined ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">Loading medicines...</div>
        ) : scans.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-muted/10 rounded-lg border border-dashed">
            <Pill className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No medicines scanned yet</p>
          </div>
        ) : (
          scans.map((scan, index) => (
            <motion.div
              key={scan._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold line-clamp-1">
                      {scan.medicine?.medicineName || "Unknown Medicine"}
                    </CardTitle>
                    {scan.scanResult.isVerified ? (
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Manufacturer</span>
                      <span className="font-medium">{scan.medicine?.manufacturerName || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Batch</span>
                      <span className="font-medium">{scan.medicine?.batchNumber || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Scanned</span>
                      <span className="font-medium flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(scan.scanDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <Badge 
                    variant={scan.scanResult.isVerified ? "default" : "destructive"}
                    className="w-full justify-center"
                  >
                    {scan.scanResult.isVerified ? "Verified Authentic" : "Potential Counterfeit"}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}