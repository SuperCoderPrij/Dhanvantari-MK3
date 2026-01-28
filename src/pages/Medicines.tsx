import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export default function Medicines() {
  const [search, setSearch] = useState("");
  const medicines = useQuery(api.medicines.list, { searchQuery: search });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Medicines Database</h1>
          <p className="text-muted-foreground mt-2">
            Browse and verify pharmaceutical products
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search medicines..."
          className="pl-9 max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {medicines?.map((medicine) => (
          <Card key={medicine._id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{medicine.name}</CardTitle>
                <Badge variant={medicine.verificationStatus === "verified" ? "default" : "secondary"}>
                  {medicine.verificationStatus}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Manufacturer:</span>
                  <span className="font-medium">{medicine.manufacturer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Batch:</span>
                  <span>{medicine.batchNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expiry:</span>
                  <span>{medicine.expiryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price:</span>
                  <span>${medicine.price}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {medicines?.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No medicines found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
