"use server";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { validateRequest } from "@/lib/auth/validate-request";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Computer, HelpCircle, Check } from "lucide-react";
import Link from "next/link";

const DashboardPage = async () => {
  const { user } = await validateRequest();
  if (!user) return null;

  return (
    <ContentLayout title="Dashboard">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Welcome to Ninja Site Management
            </CardTitle>
            <CardDescription>
              Manage your sites, track issues, and monitor solutions all in one
              place.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/site">
                <Button
                  variant="outline"
                  className="w-full h-24 flex flex-col items-center justify-center space-y-2"
                >
                  <Computer className="h-8 w-8" />
                  <span className="font-semibold">Sites</span>
                  <span className="text-sm text-muted-foreground">
                    Manage site information
                  </span>
                </Button>
              </Link>

              <Link href="/issues">
                <Button
                  variant="outline"
                  className="w-full h-24 flex flex-col items-center justify-center space-y-2"
                >
                  <HelpCircle className="h-8 w-8" />
                  <span className="font-semibold">Issues</span>
                  <span className="text-sm text-muted-foreground">
                    Track and resolve issues
                  </span>
                </Button>
              </Link>

              <Link href="/buildings">
                <Button
                  variant="outline"
                  className="w-full h-24 flex flex-col items-center justify-center space-y-2"
                >
                  <Check className="h-8 w-8" />
                  <span className="font-semibold">Solutions</span>
                  <span className="text-sm text-muted-foreground">
                    View implemented solutions
                  </span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
};

export default DashboardPage;
