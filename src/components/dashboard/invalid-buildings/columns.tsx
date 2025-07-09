import { Badge } from "@/components/ui/badge";
import { MapPin, Users, AlertTriangle, Building2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

interface Building {
  id: string;
  locality: string;
  tmpBuildingToken: string;
  tmpWardNumber: number;
  tmpAreaCode: string;
  enumeratorName?: string;
  tmpEnumeratorId?: string;
  isWardValid: boolean;
  isAreaValid: boolean;
  isEnumeratorValid: boolean;
  isBuildingTokenValid: boolean;
}

export const invalidBuildingsColumns: ColumnDef<Building>[] = [
  {
    accessorKey: "locality",
    header: "Locality",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        {row.getValue("locality")}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "tmpBuildingToken",
    header: "Building Token",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <Badge
          variant={
            row.original.isBuildingTokenValid ? "secondary" : "destructive"
          }
          className="w-fit"
        >
          {row.getValue("tmpBuildingToken") || "Not assigned"}
        </Badge>
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "tmpWardNumber",
    header: "Ward",
    cell: ({ row }) => (
      <Badge
        variant={row.original.isWardValid ? "secondary" : "destructive"}
        className="w-fit"
      >
        Ward {row.getValue("tmpWardNumber")}
      </Badge>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "tmpAreaCode",
    header: "Area",
    cell: ({ row }) => (
      <Badge
        variant={row.original.isAreaValid ? "secondary" : "destructive"}
        className="w-fit"
      >
        Area {row.getValue("tmpAreaCode")}
      </Badge>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "enumeratorName",
    header: "Enumerator",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-muted-foreground" />
        <Badge
          variant={row.original.isEnumeratorValid ? "secondary" : "destructive"}
          className="w-fit"
        >
          {row.original.enumeratorName || row.original.tmpEnumeratorId}
        </Badge>
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "validationStatus",
    header: "Issues",
    cell: ({ row }) => {
      const validations = {
        ward: row.original.isWardValid,
        area: row.original.isAreaValid,
        enumerator: row.original.isEnumeratorValid,
        token: row.original.isBuildingTokenValid,
      };

      const invalidItems = Object.entries(validations)
        .filter(([_, isValid]) => !isValid)
        .map(([key]) => key);

      return invalidItems.length > 0 ? (
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <div className="flex flex-wrap gap-1">
            {invalidItems.map((item) => (
              <Badge key={item} variant="destructive" className="text-xs">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      ) : null;
    },
  },
];
