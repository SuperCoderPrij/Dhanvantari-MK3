import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

export default function Prescriptions() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Prescriptions</h1>
        <p className="text-muted-foreground mt-2">
          View and manage your active prescriptions
        </p>
      </div>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Activity className="h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle className="mb-2">No Active Prescriptions</CardTitle>
          <p className="text-muted-foreground max-w-sm">
            You don't have any active prescriptions at the moment. New prescriptions from your doctor will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
