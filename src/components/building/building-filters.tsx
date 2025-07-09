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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Edit,
  Building2,
} from "lucide-react";

interface BuildingFiltersProps {
  wardNumber: number | undefined;
  areaCode: string | undefined;
  mapStatus: string | undefined;
  enumeratorId?: string;
  status?: string;
  onFilterChange: (key: string, value: any) => void;
}

export function BuildingFilters({
  wardNumber,
  areaCode,
  mapStatus,
  enumeratorId,
  status,
  onFilterChange,
}: BuildingFiltersProps) {
  const { data: areas } = api.area.getAreas.useQuery({ status: "all" });
  const { data: enumerators } = api.admin.getEnumerators.useQuery({
    filters: {},
    sorting: {
      field: "wardNumber",
      order: "asc",
    },
  });

  const wardOptions = [
    { value: "all", label: "All Wards" },
    ...Array.from({ length: 10 }, (_, i) => ({
      value: (i + 1).toString(),
      label: `Ward ${i + 1}`,
      searchTerms: [`${i + 1}`, `ward ${i + 1}`],
    })),
  ];

  const areaOptions = [
    { value: "all", label: "All Areas" },
    ...(areas?.map((area) => ({
      value: area.code.toString(),
      label: `Area ${area.code} (Ward ${area.wardNumber})`,
      searchTerms: [`${area.code}`, `${area.wardNumber}`],
    })) ?? []),
  ];

  const enumeratorOptions = [
    { value: "all", label: "All Enumerators" },
    ...(enumerators?.map((enumerator) => ({
      value: enumerator.id,
      label: enumerator.name,
      searchTerms: [enumerator.name],
    })) ?? []),
  ];

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
    <div className="space-y-4">
      {/* Active Filters */}
      <div className="flex flex-wrap gap-2">
        {wardNumber && (
          <Badge variant="secondary" className="gap-2">
            <MapPin className="h-3 w-3" />
            Ward {wardNumber}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => onFilterChange("wardNumber", undefined)}
            />
          </Badge>
        )}
        {enumeratorId && (
          <Badge variant="secondary" className="gap-2">
            <Users className="h-3 w-3" />
            {enumerators?.find((e) => e.id === enumeratorId)?.name ||
              "Enumerator"}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => onFilterChange("enumeratorId", undefined)}
            />
          </Badge>
        )}
        {status && (
          <Badge
            variant="secondary"
            className={`gap-2 ${statusOptions.find((s) => s.value === status)?.color}`}
          >
            {(() => {
              const StatusIcon =
                statusOptions.find((s) => s.value === status)?.icon || Clock;
              return <StatusIcon className="h-3 w-3" />;
            })()}
            {statusOptions.find((s) => s.value === status)?.label}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => onFilterChange("status", undefined)}
            />
          </Badge>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Ward Filter */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              Ward Number
            </div>
          </Label>
          <ComboboxSearchable
            options={wardOptions}
            value={wardNumber?.toString() || "all"}
            onChange={(value) =>
              onFilterChange(
                "wardNumber",
                value === "all" ? undefined : parseInt(value),
              )
            }
            placeholder="Filter by ward..."
            className="w-full"
          />
        </div>

        {/* Area Code Filter */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              Area Code
            </div>
          </Label>
          <ComboboxSearchable
            options={areaOptions}
            value={areaCode || "all"}
            onChange={(value) =>
              onFilterChange("areaCode", value === "all" ? undefined : value)
            }
            placeholder="Filter by area..."
            className="w-full"
          />
        </div>

        {/* Enumerator Filter */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              Collected By
            </div>
          </Label>
          <ComboboxSearchable
            options={enumeratorOptions}
            value={enumeratorId || "all"}
            onChange={(value) =>
              onFilterChange(
                "enumeratorId",
                value === "all" ? undefined : value,
              )
            }
            placeholder="Filter by enumerator..."
            className="w-full"
          />
        </div>

        {/* Status Filter */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              Status
            </div>
          </Label>
          <Select
            value={status || ""}
            onValueChange={(value) =>
              onFilterChange("status", value === "all" ? undefined : value)
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
                      <Icon className="h-3.5 w-3.5" />
                      {option.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
