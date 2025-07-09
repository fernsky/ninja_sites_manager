interface FamilyStatsGridProps {
  totalMembers: number;
  wardNo: number;
  headName: string;
}

export function FamilyStatsGrid({ totalMembers, wardNo, headName }: FamilyStatsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard title="Total Members" value={totalMembers} />
      <StatCard title="Ward Number" value={wardNo} />
      <StatCard title="Family Head" value={headName} />
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="text-sm font-medium text-muted-foreground">{title}</div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </div>
  );
}
