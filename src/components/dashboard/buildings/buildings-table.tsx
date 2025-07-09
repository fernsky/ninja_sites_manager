import { DataTable } from "@/components/shared/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Eye, Loader2 } from "lucide-react";
import Link from "next/link";

interface BuildingCardProps {
  building: any;
}

function BuildingCard({ building }: BuildingCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="mt-4 flex gap-2">
        <Link href={`/buildings/${building.id}`}>
          <Button size="sm" variant="outline">
            <Eye className="mr-2 h-4 w-4" /> View
          </Button>
        </Link>
      </div>
    </div>
  );
}

interface BuildingsTableProps {
  isLoading: boolean;
  isDesktop: boolean;
  data: any[];
  columns: any[];
}

export function BuildingsTable({
  isLoading,
  isDesktop,
  data,
  columns,
}: BuildingsTableProps) {
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
      {data.map((building) => (
        <BuildingCard key={building.id} building={building} />
      ))}
    </div>
  );
}
