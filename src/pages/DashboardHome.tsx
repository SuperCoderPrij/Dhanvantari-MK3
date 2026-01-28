import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Pill, FileText, Scan } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardHome() {
  const navigate = useNavigate();
  const medicines = useQuery(api.medicines.getManufacturerMedicines);
  const scans = useQuery(api.scans.getUserScanHistory, { limit: 5 });
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Scans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {scans?.map((scan) => (
                <div key={scan._id} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{scan.medicine?.medicineName || "Unknown"}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(scan.scanDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                      {scan.scanResult.isVerified ? "Verified" : "Failed"}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Medicines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {medicines?.slice(0, 5).map((m) => (
                <div key={m._id} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{m.medicineName}</p>
                    <p className="text-sm text-muted-foreground">{m.batchNumber}</p>
                  </div>
                  <div className="ml-auto font-medium">
                      {m.quantity} units
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}