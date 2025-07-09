import { LucideIcon } from "lucide-react";

interface DetailRowProps {
  icon: LucideIcon;
  label: string;
  value: string | number | null | undefined;
}

export function DetailRow({ icon: Icon, label, value }: DetailRowProps) {
  return (
    <div className="group relative rounded-lg border bg-card/50 p-3 transition-all hover:bg-accent/50">
      <div className="flex items-center gap-3">
        <div className="rounded-md bg-primary/10 p-2">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="font-medium">{value || "—"}</p>
        </div>
      </div>
    </div>
  );
}
