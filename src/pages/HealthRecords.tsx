import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, User } from "lucide-react";

export default function HealthRecords() {
  const records = useQuery(api.healthRecords.getUserRecords, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Health Records</h1>
        <p className="text-muted-foreground mt-2">
          Manage your medical history and documents
        </p>
      </div>

      <div className="grid gap-4">
        {records?.map((record) => (
          <Card key={record._id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>{record.title}</CardTitle>
                  <CardDescription>{record.description}</CardDescription>
                </div>
                <Badge variant="outline" className="capitalize">
                  {record.recordType.replace("_", " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {record.date}
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {record.isPrivate ? "Private Record" : "Shared with Doctor"}
                </div>
                {record.medications && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {record.medications.length} Linked Medications
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {records?.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No records found</h3>
            <p className="text-muted-foreground">
              You haven't added any health records yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
