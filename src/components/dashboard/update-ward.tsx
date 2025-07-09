"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/loading-button";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  areaCode: z.string().min(1, "Area code is required"),
});

interface UpdateWardProps {
  wardNumber: number;
}

const UpdateWardAreaCode: React.FC<UpdateWardProps> = ({ wardNumber }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const updateWard = api.ward.updateWard.useMutation();
  const ward = api.ward.getWardByNumber.useQuery({ wardNumber });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      areaCode: "",
    },
  });

  useEffect(() => {
    if (ward.data) {
      form.reset({
        areaCode: ward.data.wardAreaCode.toString(),
      });
    }
  }, [ward.data, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const payload = {
        wardNumber,
        wardAreaCode: parseInt(values.areaCode),
      };
      await updateWard.mutateAsync(payload);
      toast.success("Ward area code updated successfully");
      router.push("/ward");
    } catch (error) {
      toast.error("Failed to update ward area code");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="">
      <CardHeader className="space-y-2">
        <CardTitle>Update Area Code for Ward {wardNumber}</CardTitle>
        <CardDescription>Update the area code for the ward</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <FormField
                name="areaCode"
                control={form.control}
                render={({ field }) => (
                  <FormControl>
                    <div>
                      <FormLabel>Area Code</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </div>
                  </FormControl>
                )}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <LoadingButton /> : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UpdateWardAreaCode;
