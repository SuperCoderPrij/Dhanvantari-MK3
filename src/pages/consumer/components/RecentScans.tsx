import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { History, Search, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router";

interface RecentScansProps {
  limit?: number;
  showViewAll?: boolean;
}

export function RecentScans({ limit = 5, showViewAll = true }: RecentScansProps) {
  const navigate = useNavigate();
  const scanHistory = useQuery(api.scans.getUserScanHistory, { limit });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <History className="h-4 w-4 text-cyan-400" />
          {showViewAll ? "Recent Scans" : "Scan History"}
        </h3>
        {showViewAll && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-cyan-400 hover:text-cyan-300"
            onClick={() => navigate("/dashboard/history")}
          >
            View All
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {scanHistory === undefined ? (
          <div className="text-center py-8 text-gray-500">Loading history...</div>
        ) : scanHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-slate-900/50 rounded-xl border border-slate-800">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No scans yet</p>
          </div>
        ) : (
          scanHistory.map((scan) => (
            <div
              key={scan._id}
              className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-center justify-between hover:border-cyan-500/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                  scan.scanResult.isVerified ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                }`}>
                  {scan.scanResult.isVerified ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                </div>
                <div>
                  <div className="font-medium text-white">
                    {scan.medicine?.medicineName || "Unknown Item"}
                  </div>
                  {scan.medicine?.manufacturerName && (
                    <div className="text-xs text-gray-400">
                      by {scan.medicine.manufacturerName}
                    </div>
                  )}
                  <div className="text-xs text-gray-400">
                    {new Date(scan._creationTime).toLocaleDateString()} • {new Date(scan._creationTime).toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <Badge variant="outline" className={
                scan.scanResult.isVerified 
                  ? "border-green-500/20 text-green-400" 
                  : "border-red-500/20 text-red-400"
              }>
                {scan.scanResult.isVerified ? "Genuine" : "Suspicious"}
              </Badge>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}