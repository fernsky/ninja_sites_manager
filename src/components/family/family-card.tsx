import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { FamilySchema } from "@/server/db/schema/family/family";
import Link from "next/link";

interface FamilyCardProps {
  family: FamilySchema;
}

export function FamilyCard({ family }: FamilyCardProps) {
  return (
    <Link href={`/families/${family.id}`}>
      <Card className="transition-colors hover:bg-muted/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">
            {family.headName}
          </CardTitle>
          <Badge>{family.status}</Badge>
        </CardHeader>
        <CardContent>
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Ward No:</dt>
              <dd className="font-medium">{family.wardNo}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Total Members:</dt>
              <dd className="font-medium">{family.totalMembers}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Locality:</dt>
              <dd className="font-medium">{family.locality || "N/A"}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </Link>
  );
}
