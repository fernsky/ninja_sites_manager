import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ComboboxSearchable } from "@/components/ui/combobox-searchable";
import { api } from "@/trpc/react";
import { useState } from "react";
import { toast } from "sonner";

interface AssignmentDialogProps {
  buildingId: string;
  isOpen: boolean;
  onClose: () => void;
  type: "ward" | "area" | "enumerator" | "token";
  currentValue?: string | number;
  areaId?: string;
  wardNumber?: number;
}

export function AssignmentDialog({
  buildingId,
  isOpen,
  onClose,
  type,
  currentValue,
  areaId,
  wardNumber,
}: AssignmentDialogProps) {
  const [selectedValue, setSelectedValue] = useState<string>();

  const utils = api.useContext();

  const { data: wards } = api.ward.getWards.useQuery(undefined, {
    enabled: type === "ward",
  });

  const { data: areas } = api.area.getAreas.useQuery(
    { wardNumber: Number(wardNumber) },
    { enabled: type === "area" && wardNumber !== undefined },
  );

  const { data: enumerators } = api.admin.getEnumerators.useQuery({
    // pageIndex: 0,
    // pageSize: 10,
    filters: {},
    sorting: {
      field: "wardNumber",
      order: "asc",
    },
  });

  const { data: tokens } = api.area.getAreaTokens.useQuery(
    { areaId: areaId!, status: "unallocated" },
    { enabled: type === "token" && areaId !== undefined },
  );

  const assignWard = api.building.assignWard.useMutation({
    onSuccess: () => {
      utils.building.getById.invalidate({ id: buildingId });
      toast.success("Ward assigned successfully");
      utils.building.getInvalidBuildings.invalidate();
      onClose();
    },
  });

  const assignArea = api.building.assignArea.useMutation({
    onSuccess: () => {
      utils.building.getById.invalidate({ id: buildingId });
      toast.success("Area assigned successfully");
      utils.building.getInvalidBuildings.invalidate();
      onClose();
    },
  });

  const assignEnumerator = api.building.assignEnumerator.useMutation({
    onSuccess: () => {
      utils.building.getById.invalidate({ id: buildingId });
      toast.success("Enumerator assigned successfully");
      utils.building.getInvalidBuildings.invalidate();
      onClose();
    },
  });

  const assignToken = api.building.assignBuildingToken.useMutation({
    onSuccess: () => {
      utils.building.getById.invalidate({ id: buildingId });
      toast.success("Building token assigned successfully");
      utils.building.getInvalidBuildings.invalidate();
      onClose();
    },
  });

  const options = (() => {
    switch (type) {
      case "ward":
        return (
          wards?.map((ward) => ({
            value: ward.wardNumber.toString(),
            label: `Ward ${ward.wardNumber}`,
            searchTerms: [`${ward.wardNumber}`],
          })) ?? []
        );
      case "area":
        return (
          areas?.map((area) => ({
            value: area.code.toString(),
            label: `Area ${area.code}`,
            searchTerms: [`${area.code}`],
          })) ?? []
        );
      case "enumerator":
        return (
          enumerators?.map((enumerator) => ({
            value: enumerator.id,
            label: enumerator.name,
            searchTerms: [enumerator.name],
          })) ?? []
        );
      case "token":
        return (
          tokens?.tokens.map((token) => ({
            value: token.token,
            label: token.token,
            searchTerms: [token.token],
          })) ?? []
        );
      default:
        return [];
    }
  })();

  const handleAssign = async () => {
    if (!selectedValue) return;

    try {
      switch (type) {
        case "ward":
          await assignWard.mutateAsync({
            buildingId,
            wardNumber: parseInt(selectedValue),
          });
          break;
        case "area":
          await assignArea.mutateAsync({
            buildingId,
            areaCode: parseInt(selectedValue),
          });
          break;
        case "enumerator":
          await assignEnumerator.mutateAsync({
            buildingId,
            enumeratorId: selectedValue,
          });
          break;
        case "token":
          await assignToken.mutateAsync({
            buildingId,
            buildingToken: selectedValue,
          });
          break;
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const titles = {
    ward: "Assign Ward",
    area: "Assign Area",
    enumerator: "Assign Enumerator",
    token: "Assign Building Token",
  };

  const placeholders = {
    ward: "Search ward...",
    area: "Search area...",
    enumerator: "Search enumerator...",
    token: "Search token...",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] w-[90vw]">
        <DialogHeader>
          <DialogTitle>{titles[type]}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="w-full">
            <ComboboxSearchable
              options={options}
              value={selectedValue || ""}
              onChange={setSelectedValue}
              placeholder={placeholders[type]}
              className="w-full"
              popoverProps={{
                className: "max-h-[300px]",
                align: "center",
              }}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={!selectedValue}>
              Assign
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
