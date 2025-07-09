import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Store, CheckCircle2 } from "lucide-react";

interface BuildingsStatsProps {
  totalBuildings: number;
  totalFamilies: number;
  avgBusinesses: number;
}

export function BuildingsStats({
  totalBuildings,
  totalFamilies,
  avgBusinesses,
}: BuildingsStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Buildings</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{totalBuildings}</div>
            <Badge variant="secondary">Buildings</Badge>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Families</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{totalFamilies}</div>
            <Badge variant="secondary">Families</Badge>
          </div>
        </CardContent>
      </Card>
      {/* <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Businesses</CardTitle>
          <Store className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{avgBusinesses.toFixed(1)}</div>
            <Badge variant="secondary">Per Building</Badge>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
