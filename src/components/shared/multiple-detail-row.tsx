import { LucideIcon } from "lucide-react";

interface MultipleDetailRowProps {
  icon: LucideIcon;
  label: string;
  values: string[] | null | undefined;
}

export function MultipleDetailRow({
  icon: Icon,
  label,
  values,
}: MultipleDetailRowProps) {
  return (
    <div className="group relative rounded-lg border bg-card/50 p-3 transition-all hover:bg-accent/50">
      <div className="flex items-center gap-3">
        <div className="rounded-md bg-primary/10 p-2">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {values && values.length > 0 ? (
              values.map((value, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                >
                  {value}
                </span>
              ))
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
