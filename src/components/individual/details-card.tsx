import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusItem } from "./status-item";

interface DetailsCardProps {
  title: string;
  icon: React.ReactNode;
  items: Array<{
    label: string;
    value?: string | number | boolean | null;
    icon: React.ReactNode;
  }>;
}

export function DetailsCard({ title, icon, items }: DetailsCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/50">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 p-4 sm:p-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <StatusItem
            key={index}
            label={item.label}
            value={item.value}
            icon={item.icon}
          />
        ))}
      </CardContent>
    </Card>
  );
}
