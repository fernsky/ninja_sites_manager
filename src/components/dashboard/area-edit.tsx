"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { updateAreaSchema } from "@/server/api/routers/areas/area.schema";
import type { z } from "zod";
import { Form, FormLabel } from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/loading-button";
import { CreateAreaMap } from "./create-area";
import { useMapContext } from "@/lib/map-state";
import { MapPin, Hash, Home } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const FormCard = ({
  title,
  icon: Icon,
  description,
  children,
}: {
  title: string;
  icon: React.ElementType;
  description: string;
  children: React.ReactNode;
}) => (
  <Card className="shadow-sm">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-lg font-medium">
        <Icon className="h-5 w-5 text-primary" />
        {title}
      </CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

export const AreaEdit = ({ id }: { id: string }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { geometry, setGeometry } = useMapContext();

  const updateArea = api.area.updateArea.useMutation();
  const { data: areaData, isLoading: isLoadingArea } =
    api.area.getAreaById.useQuery({
      id,
    });

  const form = useForm<z.infer<typeof updateAreaSchema>>({
    resolver: zodResolver(updateAreaSchema),
  });

  useEffect(() => {
    if (areaData) {
      form.reset({
        id: areaData.id,
        code: areaData.code,
        wardNumber: areaData.wardNumber,
        geometry: areaData.geometry,
      });
      setGeometry(areaData.geometry);
    }
  }, [areaData, form]);

  async function onSubmit(values: z.infer<typeof updateAreaSchema>) {
    setIsLoading(true);
    try {
      await updateArea.mutateAsync({
        ...values,
        geometry: geometry,
      });
      toast.success("Area updated successfully");
      router.push("/area");
    } catch (error) {
      toast.error("Failed to update area");
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoadingArea) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[100px]" />
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormCard
          icon={Home}
          title="Area Details"
          description="Basic information about the area"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <FormLabel className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Ward Number
              </FormLabel>
              <div className="text-2xl font-semibold text-primary">
                {areaData?.wardNumber}
              </div>
            </div>
            <div className="space-y-2">
              <FormLabel className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Area Code
              </FormLabel>
              <div className="text-2xl font-semibold text-primary">
                {areaData?.code}
              </div>
            </div>
          </div>
        </FormCard>

        <FormCard
          icon={MapPin}
          title="Area Boundary"
          description="Update the geographical boundary for this area"
        >
          <CreateAreaMap id={id} onGeometryChange={setGeometry} />
        </FormCard>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/area")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <LoadingButton /> : "Update Area"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
