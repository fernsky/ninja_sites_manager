import { api } from "@/trpc/react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BuildingCard } from "./building-card";
import { AlertTriangle, Building2, MapPin, Users, Binary } from "lucide-react";
import { useState } from "react";

export function InvalidAssignments() {
  const [currentTab, setCurrentTab] = useState<
    "all" | "ward" | "area" | "enumerator" | "token"
  >("all");

  const { data, isLoading } = api.building.getInvalidBuildings.useQuery({
    filters: {
      wardValid: currentTab === "ward" ? false : undefined,
      areaValid: currentTab === "area" ? false : undefined,
      enumeratorValid: currentTab === "enumerator" ? false : undefined,
      tokenValid: currentTab === "token" ? false : undefined,
    },
    limit: 50,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card className="p-4">
          <div className="h-20 animate-pulse bg-muted rounded" />
        </Card>
      </div>
    );
  }

  const summary = data?.summary;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={<AlertTriangle className="h-5 w-5" />}
          label="Total Invalid"
          value={summary?.totalInvalid ?? 0}
          active={currentTab === "all"}
          onClick={() => setCurrentTab("all")}
        />
        <StatCard
          icon={<Building2 className="h-5 w-5" />}
          label="Invalid Wards"
          value={summary?.invalidWard ?? 0}
          active={currentTab === "ward"}
          onClick={() => setCurrentTab("ward")}
        />
        <StatCard
          icon={<MapPin className="h-5 w-5" />}
          label="Invalid Areas"
          value={summary?.invalidArea ?? 0}
          active={currentTab === "area"}
          onClick={() => setCurrentTab("area")}
        />
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Invalid Enumerators"
          value={summary?.invalidEnumerator ?? 0}
          active={currentTab === "enumerator"}
          onClick={() => setCurrentTab("enumerator")}
        />
        <StatCard
          icon={<Binary className="h-5 w-5" />}
          label="Invalid Tokens"
          value={summary?.invalidToken ?? 0}
          active={currentTab === "token"}
          onClick={() => setCurrentTab("token")}
        />
      </div>

      {/* Buildings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.data.map((building) => (
          //@ts-ignore
          <BuildingCard key={building.id} building={building} />
        ))}
      </div>

      {data?.data.length === 0 && (
        <Card className="p-8">
          <div className="text-center text-muted-foreground">
            No invalid assignments found
          </div>
        </Card>
      )}
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  active?: boolean;
  onClick?: () => void;
}

function StatCard({ icon, label, value, active, onClick }: StatCardProps) {
  return (
    <Card
      className={`p-4 cursor-pointer transition-all ${
        active
          ? "border-primary bg-primary/5"
          : "hover:border-primary/50 hover:bg-accent"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div
          className={`${
            active ? "text-primary" : "text-muted-foreground"
          } transition-colors`}
        >
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
      </div>
    </Card>
  );
}
