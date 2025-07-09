import { Building2, MapPin, Users, Binary, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { AssignmentDialog } from "../dashboard/invalid-buildings/assignment-dialog";

interface BuildingInvalidSectionProps {
  building: {
    id: string;
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

export function BuildingInvalidSection({
  building,
}: BuildingInvalidSectionProps) {
  const [assignmentType, setAssignmentType] = useState<
    "ward" | "area" | "enumerator" | "token" | null
  >(null);

  const hasInvalidFields =
    !building.isWardValid ||
    !building.isAreaValid ||
    !building.isEnumeratorValid ||
    !building.isBuildingTokenValid;

  if (!hasInvalidFields) return null;

  const validations = {
    ward: {
      valid: building.isWardValid,
      current: building.tmpWardNumber,
      type: "ward" as const,
      icon: <Building2 className="h-4 w-4" />,
      label: "Ward",
    },
    area: {
      valid: building.isAreaValid,
      current: building.tmpAreaCode,
      type: "area" as const,
      icon: <MapPin className="h-4 w-4" />,
      label: "Area",
    },
    enumerator: {
      valid: building.isEnumeratorValid,
      current: building.enumeratorName || building.tmpEnumeratorId,
      type: "enumerator" as const,
      icon: <Users className="h-4 w-4" />,
      label: "Enumerator",
    },
    token: {
      valid: building.isBuildingTokenValid,
      current: building.tmpBuildingToken,
      type: "token" as const,
      icon: <Binary className="h-4 w-4" />,
      label: "Building Token",
    },
  };

  return (
    <>
      <Card className="overflow-hidden">
        <div className="border-b bg-destructive/10 px-4 py-3 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <h3 className="font-medium">Invalid Assignments</h3>
        </div>
        <div className="p-4 space-y-3">
          {Object.entries(validations).map(([key, validation]) => {
            if (validation.valid) return null;
            return (
              <div
                key={key}
                className="flex items-center justify-between gap-4 border-b last:border-0 pb-2 last:pb-0"
              >
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {validation.icon}
                  </span>
                  <Badge variant="destructive">
                    {validation.label}: {validation.current || "Not assigned"}
                  </Badge>
                </div>
                {/* <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAssignmentType(validation.type)}
                >
                  Fix
                </Button> */}
              </div>
            );
          })}
        </div>
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
