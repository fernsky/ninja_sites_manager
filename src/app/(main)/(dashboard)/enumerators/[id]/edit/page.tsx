"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  updateEnumeratorSchema,
  type UpdateEnumeratorInput,
} from "@/server/api/routers/enumerators/enumerators.schema";
import { z } from "zod";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FormCard = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg font-medium">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="grid gap-4">{children}</CardContent>
  </Card>
);

export default function EditEnumeratorPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const updateEnumerator = api.enumerator.update.useMutation();
  const resetPassword = api.enumerator.resetPassword.useMutation();
  const { data: enumerator, isLoading: isLoadingEnumerator } =
    api.enumerator.getById.useQuery(params.id);

  const form = useForm<UpdateEnumeratorInput>({
    resolver: zodResolver(updateEnumeratorSchema),
    defaultValues: {
      enumeratorId: params.id,
      name: "",
      phoneNumber: "",
      email: "",
      userName: "",
      wardNumber: 1,
      isActive: true,
    },
  });

  type PasswordFormValues = {
    password: string;
    confirmPassword: string;
  };

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(
      z
        .object({
          password: z.string().min(6),
          confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "Passwords don't match",
          path: ["confirmPassword"],
        }),
    ),
  });

  useEffect(() => {
    if (enumerator) {
      form.reset({
        enumeratorId: params.id,
        name: enumerator.name ?? undefined,
        phoneNumber: enumerator.phoneNumber ?? undefined,
        email: enumerator.email ?? undefined,
        userName: enumerator.userName ?? undefined,
        wardNumber: enumerator.wardNumber ?? undefined,
        isActive: enumerator.isActive ?? true,
      });
    }
  }, [enumerator, form, params.id]);

  async function onSubmit(values: UpdateEnumeratorInput) {
    setIsLoading(true);
    try {
      await updateEnumerator.mutateAsync(values);
      toast.success("Enumerator updated successfully");
      router.push(`/enumerators/${params.id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update enumerator",
      );
    } finally {
      setIsLoading(false);
    }
  }

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    try {
      await resetPassword.mutateAsync({
        enumeratorId: params.id,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      toast.success("Password reset successfully");
      passwordForm.reset();
    } catch (error) {
      toast.error("Failed to reset password");
    }
  };

  if (isLoadingEnumerator) {
    return (
      <ContentLayout title="Edit Enumerator">
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-[200px] rounded-lg" />
          ))}
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title="Edit Enumerator"
      subtitle={`ID: ${params.id}`}
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/enumerators/${params.id}`)}
          >
            Cancel
          </Button>
          <Button type="submit" form="enumerator-form" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      }
    >
      <div className="space-y-6 px-2 lg:px-10">
        <Form {...form}>
          <form
            id="enumerator-form"
            className="grid gap-3"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormCard
              title="Personal Information"
              description="Basic details about the enumerator"
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="John Doe" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="9800000000" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="john@example.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </FormCard>

            <FormCard
              title="Account Details"
              description="Login credentials and account status"
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FormField
                  control={form.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="johndoe" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="wardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ward Number</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        value={(field.value ?? 1).toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select ward" />
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(10)].map((_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              Ward {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between space-x-2">
                        <FormLabel>Active Status</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </FormCard>
          </form>
        </Form>
        <FormCard
          title="Security"
          description="Reset password for this enumerator"
        >
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={passwordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={resetPassword.isLoading}>
                  Reset Password
                </Button>
              </div>
            </form>
          </Form>
        </FormCard>
      </div>
    </ContentLayout>
  );
}
