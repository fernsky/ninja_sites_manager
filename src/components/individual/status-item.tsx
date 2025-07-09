import { Badge } from "@/components/ui/badge";

const formatValue = (value: any): string => {
  if (value === undefined || value === null || value === "") return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return value.toString();
  return value;
};

interface StatusItemProps {
  label: string;
  value?: string | number | boolean | null;
  icon: React.ReactNode;
}

export function StatusItem({ label, value, icon }: StatusItemProps) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="rounded-lg bg-primary/10 p-2 shrink-0">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {formatValue(value) ? (
          <p className="font-medium truncate">{formatValue(value)}</p>
        ) : (
          <Badge variant="outline">Not Specified</Badge>
        )}
      </div>
    </div>
  );
}
