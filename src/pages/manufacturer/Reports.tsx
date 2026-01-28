import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Clock, MapPin, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ManufacturerReports() {
  const reports = useQuery(api.reports.getManufacturerReports);
  const updateStatus = useMutation(api.reports.updateReportStatus);

  const handleStatusUpdate = async (reportId: Id<"reports">, status: string) => {
    try {
      await updateStatus({ reportId, status });
      toast.success(`Report marked as ${status}`);
    } catch (error) {
      toast.error("Failed to update report status");
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="text-3xl font-bold text-white">Counterfeit Reports</h1>
        <p className="text-gray-400">Review and manage suspicious activity reports</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        {reports === undefined ? (
          <div className="text-center text-gray-500 py-12">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="text-center text-gray-500 py-12 bg-slate-900/50 rounded-xl border border-slate-800">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500/50" />
            <h3 className="text-lg font-medium text-white">No Reports Found</h3>
            <p>Great news! There are no pending counterfeit reports.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medicine</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports?.map((report) => (
                <TableRow key={report._id}>
                  <TableCell className="font-medium">{report.medicineName || "Unknown"}</TableCell>
                  <TableCell>{report.batchNumber || "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{report.reason}</Badge>
                  </TableCell>
                  <TableCell>{new Date(report._creationTime).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        report.status === "resolved"
                          ? "default"
                          : report.status === "reviewed"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {report.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}