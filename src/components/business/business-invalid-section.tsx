import { Store, MapPin, Users, Binary, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BusinessInvalidSectionProps {
  business: {
    id: string;
    wardNo?: number;
    tmpAreaCode?: string;
    tmpEnumeratorId?: string;
    businessToken?: string;
    isWardValid?: boolean;
    isAreaValid?: boolean;
    isEnumeratorValid?: boolean;
    isBuildingTokenValid?: boolean;
    enumeratorName?: string;
    areaId?: string;
  };
}

export function BusinessInvalidSection({
  business,
}: BusinessInvalidSectionProps) {
  const hasInvalidFields =
    !business.isWardValid ||
    !business.isAreaValid ||
    !business.isEnumeratorValid ||
    !business.isBuildingTokenValid;

  if (!hasInvalidFields) return null;

  const validations = {
    ward: {
      valid: business.isWardValid,
      current: business.wardNo,
      icon: <Store className="h-4 w-4" />,
      label: "Ward",
    },
    area: {
      valid: business.isAreaValid,
      current: business.tmpAreaCode,
      icon: <MapPin className="h-4 w-4" />,
      label: "Area",
    },
    enumerator: {
      valid: business.isEnumeratorValid,
      current: business.enumeratorName || business.tmpEnumeratorId,
      icon: <Users className="h-4 w-4" />,
      label: "Enumerator",
    },
    token: {
      valid: business.isBuildingTokenValid,
      current: business.isBuildingTokenValid,
      icon: <Binary className="h-4 w-4" />,
      label: "Building Token",
    },
  };

  return (
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
                <span className="text-muted-foreground">{validation.icon}</span>
                <Badge variant="destructive">
                  {validation.label}: {validation.current || "Not assigned"}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
