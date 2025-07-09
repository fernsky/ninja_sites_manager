"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCircle, Fingerprint, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserInfoCardProps {
  name: string | null;
  userId: string;
  role: string;
  className?: string;
  showId?: boolean;
}

export function UserInfoCard({
  name,
  userId,
  role,
  className,
  showId = true,
}: UserInfoCardProps) {
  const truncatedId = userId.slice(0, 8).toUpperCase();

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="space-y-1 bg-gradient-to-r from-primary/10 to-primary/5 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <UserCircle className="h-5 w-5 text-primary" />
          Enumerator Details
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Welcome</p>
            <h3 className="text-2xl font-semibold tracking-tight">{name}</h3>
            <p className="text-sm text-muted-foreground">
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </p>
          </div>
          {showId && (
            <div className="space-y-2 text-right">
              <div className="flex items-center gap-2">
                <Fingerprint className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline" className="font-mono">
                  {truncatedId}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                <ClipboardCheck className="mr-1 inline-block h-3 w-3" />
                Use this ID in ODK Collect
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
