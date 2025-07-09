"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  resetEnumeratorPasswordSchema,
  type ResetEnumeratorPasswordInput,
} from "@/server/api/routers/enumerators/enumerators.schema";

export function ResetEnumeratorPassword({
  enumeratorId,
}: {
  enumeratorId: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const resetPassword = api.enumerator.resetPassword.useMutation();

  const form = useForm<ResetEnumeratorPasswordInput>({
    resolver: zodResolver(resetEnumeratorPasswordSchema),
    defaultValues: {
      enumeratorId: enumeratorId,
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ResetEnumeratorPasswordInput) {
    setIsLoading(true);
    try {
      await resetPassword.mutateAsync(values);
      toast.success("Password reset successfully");
      router.push("/enumerators");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to reset password",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="max-w-[600px] pt-10">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormControl>
                  <div>
                    <FormLabel>New Password</FormLabel>
                    <Input {...field} type="password" />
                    <FormMessage />
                  </div>
                </FormControl>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormControl>
                  <div>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input {...field} type="password" />
                    <FormMessage />
                  </div>
                </FormControl>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <LoadingButton /> : "Reset Password"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
