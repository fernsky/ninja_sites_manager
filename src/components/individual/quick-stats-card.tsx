import { BookOpen, GraduationCap, User, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuickStatsCardProps {
  individual: {
    age?: number;
    gender?: string;
    educationalLevel?: string;
    religion?: string;
  };
}

export function QuickStatsCard({ individual }: QuickStatsCardProps) {
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
      <Card className="col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Age</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{individual?.age || "N/A"}</div>
          <p className="text-xs text-muted-foreground">Years old</p>
        </CardContent>
      </Card>
      <Card className="col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gender</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {individual?.gender || "N/A"}
          </div>
          <p className="text-xs text-muted-foreground">Gender Identity</p>
        </CardContent>
      </Card>
      <Card className="col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Education</CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold truncate">
            {individual?.educationalLevel || "N/A"}
          </div>
          <p className="text-xs text-muted-foreground">Education Level</p>
        </CardContent>
      </Card>
      <Card className="col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Religion</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {individual?.religion || "N/A"}
          </div>
          <p className="text-xs text-muted-foreground">Religious Background</p>
        </CardContent>
      </Card>
    </div>
  );
}
