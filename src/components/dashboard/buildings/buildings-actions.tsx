import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterDrawer } from "@/components/shared/filters/filter-drawer";
import { BuildingFilters } from "@/components/building/building-filters";
import { Plus } from "lucide-react";
import Link from "next/link";

interface BuildingsActionsProps {
  isDesktop: boolean;
  filters: {
    wardNumber?: number;
    locality: string;
    areaCode?: string;
    mapStatus?: string;
  };
  onFilterChange: (key: string, value: any) => void;
}

export function BuildingsActions({
  isDesktop,
  filters,
  onFilterChange,
}: BuildingsActionsProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {!isDesktop && (
          <FilterDrawer title="Filters">
            <BuildingFilters
              wardNumber={filters.wardNumber || 0}
              areaCode={filters.areaCode || ""}
              mapStatus={filters.mapStatus || ""}
              onFilterChange={onFilterChange}
            />
          </FilterDrawer>
        )}
        <Input
          placeholder="Search locality..."
          className="w-full sm:w-[400px] h-9"
          value={filters.locality || ""}
          onChange={(e) => onFilterChange("locality", e.target.value)}
        />
      </div>
      <Link href="/buildings/create">
        <Button size="sm" className="w-full sm:w-auto">
          <Plus className="mr-1 h-4 w-4" /> Add Building
        </Button>
      </Link>
    </div>
  );
}
