import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { type ActionHandlerProps } from "./types";
import { MapPin, User, Hash } from "lucide-react";

export function AreaActionCardView({ data, onAction }: ActionHandlerProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.map((area) => (
        <Card key={area.id} className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold">Ward {area.wardNumber}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Hash className="h-4 w-4" />
                    <span>{area.code}</span>
                  </div>
                </div>
                <Badge
                  variant={
                    area.areaStatus?.includes("revision")
                      ? "destructive"
                      : "default"
                  }
                  className="capitalize"
                >
                  {area.areaStatus?.replace(/_/g, " ")}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Enumerator: </span>
                <span className="font-medium">
                  {area.assignedTo ? area.assignedTo.name : "Unassigned"}
                </span>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onAction(area.id, area.areaStatus!, "approve")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onAction(area.id, area.areaStatus!, "reject")}
                >
                  Reject
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
