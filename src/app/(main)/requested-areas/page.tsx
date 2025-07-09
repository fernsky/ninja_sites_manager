"use client";
import React from "react";
import { api } from "@/trpc/react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import {
  Loader2,
  MapPin,
  AlertTriangle,
  ScrollText,
  Info,
  HelpCircle,
  Clock,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { ContentLayout } from "@/components/admin-panel/content-layout";

// Dynamically import components that use browser APIs
const AreaWithdrawCard = dynamic(
  () =>
    import("@/components/area/area-withdraw-card").then(
      (mod) => mod.AreaWithdrawCard,
    ),
  {
    ssr: false,
    loading: () => (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    ),
  },
);

const LoadingSkeleton = () => (
  <Card className="overflow-hidden">
    <div className="relative h-[260px]">
      <Skeleton className="h-full w-full" />
      <div className="absolute right-4 top-4 z-10">
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>
    </div>
    <CardContent className="space-y-6 p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <Skeleton className="h-10 w-full" />
    </CardContent>
  </Card>
);

const RequestedAreasPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [withdrawingAreaId, setWithdrawingAreaId] = React.useState<
    string | null
  >(null);

  const {
    data,
    isLoading,
    error,
    refetch: refetchAreas,
  } = api.enumerator.getRequestedAreas.useQuery();

  const withdrawAreaMutation = api.enumerator.withdrawArea.useMutation({
    onSuccess: () => {
      setWithdrawingAreaId(null);
      queryClient.invalidateQueries(["enumerator.getRequestedAreas"]);
      refetchAreas();
      toast({
        title: "Success",
        description: "Area withdrawn successfully",
      });
    },
    onError: (error) => {
      setWithdrawingAreaId(null);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl space-y-8 px-4 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-6 w-72" />
          </div>
          <Skeleton className="h-11 w-44" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-4xl space-y-6 px-4 py-16">
        <Card className="overflow-hidden">
          <div className="flex flex-col items-center gap-8 p-8 text-center md:p-12">
            <div className="rounded-full bg-destructive/10 p-4 shadow-inner">
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Error Loading Areas
              </h2>
              <p className="text-muted-foreground">{error.message}</p>
            </div>
            <Button
              onClick={() => refetchAreas()}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <ContentLayout title="Requested Areas">
        <div className="container mx-auto max-w-4xl px-4 py-16">
          <Card className="overflow-hidden">
            <div className="flex flex-col items-center gap-8 p-8 text-center md:p-12">
              <div className="rounded-full bg-primary/10 p-4 shadow-inner">
                <MapPin className="h-12 w-12 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  No Requested Areas
                </h2>
                <p className="mx-auto max-w-md text-muted-foreground">
                  You haven't requested any areas yet. Request an area to begin
                  your survey work.
                </p>
              </div>
              <Link href="/area/request">
                <Button size="lg" className="gap-2">
                  <MapPin className="h-5 w-5" />
                  Request New Area
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </ContentLayout>
    );
  }

  type RequestedArea = {
    areaId: string;
    code: string;
    areaStatus: string;
    wardNumber: number;
    userid: string;
    geometry: any;
    centroid: any;
  };

  const typedData = data as RequestedArea[];

  return (
    <ContentLayout title="Requested Areas">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:space-y-8 md:py-8">
        {/* Header Section - Improved */}
        <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between md:pb-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Requested Areas
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              Manage and track your area requests for survey assignments
            </p>
          </div>
          <Link href="/area/request">
            <Button
              size="lg"
              className="w-full gap-2 shadow-sm sm:w-auto"
              variant="default"
            >
              <MapPin className="h-4 w-4" />
              Request New Area
            </Button>
          </Link>
        </div>

        {/* Statistics Cards */}
        {data && data.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <ScrollText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Requests
                  </p>
                  <p className="text-2xl font-bold">{data.length}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Information Card */}
        <Card className="border-blue-100 bg-blue-50/50">
          <CardContent className="flex gap-4 p-6">
            <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-medium">About Area Requests</h3>
              <p className="text-sm text-muted-foreground">
                You can request multiple areas for survey work. Each request
                will be reviewed by your supervisor. Areas are typically
                assigned within 24-48 hours. You can withdraw a request if it's
                still pending.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Area Grid */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(data as RequestedArea[]).map((area) => (
            <AreaWithdrawCard
              key={area.areaId}
              area={area}
              onWithdraw={async (areaId, userid) => {
                setWithdrawingAreaId(areaId);
                await withdrawAreaMutation.mutateAsync({
                  areaId,
                  userId: userid,
                });
              }}
              isWithdrawing={
                withdrawAreaMutation.isLoading &&
                withdrawingAreaId === area.areaId
              }
            />
          ))}
        </div>

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader className="border-b bg-muted/50">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Request Process",
                description: "Learn how the area request process works",
                link: "#",
              },
              {
                title: "Area Guidelines",
                description: "View guidelines for selecting areas",
                link: "#",
              },
              {
                title: "Contact Support",
                description: "Get help from our support team",
                link: "#",
              },
            ].map((item) => (
              <Card key={item.title} className="border-none shadow-none">
                <CardContent className="p-0">
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  <Button variant="link" className="mt-2 h-auto p-0">
                    Learn more
                  </Button>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
};

// Convert to default export with no SSR
export default dynamic(() => Promise.resolve(RequestedAreasPage), {
  ssr: false,
});
