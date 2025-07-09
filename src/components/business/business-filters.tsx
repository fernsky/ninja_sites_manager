import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComboboxSearchable } from "@/components/ui/combobox-searchable";
import { api } from "@/trpc/react";

import {
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Edit,
} from "lucide-react";

interface BusinessFiltersProps {
  wardNumber?: number;
  areaCode?: string;
  enumeratorId?: string;
  status?: "pending" | "approved" | "rejected" | "requested_for_edit";
  onFilterChange: (key: string, value: any) => void;
}

export function BusinessFilters({
  wardNumber,
  areaCode,
  enumeratorId,
  status,
  onFilterChange,
}: BusinessFiltersProps) {
  const { data: areas } = api.area.getAreas.useQuery({ status: "all" });
  const { data: enumerators } = api.admin.getEnumerators.useQuery({
    filters: {},
    sorting: {
      field: "wardNumber",
      order: "asc",
    },
  });

  const statusOptions = [
    {
      value: "pending",
      label: "Pending",
      icon: Clock,
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "approved",
      label: "Approved",
      icon: CheckCircle2,
      color: "bg-green-100 text-green-800",
    },
    {
      value: "rejected",
      label: "Rejected",
      icon: AlertCircle,
      color: "bg-red-100 text-red-800",
    },
    {
      value: "requested_for_edit",
      label: "Edit Requested",
      icon: Edit,
      color: "bg-blue-100 text-blue-800",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          Ward Number
        </Label>
        <Select
          value={wardNumber?.toString()}
          onValueChange={(value) =>
            onFilterChange("wardId", value ? parseInt(value) : undefined)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All Wards" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Wards</SelectItem>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((ward) => (
              <SelectItem key={ward} value={ward.toString()}>
                Ward {ward}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          Area Code
        </Label>
        <ComboboxSearchable
          options={[
            { value: "", label: "All Areas" },
            ...(areas?.map((area) => ({
              value: area.code.toString(),
              label: `Area ${area.code} (Ward ${area.wardNumber})`,
            })) ?? []),
          ]}
          value={areaCode || ""}
          onChange={(value) => onFilterChange("areaCode", value || undefined)}
          placeholder="Select area..."
          className={""}
        />
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          Enumerator
        </Label>
        <ComboboxSearchable
          options={[
            { value: "", label: "All Enumerators" },
            ...(enumerators?.map((e) => ({
              value: e.id,
              label: e.name,
            })) ?? []),
          ]}
          value={enumeratorId || ""}
          onChange={(value) =>
            onFilterChange("enumeratorId", value || undefined)
          }
          placeholder="Select enumerator..."
          className=""
        />
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          Status
        </Label>
        <Select
          value={status || ""}
          onValueChange={(value: any) =>
            onFilterChange("status", value || undefined)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusOptions.map((option) => {
              const Icon = option.icon;
              return (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {option.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
