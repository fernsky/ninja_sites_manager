import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Users } from "lucide-react";
import Link from "next/link";

type Individual = {
  id: string;
  name: string;
  age?: number | null;
  gender: string;
  familyRole?: string | null;
  educationalLevel?: string | null;
  primaryOccupation?: string | null;
};

interface IndividualsSectionProps {
  individuals?: Individual[];
}

export function IndividualsSection({ individuals }: IndividualsSectionProps) {
  if (!individuals || individuals.length === 0) return null;

  return (
    <Card>
      <CardHeader className="border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <div>
            <CardTitle className="text-lg">Family Members</CardTitle>
            <CardDescription>
              List of all registered family members
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Education</TableHead>
                <TableHead>Occupation</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {individuals.map((individual) => (
                <TableRow key={individual.id}>
                  <TableCell className="font-medium">
                    {individual.name}
                  </TableCell>
                  <TableCell>{individual.age ?? "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{individual.gender}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {individual.educationalLevel ?? "N/A"}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {individual.primaryOccupation ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/individuals/${individual.id}`}>
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
