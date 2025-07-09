import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const areaColumns: ColumnDef<any>[] = [
  {
    accessorKey: "wardNumber",
    header: "Ward",
    cell: ({ row }) => (
      <Badge variant="outline">Ward {row.getValue("wardNumber")}</Badge>
    ),
  },
  {
    accessorKey: "code",
    header: "Area Code",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("code")}</span>
    ),
  },
  {
    accessorKey: "buildings",
    header: "Buildings",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.getValue("buildings") || 0}</Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Link href={`/area/show/${row.original.id}`}>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
        <Link href={`/area/update/${row.original.id}`}>
          <Button variant="ghost" size="sm">
            <Pencil className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    ),
  },
];
