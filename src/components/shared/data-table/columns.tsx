import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export function createSortableHeader(header: string, accessorKey: string) {
  return (
    <Button variant="ghost" className="whitespace-nowrap">
      {header}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}

export type DataTableColumnHelper<T> = {
  header: string;
  accessorKey: keyof T;
  sortable?: boolean;
  cell?: (props: { row: { original: T } }) => React.ReactNode;
};

export function createColumns<T>(
  helpers: DataTableColumnHelper<T>[],
): ColumnDef<T>[] {
  return helpers.map(({ header, accessorKey, sortable, cell }) => ({
    accessorKey: accessorKey as string,
    header: sortable
      ? () => createSortableHeader(header, accessorKey as string)
      : header,
    cell: cell ? cell : ({ row }) => row.getValue(accessorKey as string),
  }));
}
