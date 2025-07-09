import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComboboxSearchable } from "@/components/ui/combobox-searchable";
import { api } from "@/trpc/react";

interface AreaRequestFiltersProps {
  filters: {
    wardNumber?: number;
    status?: "pending" | "approved" | "rejected";
    enumeratorId?: string;
  };
  onFilterChange: (key: string, value: any) => void;
}

export function AreaRequestFilters({
  filters,
  onFilterChange,
}: AreaRequestFiltersProps) {
  const { data: enumerators } = api.admin.getEnumerators.useQuery({
    // pageIndex: 0,
    // pageSize: 10,
    filters: {},
    sorting: {
      field: "wardNumber",
      order: "asc",
    },
  });

  const enumeratorOptions = [
    { value: "all", label: "All Enumerators" },
    ...(enumerators?.map((enumerator: { id: any; name: any }) => ({
      value: enumerator.id,
      label: enumerator.name,
      searchTerms: [enumerator.name],
    })) ?? []),
  ];

  return (
    <div className="flex items-center gap-2">
      {/* Ward Filter */}
      <div className="w-[160px]">
        <Select
          value={filters.wardNumber?.toString() || "all"}
          onValueChange={(value) =>
            onFilterChange(
              "wardNumber",
              value === "all" ? undefined : parseInt(value),
            )
          }
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Filter by Ward" />
          </SelectTrigger>
          <SelectContent className="z-[10000]">
            <SelectItem value="all">All Wards</SelectItem>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((ward) => (
              <SelectItem key={ward} value={ward.toString()}>
                Ward {ward}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Enumerator Filter */}
      <div className="w-[180px]">
        <ComboboxSearchable
          options={enumeratorOptions}
          value={filters.enumeratorId || "all"}
          onChange={(value) =>
            onFilterChange("enumeratorId", value === "all" ? undefined : value)
          }
          placeholder="Search enumerator..."
          className="min-w-[180px] z-[10000]"
        />
      </div>
    </div>
  );
}
