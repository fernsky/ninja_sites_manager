import { LucideIcon } from "lucide-react";

interface CardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export function Card({ title, icon: Icon, children }: CardProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="flex items-center gap-2 border-b bg-muted/50 p-4">
        <div className="rounded-md bg-primary/10 p-2">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
        </div>
      </div>
      <div className="grid gap-2 p-4">{children}</div>
    </div>
  );
}
