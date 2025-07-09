import React from "react";
import { useAggregateStore } from "@/hooks/use-aggregate-store";
import { api } from "@/trpc/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectGroup,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { X, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { localizeNumber } from "@/lib/utils/localize-number";

export function AggregateFiltersPanel() {
  const { filters, setFilter, resetFilters, view } = useAggregateStore();

  // Fetch data directly from the aggregate buildings
  const { data: wards } = api.aggregate.getDistinctWardNumbers.useQuery();
  const { data: enumerators } = api.aggregate.getDistinctEnumerators.useQuery();
  const { data: areaCodes } = api.aggregate.getDistinctAreaCodes.useQuery();
  const { data: buildingStats } = api.aggregate.getBuildingStats.useQuery(
    undefined,
    {
      enabled: view.viewMode !== "map",
    },
  );

  // Count active filters
  const activeFilterCount = Object.keys(filters).filter(
    (key) => filters[key as keyof typeof filters] !== undefined,
  ).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm">फिल्टरहरू</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {localizeNumber(activeFilterCount, "ne")} सक्रिय
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-muted-foreground"
            onClick={resetFilters}
          >
            <X className="h-3.5 w-3.5 mr-1" />
            रिसेट
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Ward Filter */}
        <div className="w-auto">
          <Select
            value={filters.wardId ?? "all"}
            onValueChange={(value) =>
              setFilter("wardId", value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="h-8 text-xs min-w-[120px]">
              <SelectValue placeholder="वडा" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">सबै वडा</SelectItem>
                {wards?.map((ward) => (
                  <SelectItem key={ward.id} value={ward.id}>
                    वडा {localizeNumber(ward.wardNumber, "ne")}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Area Code Filter */}
        <div className="w-auto">
          <Select
            value={filters.areaCode ?? "all"}
            onValueChange={(value) =>
              setFilter("areaCode", value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="h-8 text-xs min-w-[120px]">
              <SelectValue placeholder="क्षेत्र कोड" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">सबै क्षेत्र</SelectItem>
              {areaCodes?.map((area) => (
                <SelectItem key={area.id} value={area.id}>
                  {area.areaCode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Enumerator Filter */}
        <div className="w-auto">
          <Select
            value={filters.enumeratorId ?? "all"}
            onValueChange={(value) =>
              setFilter("enumeratorId", value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="h-8 text-xs min-w-[140px]">
              <SelectValue placeholder="सर्वेक्षक" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">सबै सर्वेक्षक</SelectItem>
              {enumerators?.map((enumerator) => (
                <SelectItem key={enumerator.id} value={enumerator.id}>
                  {enumerator.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Has Households Filter */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="has-households-filter"
            checked={filters.hasHouseholds === true}
            onCheckedChange={(checked) =>
              setFilter(
                "hasHouseholds",
                checked === "indeterminate" ? undefined : checked || undefined,
              )
            }
            className="h-4 w-4"
          />
          <label
            htmlFor="has-households-filter"
            className={cn(
              "text-xs cursor-pointer",
              filters.hasHouseholds === true && "font-medium text-primary",
            )}
          >
            परिवारहरू (
            {localizeNumber(buildingStats?.totalHouseholds || 0, "ne")})
          </label>
        </div>

        {/* Has Businesses Filter */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="has-businesses-filter"
            checked={filters.hasBusinesses === true}
            onCheckedChange={(checked) =>
              setFilter(
                "hasBusinesses",
                checked === "indeterminate" ? undefined : checked || undefined,
              )
            }
            className="h-4 w-4"
          />
          <label
            htmlFor="has-businesses-filter"
            className={cn(
              "text-xs cursor-pointer",
              filters.hasBusinesses === true && "font-medium text-primary",
            )}
          >
            व्यवसायहरू (
            {localizeNumber(buildingStats?.totalBusinesses || 0, "ne")})
          </label>
        </div>
      </div>
    </div>
  );
}
