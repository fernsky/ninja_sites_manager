import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  MapPin,
  Users,
  ArrowUpDown,
  Store,
  Phone,
  Home,
} from "lucide-react";
import Link from "next/link";

export const familyColumns = (
  onSort: (field: string) => void,
): ColumnDef<any>[] => [
  {
    accessorKey: "wardNo",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="pl-0 text-left font-medium"
        onClick={() => {
          onSort("ward_no");
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
        Ward
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className="font-medium">
        Ward {row.getValue("wardNo")}
      </Badge>
    ),
  },
  {
    accessorKey: "headName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="pl-0 text-left font-medium"
        onClick={() => {
          onSort("head_name");
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
        Head of Family
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{row.getValue("headName")}</span>
      </div>
    ),
  },
  {
    accessorKey: "totalMembers",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="pl-0 text-left font-medium"
        onClick={() => {
          onSort("total_members");
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        <Home className="mr-2 h-4 w-4 text-muted-foreground" />
        Members
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <Badge className="bg-primary/10 text-primary">
        {row.getValue("totalMembers")}
      </Badge>
    ),
  },
  {
    accessorKey: "headPhone",
    header: "Contact",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Phone className="h-4 w-4 text-muted-foreground" />
        <span>{row.getValue("headPhone") || "—"}</span>
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Link href={`/families/${row.original.id}`}>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            View
          </Button>
        </Link>
      </div>
    ),
  },
];
