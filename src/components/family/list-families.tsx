import React, { useState } from "react";
import { FamilyFilters } from "./family-filters";

export function ListFamilies() {
  const [filters, setFilters] = useState<{
    wardNo?: number;
    areaCode?: string;
    enumeratorId?: string;
    status?: string;
  }>({});

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ...existing code...

  return (
    <div className="space-y-4">
      <FamilyFilters
        wardNo={filters.wardNo}
        areaCode={filters.areaCode}
        enumeratorId={filters.enumeratorId}
        status={filters.status as any}
        onFilterChange={handleFilterChange}
      />

      {/* ...existing table code... */}
    </div>
  );
}
