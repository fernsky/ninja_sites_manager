import { Progress } from "@/components/ui/progress";
import { Key, CheckCircle2, CircleDashed } from "lucide-react";
import { cn } from "@/lib/utils";

const TokenStats = ({
  stats,
}: {
  stats: {
    totalTokens: number;
    allocatedTokens: number;
    unallocatedTokens: number;
  };
}) => {
  const allocationPercentage = Math.round(
    (stats.allocatedTokens / stats.totalTokens) * 100,
  );

  const StatItem = ({
    icon: Icon,
    value,
    label,
    className,
  }: {
    icon: any;
    value: number;
    label: string;
    className?: string;
  }) => (
    <div className={cn("flex items-center gap-3 w-full", className)}>
      <div className="rounded-md bg-primary/10 p-2 shrink-0">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="min-w-0">
        <div className="text-xl font-bold truncate">{value}</div>
        <div className="text-xs text-muted-foreground truncate">{label}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatItem icon={Key} value={stats.totalTokens} label="Total Tokens" />
          <StatItem
            icon={CheckCircle2}
            value={stats.allocatedTokens}
            label="Allocated"
            className="text-green-600"
          />
          <StatItem
            icon={CircleDashed}
            value={stats.unallocatedTokens}
            label="Available"
            className="text-blue-600"
          />
        </div>
      </div>

      <div className="rounded-lg border p-6">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Progress</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold">{allocationPercentage}</span>
              <span className="text-sm text-muted-foreground">% allocated</span>
            </div>
          </div>
          <Progress value={allocationPercentage} className="h-2 w-full" />
        </div>
      </div>
    </div>
  );
};

export default TokenStats;
