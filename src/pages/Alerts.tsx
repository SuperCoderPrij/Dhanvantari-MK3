import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck, AlertTriangle, Info, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Alerts() {
  const alerts = useQuery(api.alerts.getUserAlerts, {});
  const markAllAsRead = useMutation(api.alerts.markAllAsRead);
  const markAsRead = useMutation(api.alerts.markAsRead);

  const getIcon = (severity: string) => {
    switch (severity) {
      case "critical": return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "warning": return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Alerts & Notifications</h1>
          <p className="text-muted-foreground mt-2">
            Stay updated with important health notifications
          </p>
        </div>
        {alerts && alerts.length > 0 && (
          <Button variant="outline" size="sm" onClick={() => markAllAsRead()}>
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {alerts?.map((alert) => (
          <Card key={alert._id} className={alert.isRead ? "opacity-70" : "border-l-4 border-l-primary"}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getIcon(alert.severity)}</div>
                  <div>
                    <CardTitle className="text-lg">{alert.title}</CardTitle>
                    <CardDescription>
                      {formatDistanceToNow(alert.createdAt, { addSuffix: true })}
                    </CardDescription>
                  </div>
                </div>
                {!alert.isRead && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => markAsRead({ alertId: alert._id })}
                  >
                    <span className="sr-only">Mark as read</span>
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{alert.message}</p>
            </CardContent>
          </Card>
        ))}

        {alerts?.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                No Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                You're all caught up! No new notifications.
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}