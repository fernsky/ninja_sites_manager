"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
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
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { v4 as uuidv4 } from "uuid";

const formSchema = z.object({
  id: z.string().min(1, "Form ID is required"),
  name: z.string().min(1, "Form name is required"),
  siteEndpoint: z.string().url().optional(),
  odkFormId: z.string().max(255),
  odkProjectId: z.number().int().nonnegative(),
  userName: z.string().optional(),
  password: z.string().optional(),
  attachmentPaths: z
    .array(
      z.object({
        path: z.string().optional(),
        type: z.enum([
          "audio_monitoring",
          "house_image",
          "house_image_selfie",
          "business_image",
          "business_image_selfie",
        ]),
      }),
    )
    .optional(),
});

const CreateFormPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const createForm = api.superadmin.createSurveyForm.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      name: "",
      siteEndpoint: "",
      odkFormId: "",
      odkProjectId: 0,
      userName: "",
      password: "",
      attachmentPaths: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attachmentPaths",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      //@ts-ignore
      await createForm.mutateAsync(values);
      toast.success("Form created successfully");
      router.push("/forms");
    } catch (error) {
      toast.error("Failed to create form");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ContentLayout title="Create Form">
      <Card className="max-w[600px] pt-10">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-4">
                <FormField
                  name="id"
                  control={form.control}
                  render={({ field }) => (
                    <FormControl>
                      <div>
                        <FormLabel>Form ID</FormLabel>
                        <Input {...field} />
                        <FormMessage />
                      </div>
                    </FormControl>
                  )}
                />
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormControl>
                      <div>
                        <FormLabel>Form Name</FormLabel>
                        <Input {...field} />
                        <FormMessage />
                      </div>
                    </FormControl>
                  )}
                />
                <FormField
                  name="siteEndpoint"
                  control={form.control}
                  render={({ field }) => (
                    <FormControl>
                      <div>
                        <FormLabel>Site Endpoint</FormLabel>
                        <Input {...field} />
                        <FormMessage />
                      </div>
                    </FormControl>
                  )}
                />
                <FormField
                  name="odkFormId"
                  control={form.control}
                  render={({ field }) => (
                    <FormControl>
                      <div>
                        <FormLabel>ODK Form ID</FormLabel>
                        <Input {...field} />
                        <FormMessage />
                      </div>
                    </FormControl>
                  )}
                />
                <FormField
                  name="odkProjectId"
                  control={form.control}
                  render={({ field: { value, onChange } }) => (
                    <FormControl>
                      <div>
                        <FormLabel>ODK Project ID</FormLabel>
                        <Input
                          type="number"
                          value={value}
                          onChange={(e) => onChange(Number(e.target.value))}
                        />
                        <FormMessage />
                      </div>
                    </FormControl>
                  )}
                />
                <FormField
                  name="userName"
                  control={form.control}
                  render={({ field }) => (
                    <FormControl>
                      <div>
                        <FormLabel>Username</FormLabel>
                        <Input {...field} />
                        <FormMessage />
                      </div>
                    </FormControl>
                  )}
                />
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormControl>
                      <div>
                        <FormLabel>Password</FormLabel>
                        <Input type="password" {...field} />
                        <FormMessage />
                      </div>
                    </FormControl>
                  )}
                />
                <div className="grid gap-2">
                  <Button
                    type="button"
                    onClick={() => append({ path: "", type: "house_image" })}
                    variant="secondary"
                    className="mt-2"
                  >
                    Add Attachment Path
                  </Button>
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <FormField
                        name={`attachmentPaths.${index}.path`}
                        control={form.control}
                        render={({ field }) => (
                          <FormControl>
                            <Input {...field} placeholder="Path" />
                          </FormControl>
                        )}
                      />
                      <FormField
                        name={`attachmentPaths.${index}.type`}
                        control={form.control}
                        render={({ field }) => (
                          <FormControl>
                            <Select
                              defaultValue={field.value ?? ""}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value="audio_monitoring">
                                    Audio Monitoring
                                  </SelectItem>
                                  <SelectItem value="house_image">
                                    House Image
                                  </SelectItem>
                                  <SelectItem value="house_image_selfie">
                                    House Image Selfie
                                  </SelectItem>
                                  <SelectItem value="business_image">
                                    Business Image
                                  </SelectItem>
                                  <SelectItem value="business_image_selfie">
                                    Business Image Selfie
                                  </SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        )}
                      />
                      <Button
                        type="button"
                        onClick={() => remove(index)}
                        variant="destructive"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
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
    </ContentLayout>
  );
};

export default CreateFormPage;
