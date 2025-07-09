import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import Link from "next/link";
import { StatCard } from "./stats-card";

interface BuildingStats {
  totalBuildings: number;
  totalFamilies: number;
}

interface BuildingsHeaderProps {
  stats: BuildingStats;
}

export function BuildingsHeader({ stats }: BuildingsHeaderProps) {
  return (
    <>
      <div className="border-b p-4 flex justify-between items-center">
        <h2 className="text-lg font-medium">Buildings Overview</h2>
        <Link href="/buildings/odk-settings">
          <Button size="sm" className="w-full sm:w-auto">
            <Settings className="mr-1 h-4 w-4" /> Go to ODK Settings
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 p-6">
        <StatCard title="Total Buildings" value={stats.totalBuildings} />
        <StatCard title="Total Families" value={stats.totalFamilies} />
      </div>
    </>
  );
}
