import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function HealthRecords() {
  const records = useQuery(api.healthRecords.getUserRecords, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Health Records</h1>
          <p className="text-muted-foreground mt-2">
            Manage your medical history and documents
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Record
        </Button>
      </div>

      <div className="grid gap-4">
        {records === undefined ? (
          <div className="text-center py-12 text-muted-foreground">Loading records...</div>
        ) : records.length === 0 ? (
          <div className="text-center py-12 bg-muted/10 rounded-lg border border-dashed">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No health records found</p>
            <Button variant="link" className="mt-2">Add your first record</Button>
          </div>
        ) : (
          records.map((record, index) => (
            <motion.div
              key={record._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{record.title}</h3>
                      <p className="text-sm text-muted-foreground">{record.description}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(record.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline">View Details</Button>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}