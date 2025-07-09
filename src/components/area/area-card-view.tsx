import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { type BaseAreaProps } from "./types";
import { MapPin, User, Hash, Pencil, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

const getStatusVariant = (
  status?: string,
): "default" | "secondary" | "destructive" | "outline" => {
  if (!status) return "secondary";
  switch (status) {
    case "unassigned":
      return "secondary";
    case "ongoing_survey":
      return "default";
    case "revision":
      return "destructive";
    case "asked_for_completion":
      return "outline";
    case "asked_for_revision_completion":
      return "outline";
    case "asked_for_withdrawl":
      return "destructive";
    default:
      return "default";
  }
};

export function AreaCardView({ data }: BaseAreaProps) {
  const router = useRouter();

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
                  variant={getStatusVariant(area.areaStatus)}
                  className="capitalize px-2 py-1 text-xs sm:text-sm font-medium rounded-md shadow-sm transition-all duration-200 hover:opacity-80"
                >
                  {area.areaStatus?.replace(/_/g, " ") || "Unknown"}
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
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/area/update/${area.id}`)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/area/show/${area.id}`)}
                  className="text-gray-600 hover:text-gray-700"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
