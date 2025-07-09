import { Shield, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function QuickActionsCard() {
  return (
    <Card>
      <CardHeader className="border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>Quick Actions</CardTitle>
        </div>
        <CardDescription>
          Manage your account settings and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            asChild
          >
            <Link href="/account/change-password">
              <Shield className="h-4 w-4" />
              Change Password
            </Link>
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            asChild
          >
            <Link href="/account/activity">
              <Clock className="h-4 w-4" />
              Activity Log
            </Link>
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            asChild
          >
            <Link href="/areas/assigned">
              <MapPin className="h-4 w-4" />
              View Assigned Areas
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
