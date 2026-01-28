import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Calendar, Pill, FileText } from "lucide-react";

export default function Prescriptions() {
  const prescriptions = useQuery(api.prescriptions.getUserPrescriptions, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Prescriptions</h1>
        <p className="text-muted-foreground mt-2">
          View and manage your active prescriptions
        </p>
      </div>

      <div className="grid gap-4">
        {prescriptions?.map((prescription) => (
          <Card key={prescription._id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    {prescription.diagnosis}
                  </CardTitle>
                  <CardDescription>
                    Prescribed on {prescription.prescriptionDate}
                  </CardDescription>
                </div>
                <Badge 
                  variant={prescription.status === "active" ? "default" : "secondary"}
                  className="capitalize"
                >
                  {prescription.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Medications</h4>
                    <div className="space-y-2">
                      {prescription.medications.map((med, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm border p-2 rounded-md">
                          <Pill className="h-4 w-4 mt-0.5 text-blue-500" />
                          <div>
                            <p className="font-medium">Medicine ID: {med.medicineId.slice(0, 8)}...</p>
                            <p className="text-muted-foreground">
                              {med.dosage} - {med.frequency} ({med.duration})
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              "{med.instructions}"
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Details</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Valid until: {prescription.validUntil}</span>
                      </div>
                      {prescription.notes && (
                        <div className="mt-2 p-2 bg-muted rounded-md text-xs">
                          <span className="font-semibold">Notes:</span> {prescription.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {prescriptions?.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Activity className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="mb-2">No Active Prescriptions</CardTitle>
              <p className="text-muted-foreground max-w-sm">
                You don't have any active prescriptions at the moment. New prescriptions from your doctor will appear here.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}