import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Pill, FileText, Scan } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardHome() {
  const medicines = useQuery(api.medicines.list, { limit: 5 });
  const scans = useQuery(api.scans.getUserScans, { limit: 5 });
  const records = useQuery(api.healthRecords.getUserRecords, {});

  const stats = [
    {
      title: "Total Scans",
      value: scans?.length || 0,
      icon: Scan,
      color: "text-blue-500",
    },
    {
      title: "Verified Medicines",
      value: medicines?.filter((m) => m.isActive).length || 0,
      icon: Pill,
      color: "text-green-500",
    },
    {
      title: "Health Records",
      value: records?.length || 0,
      icon: FileText,
      color: "text-purple-500",
    },
    {
      title: "Active Prescriptions",
      value: 0,
      icon: Activity,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome to Dhanvantari</h1>
        <p className="text-muted-foreground mt-2">
          Your comprehensive healthcare and pharmaceutical verification platform
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Scans</CardTitle>
            <CardDescription>Your latest medicine verification scans</CardDescription>
          </CardHeader>
          <CardContent>
            {scans && scans.length > 0 ? (
              <div className="space-y-4">
                {scans.slice(0, 3).map((scan) => (
                  <div key={scan._id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">
                        {scan.scanResult.medicineName || "Unknown Medicine"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Confidence: {(scan.scanResult.confidence * 100).toFixed(1)}%
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        scan.scanResult.isVerified
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {scan.scanResult.isVerified ? "Verified" : "Unverified"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No scans yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Health Records</CardTitle>
            <CardDescription>Your recent health records</CardDescription>
          </CardHeader>
          <CardContent>
            {records && records.length > 0 ? (
              <div className="space-y-4">
                {records.slice(0, 3).map((record) => (
                  <div key={record._id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{record.title}</p>
                      <p className="text-sm text-muted-foreground">{record.recordType}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{record.date}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No records yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}