import { api } from "@/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ComboboxSearchable } from "@/components/ui/combobox-searchable";
import { toast } from "sonner";
import { useState } from "react";
import { Map, KeyRound } from "lucide-react";

interface AreaAssignmentProps {
  buildingId: string;
  currentAreaId?: string | null;
  currentBuildingToken?: string | null;
  isAreaValid?: boolean;
  refetchBuilding: () => void;
}

export function AreaAssignment({
  buildingId,
  currentAreaId,
  currentBuildingToken,
  isAreaValid = false,
  refetchBuilding,
}: AreaAssignmentProps) {
  const [selectedAreaId, setSelectedAreaId] = useState(currentAreaId ?? null);

  const { data: areas } = api.area.getAreas.useQuery({
    status: "all",
  });

  const { data: areaTokens } = api.area.getAreaTokens.useQuery(
    { areaId: selectedAreaId ?? "" },
    { enabled: !!selectedAreaId },
  );

  const assignMutation = api.building.assignAreaUpdate.useMutation({
    onSuccess: () => {
      toast.success("Successfully assigned area");
      refetchBuilding();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleAreaChange = (areaId: string) => {
    setSelectedAreaId(areaId === "none" ? null : areaId);
    assignMutation.mutate({
      buildingId,
      areaId: areaId === "none" ? null : areaId,
      buildingToken: null,
    });
  };

  const handleTokenChange = (token: string) => {
    assignMutation.mutate({
      buildingId,
      areaId: selectedAreaId,
      buildingToken: token === "none" ? null : token,
    });
  };

  return (
    <Card className="h-full border-muted-foreground/20 shadow-sm transition-all hover:border-muted-foreground/30 hover:shadow-md">
      <CardHeader className="space-y-1.5 pb-4">
        <div className="flex items-center space-x-2">
          <div className="rounded-full bg-primary/10 p-2">
            <Map className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-base font-semibold">
            Area Assignment
          </CardTitle>
        </div>
        <CardDescription className="text-xs">
          Assign area and token number to this building
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Select Area
          </label>
          <ComboboxSearchable
            options={[
              { value: "none", label: "None" },
              ...(areas?.map((area) => ({
                value: area.id,
                label: `Area ${area.code} (Ward ${area.wardNumber})`,
                searchTerms: [`${area.code}`, `${area.wardNumber}`],
              })) ?? []),
            ]}
            value={currentAreaId || "none"}
            onChange={handleAreaChange}
            placeholder="Search area..."
            className="w-full transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Select Token
          </label>
          <ComboboxSearchable
            options={[
              { value: "none", label: "None" },
              ...(areaTokens?.tokens
                ?.filter(
                  (token) =>
                    token.status === "unallocated" ||
                    token.token === currentBuildingToken,
                )
                .map((token) => ({
                  value: token.token,
                  label: `Token ${token.token}`,
                  searchTerms: [token.token],
                })) ?? []),
            ]}
            value={currentBuildingToken || "none"}
            onChange={handleTokenChange}
            placeholder="Search token..."
            disabled={!selectedAreaId || selectedAreaId === "none"}
            className="w-full transition-all"
          />
        </div>
      </CardContent>
    </Card>
  );
}
