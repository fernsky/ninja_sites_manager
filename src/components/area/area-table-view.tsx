import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type ActionHandlerProps } from "./types";
import { MapPin, User, Pencil, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export function AreaTableView({ data }: ActionHandlerProps) {
  const router = useRouter();

  return (
    <Card className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Ward</TableHead>
            <TableHead>Area Code</TableHead>
            <TableHead>Enumerator</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((area) => (
            <TableRow key={area.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Ward {area.wardNumber}
                </div>
              </TableCell>
              <TableCell>{area.code}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {area.assignedTo ? area.assignedTo.name : "Unassigned"}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    area.areaStatus?.includes("revision")
                      ? "destructive"
                      : "default"
                  }
                  className="capitalize"
                >
                  {area.areaStatus?.replace(/_/g, " ")}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/area/update/${area.id}`)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/area/show/${area.id}`)}
                    className="text-gray-600 hover:text-gray-700"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
