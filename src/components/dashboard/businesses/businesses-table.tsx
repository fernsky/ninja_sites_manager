import { DataTable } from "@/components/shared/data-table/data-table";
import { Loader2 } from "lucide-react";
import { BusinessCard } from "@/components/business/business-card";

interface BusinessesTableProps {
  isLoading: boolean;
  isDesktop: boolean;
  data: any[];
  columns: any[];
}

export function BusinessesTable({
  isLoading,
  isDesktop,
  data,
  columns,
}: BusinessesTableProps) {
  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return isDesktop ? (
    <div className="rounded-lg border">
      <DataTable columns={columns} data={data} isLoading={isLoading} />
    </div>
  ) : (
    <div className="grid gap-4 sm:grid-cols-2">
      {data.map((business) => (
        <BusinessCard key={business.id} business={business} />
      ))}
    </div>
  );
}
