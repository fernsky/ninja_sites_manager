import { Users, Store, MapPin } from "lucide-react";
import { StatCard } from "../shared/stat-card";

interface BuildingStatsGridProps {
  totalFamilies: number;
  totalBusinesses: number;
  wardNumber: number;
}

export function BuildingStatsGrid({
  totalFamilies,
  totalBusinesses,
  wardNumber,
}: BuildingStatsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        icon={Users}
        title="Total Families"
        value={totalFamilies || 0}
      />
      <StatCard
        icon={Store}
        title="Total Businesses"
        value={totalBusinesses || 0}
      />
      <StatCard icon={MapPin} title="Ward Number" value={wardNumber || 0} />
    </div>
  );
}
