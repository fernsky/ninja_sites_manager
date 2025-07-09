import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Building2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { AssignmentDialog } from "./assignment-dialog";
import { useRouter } from "next/navigation";

interface BuildingCardProps {
  building: {
    id: string;
    locality: string;
    tmpWardNumber?: number;
    tmpAreaCode?: string;
    tmpEnumeratorId?: string;
    tmpBuildingToken?: string;
    isWardValid: boolean;
    isAreaValid: boolean;
    isEnumeratorValid: boolean;
    isBuildingTokenValid: boolean;
    enumeratorName?: string;
    areaId?: string;
  };
}

export function BuildingCard({ building }: BuildingCardProps) {
  const [assignmentType, setAssignmentType] = useState<
    "ward" | "area" | "enumerator" | "token" | null
  >(null);
  const router = useRouter();

  const validations = {
    ward: {
      valid: building.isWardValid,
      current: building.tmpWardNumber,
      type: "ward" as const,
    },
    area: {
      valid: building.isAreaValid,
      current: building.tmpAreaCode,
      type: "area" as const,
    },
    enumerator: {
      valid: building.isEnumeratorValid,
      current: building.enumeratorName || building.tmpEnumeratorId,
      type: "enumerator" as const,
    },
    token: {
      valid: building.isBuildingTokenValid,
      current: building.tmpBuildingToken,
      type: "token" as const,
    },
  };

  const handleCardClick = () => {
    router.push(`/buildings/${building.id}`);
  };

  const handleButtonClick = (
    e: React.MouseEvent,
    type: typeof assignmentType,
  ) => {
    e.stopPropagation(); // Prevent card click when clicking the Fix button
    setAssignmentType(type);
  };

  return (
    <>
      <Card
        className="cursor-pointer transition-colors hover:bg-accent/50"
        onClick={handleCardClick}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{building.locality}</span>
            </div>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            {Object.entries(validations).map(([key, validation]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {key === "ward" && (
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  )}
                  {key === "area" && (
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  )}
                  {key === "enumerator" && (
                    <Users className="h-4 w-4 text-muted-foreground" />
                  )}
                  {key === "token" && (
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Badge
                    variant={validation.valid ? "secondary" : "destructive"}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
                    {validation.current || "Not assigned"}
                  </Badge>
                </div>
                {!validation.valid && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleButtonClick(e, validation.type)}
                  >
                    Fix
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AssignmentDialog
        buildingId={building.id}
        isOpen={assignmentType !== null}
        onClose={() => setAssignmentType(null)}
        type={assignmentType!}
        currentValue={
          assignmentType === "ward"
            ? building.tmpWardNumber
            : assignmentType === "area"
              ? building.tmpAreaCode
              : assignmentType === "enumerator"
                ? building.tmpEnumeratorId
                : building.tmpBuildingToken
        }
        areaId={building.areaId}
        wardNumber={building.tmpWardNumber}
      />
    </>
  );
}
