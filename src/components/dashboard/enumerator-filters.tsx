"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ComboboxSearchable } from "@/components/ui/combobox-searchable";
import { Badge } from "@/components/ui/badge";
import { X, MapPin, User2, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface EnumeratorFilters {
  search?: string;

  wardNumber?: number;

  status?: "active" | "inactive";
}

interface FiltersProps {
  filters: EnumeratorFilters;
  onFiltersChange: (filters: EnumeratorFilters) => void;
}

export function EnumeratorFilters({ filters, onFiltersChange }: FiltersProps) {
  const wardOptions = [
    { value: "all", label: "All Wards" },
    ...Array.from({ length: 8 }, (_, i) => ({
      value: (i + 1).toString(),
      label: `Ward ${i + 1}`,
      searchTerms: [`${i + 1}`, `ward ${i + 1}`],
    })),
  ];

  const statusOptions = [
    {
      value: "active",
      label: "Active",
      icon: User2,
      color: "bg-green-100 text-green-800",
    },
    {
      value: "inactive",
      label: "Inactive",
      icon: Clock,
      color: "bg-yellow-100 text-yellow-800",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Active Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.search && (
          <Badge variant="secondary" className="gap-2">
            <User2 className="h-3 w-3" />
            Search: {filters.search}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => onFiltersChange({ ...filters, search: undefined })}
            />
          </Badge>
        )}
        {filters.wardNumber && (
          <Badge variant="secondary" className="gap-2">
            <MapPin className="h-3 w-3" />
            Ward {filters.wardNumber}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() =>
                onFiltersChange({ ...filters, wardNumber: undefined })
              }
            />
          </Badge>
        )}
        {filters.status && (
          <Badge
            variant="secondary"
            className={`gap-2 ${
              statusOptions.find((s) => s.value === filters.status)?.color
            }`}
          >
            {(() => {
              const StatusIcon =
                statusOptions.find((s) => s.value === filters.status)?.icon ||
                Clock;
              return <StatusIcon className="h-3 w-3" />;
            })()}
            {statusOptions.find((s) => s.value === filters.status)?.label}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => onFiltersChange({ ...filters, status: undefined })}
            />
          </Badge>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Search Filter */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">
            <div className="flex items-center gap-2">
              <User2 className="h-3.5 w-3.5 text-muted-foreground" />
              Search Enumerators
            </div>
          </Label>
          <Input
            placeholder="Search by name..."
            value={filters.search ?? ""}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="w-full"
          />
        </div>

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
            value={filters.wardNumber?.toString() || "all"}
            onChange={(value) =>
              onFiltersChange({
                ...filters,
                wardNumber: value === "all" ? undefined : parseInt(value),
              })
            }
            placeholder="Filter by ward..."
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
            value={filters.status || "all"}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                status:
                  value === "all"
                    ? undefined
                    : (value as "active" | "inactive"),
              })
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
