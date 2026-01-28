import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Plus, Calendar, User } from "lucide-react";
import { motion } from "framer-motion";

export default function Prescriptions() {
  const prescriptions = useQuery(api.prescriptions.getUserPrescriptions, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Prescriptions</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your digital prescriptions
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Prescription
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {prescriptions === undefined ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">Loading prescriptions...</div>
        ) : prescriptions.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-muted/10 rounded-lg border border-dashed">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No prescriptions found</p>
          </div>
        ) : (
          prescriptions.map((prescription, index) => (
            <motion.div
              key={prescription._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span>{prescription.diagnosis}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      prescription.status === "active" ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"
                    }`}>
                      {prescription.status === "active" ? "Active" : "Completed"}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      Dr. {prescription.doctorId.toString().slice(0, 8)}...
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(prescription.prescriptionDate).toLocaleDateString()} - {new Date(prescription.validUntil).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-3 rounded-md text-sm space-y-2">
                    <span className="font-medium block">Medications:</span>
                    {prescription.medications.map((med: any, i: number) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span>{med.medicineName || med.name || "Medicine"}</span>
                        <span className="text-muted-foreground">{med.dosage}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" className="w-full">Refill</Button>
                    <Button variant="secondary" className="w-full">Details</Button>
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