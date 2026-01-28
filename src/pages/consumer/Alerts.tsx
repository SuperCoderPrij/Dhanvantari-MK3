import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Alerts() {
  const alerts = useQuery(api.alerts.getUserAlerts, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Alerts & Notifications</h1>
        <p className="text-muted-foreground mt-2">
          Stay updated with important health and medicine alerts
        </p>
      </div>

      <div className="space-y-4">
        {alerts === undefined ? (
          <div className="text-center py-12 text-muted-foreground">Loading alerts...</div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-12 bg-muted/10 rounded-lg border border-dashed">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No new alerts</p>
          </div>
        ) : (
          alerts.map((alert, index) => (
            <motion.div
              key={alert._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`border-l-4 ${
                alert.severity === "critical" ? "border-l-red-500" : 
                alert.severity === "warning" ? "border-l-yellow-500" : "border-l-blue-500"
              }`}>
                <CardContent className="p-4 flex gap-4">
                  <div className={`p-2 rounded-full h-fit ${
                    alert.severity === "critical" ? "bg-red-500/10 text-red-500" : 
                    alert.severity === "warning" ? "bg-yellow-500/10 text-yellow-500" : "bg-blue-500/10 text-blue-500"
                  }`}>
                    {alert.severity === "critical" ? <AlertTriangle className="h-5 w-5" /> :
                     alert.severity === "warning" ? <Info className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{alert.title}</h3>
                      <span className="text-xs text-muted-foreground">
                        {new Date(alert._creationTime).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}