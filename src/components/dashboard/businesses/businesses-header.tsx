import { Building2 } from "lucide-react";

export function BusinessesHeader() {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-primary/10 p-1.5 sm:p-2">
          <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Business Management
        </h2>
      </div>
      <p className="text-sm text-muted-foreground">
        View and manage all business records in the system
      </p>
    </div>
  );
}
