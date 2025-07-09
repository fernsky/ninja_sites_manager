import { Card } from "@/components/ui/card";
import { Users, Building2, Banknote } from "lucide-react";

interface BusinessesStatsProps {
  totalBusinesses: number;
  totalEmployees: number;
  avgInvestmentAmount: number;
}

export function BusinessesStats({
  totalBusinesses,
  totalEmployees,
  avgInvestmentAmount,
}: BusinessesStatsProps) {
  const stats = [
    {
      label: "Total Businesses",
      value: totalBusinesses,
      icon: Building2,
    },
    {
      label: "Total Employees",
      value: totalEmployees,
      icon: Users,
    },
    {
      label: "Avg. Investment",
      value: `Rs. ${(avgInvestmentAmount / 1000).toFixed(1)}K`,
      icon: Banknote,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-4">
          <div className="flex items-center gap-2">
            <stat.icon className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </p>
          </div>
          <p className="mt-1 text-2xl font-bold">{stat.value}</p>
        </Card>
      ))}
    </div>
  );
}
