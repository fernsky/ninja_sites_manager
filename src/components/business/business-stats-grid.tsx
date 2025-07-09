import {
  Users,
  Store,
  MapPin,
  Building2,
  Users2,
  UserSquare2,
  Briefcase,
  UsersRound,
} from "lucide-react";
import { StatCard } from "../shared/stat-card";
import { Card } from "@/components/ui/card";

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
        icon={Users2}
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

export function BusinessStatsGrid({
  totalEmployees,
  totalPartners,
  wardNumber,
}: {
  totalEmployees: number;
  totalPartners: number;
  wardNumber: number;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard icon={Building2} title="Building Ward No" value={wardNumber} />
      <StatCard icon={Users2} title="Total Employees" value={totalEmployees} />
      <StatCard
        icon={UserSquare2}
        title="Total Partners"
        value={totalPartners}
      />
    </div>
  );
}
