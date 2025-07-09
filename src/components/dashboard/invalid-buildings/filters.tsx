import { api } from "@/trpc/react";
import { ComboboxSearchable } from "@/components/ui/combobox-searchable";
import { Label } from "@/components/ui/label";
import { Users, MapPin, Building2 } from "lucide-react";

interface InvalidBuildingsFiltersProps {
  wardNumber?: number;
  areaCode?: number;
  enumeratorId?: string;
  onFilterChange: (key: string, value: any) => void;
}

export function InvalidBuildingsFilters({
  wardNumber,
  areaCode,
  enumeratorId,
  onFilterChange,
}: InvalidBuildingsFiltersProps) {
  const { data: areas } = api.area.getAreas.useQuery({ status: "all" });
  const { data: enumerators } = api.admin.getEnumerators.useQuery({
    // pageIndex: 0,
    // pageSize: 10,
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

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="w-full sm:w-auto space-y-1.5">
        <Label className="text-xs font-medium">
          <div className="flex items-center gap-2">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
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
          placeholder="Search ward..."
          className="w-full sm:w-[200px]"
        />
      </div>

      <div className="w-full sm:w-auto space-y-1.5">
        <Label className="text-xs font-medium">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            Area Code
          </div>
        </Label>
        <ComboboxSearchable
          options={areaOptions}
          value={areaCode?.toString() || "all"}
          onChange={(value) =>
            onFilterChange(
              "areaCode",
              value === "all" ? undefined : parseInt(value),
            )
          }
          placeholder="Search area..."
          className="w-full sm:w-[200px]"
        />
      </div>

      <div className="w-full sm:w-auto space-y-1.5">
        <Label className="text-xs font-medium">
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            Enumerator
          </div>
        </Label>
        <ComboboxSearchable
          options={enumeratorOptions}
          value={enumeratorId || "all"}
          onChange={(value) =>
            onFilterChange("enumeratorId", value === "all" ? undefined : value)
          }
          placeholder="Search enumerator..."
          className="w-full sm:w-[200px]"
        />
      </div>
    </div>
  );
}
