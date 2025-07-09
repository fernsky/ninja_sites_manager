"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/loading-button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FetchSubmissions } from "./fetch-submissions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Add these icon components
const SettingsIcon = ({ className }: { className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const formSchema = z.object({
  name: z.string().min(1, "Form name is required"),
  siteEndpoint: z.string().url().optional(),
  odkFormId: z.string().max(255),
  odkProjectId: z.number().int().nonnegative(),
  userName: z.string().optional(),
  password: z.string().optional(),
  updateInterval: z.number().int().positive().default(7200),
  attachmentPaths: z
    .array(
      z.object({
        path: z.string().optional(),
        type: z.enum([
          "audio_monitoring",
          "building_image",
          "building_selfie",
          "family_head_image",
          "family_head_selfie",
          "business_image",
          "business_selfie",
        ]),
      }),
    )
    .optional(),
});

export const ODKResourcesForm = ({ formId }: { formId: string }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<z.infer<typeof formSchema>>();
  const createOrUpdateForm =
    api.superadmin.createOrUpdateResourceForm.useMutation();
  const formData = api.superadmin.getForm.useQuery({ id: formId });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attachmentPaths",
  });

  useEffect(() => {
    if (formData.data) {
      const initialData = {
        ...formData.data,
        siteEndpoint: formData.data.siteEndpoint as string | undefined,
        odkFormId: formData.data.odkFormId ?? "",
        odkProjectId: formData.data.odkProjectId ?? 0,
        userName: formData.data.userName as string | undefined,
        password: formData.data.password as string | undefined,
        updateInterval: formData.data.updateInterval ?? 7200,
        attachmentPaths: formData.data.attachmentPaths?.map((ap) => ({
          //@ts-ignore
          path: ap.path,
          //@ts-ignore
          type: ap.type ?? "business_image",
        })),
      };
      setInitialData({ ...initialData });
      form.reset({ ...initialData });
    }
  }, [formData.data]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await createOrUpdateForm.mutateAsync({ ...values, id: formId });
      toast.success("Form saved successfully");
      router.push("/forms");
    } catch (error) {
      toast.error("Failed to save form");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-gray-200/50 [mask-image:linear-gradient(0deg,white,transparent)] pointer-events-none" />

      <div className="relative mx-auto max-w-5xl space-y-8 p-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <SettingsIcon className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
              ODK Form Configuration
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Configure your ODK form settings and manage submissions for data
            collection.
          </p>
        </div>

        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652z"
                  clipRule="evenodd"
                />
              </svg>
              Settings
            </TabsTrigger>
            <TabsTrigger
              value="submissions"
              className="flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M10 2a.75.75 0 01.75.75v5.59l1.95-2.1a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0L6.2 7.26a.75.75 0 111.1-1.02l1.95 2.1V2.75A.75.75 0 0110 2z" />
                <path d="M5.273 4.5a1.25 1.25 0 00-1.205.918l-1.523 5.52c-.006.02-.01.041-.015.062H6a1 1 0 01.894.553l.448.894a1 1 0 00.894.553h3.438a1 1 0 00.86-.49l.606-1.02A1 1 0 0114 11h3.47a1.318 1.318 0 00-.015-.062l-1.523-5.52a1.25 1.25 0 00-1.205-.918h-.977a.75.75 0 010-1.5h.977a2.75 2.75 0 012.651 2.019l1.523 5.52c.066.239.099.485.099.732V15a2 2 0 01-2 2H3a2 2 0 01-2-2v-3.73c0-.246.033-.492.099-.73l1.523-5.521A2.75 2.75 0 015.273 3h.977a.75.75 0 010 1.5h-.977z" />
              </svg>
              Fetch Submissions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-6">
            <Card className="border-border/50 shadow-lg backdrop-blur-sm bg-white/50">
              <CardContent className="p-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <div className="grid gap-8">
                      {/* Basic Configuration Section */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 border-b pb-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                          <h2 className="text-lg font-medium">
                            Basic Configuration
                          </h2>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2">
                          <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                              <FormControl>
                                <div className="space-y-2">
                                  <FormLabel className="text-sm font-medium">
                                    Form Name
                                  </FormLabel>
                                  <Input {...field} className="h-9" />
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
                                <div className="space-y-2">
                                  <FormLabel className="text-sm font-medium">
                                    Site Endpoint
                                  </FormLabel>
                                  <Input {...field} className="h-9" />
                                  <FormMessage />
                                </div>
                              </FormControl>
                            )}
                          />
                        </div>
                      </div>

                      {/* ODK Settings Section */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 border-b pb-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                            />
                          </svg>
                          <h2 className="text-lg font-medium">ODK Settings</h2>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2">
                          <FormField
                            name="odkFormId"
                            control={form.control}
                            render={({ field }) => (
                              <FormControl>
                                <div className="space-y-2">
                                  <FormLabel className="text-sm font-medium">
                                    ODK Form ID
                                  </FormLabel>
                                  <Input {...field} className="h-9" />
                                  <FormMessage />
                                </div>
                              </FormControl>
                            )}
                          />
                          <FormField
                            name="odkProjectId"
                            control={form.control}
                            render={({ field }) => (
                              <FormControl>
                                <div className="space-y-2">
                                  <FormLabel className="text-sm font-medium">
                                    ODK Project ID
                                  </FormLabel>
                                  <Input
                                    type="number"
                                    {...field}
                                    className="h-9"
                                    onChange={(e) =>
                                      field.onChange(parseInt(e.target.value))
                                    }
                                  />
                                  <FormMessage />
                                </div>
                              </FormControl>
                            )}
                          />
                        </div>
                      </div>

                      {/* Authentication Section */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 border-b pb-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                            />
                          </svg>
                          <h2 className="text-lg font-medium">
                            Authentication
                          </h2>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2">
                          <FormField
                            name="userName"
                            control={form.control}
                            render={({ field }) => (
                              <FormControl>
                                <div className="space-y-2">
                                  <FormLabel className="text-sm font-medium">
                                    Username
                                  </FormLabel>
                                  <Input {...field} className="h-9" />
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
                                <div className="space-y-2">
                                  <FormLabel className="text-sm font-medium">
                                    Password
                                  </FormLabel>
                                  <Input
                                    type="password"
                                    {...field}
                                    className="h-9"
                                  />
                                  <FormMessage />
                                </div>
                              </FormControl>
                            )}
                          />
                        </div>
                      </div>

                      {/* Attachment Paths Section */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                          <div className="flex items-center space-x-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-primary"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                              />
                            </svg>
                            <h2 className="text-lg font-medium">
                              Attachment Paths
                            </h2>
                          </div>
                          <Button
                            type="button"
                            onClick={() =>
                              append({ path: "", type: "business_image" })
                            }
                            variant="secondary"
                            size="sm"
                            className="h-8"
                          >
                            Add Path
                          </Button>
                        </div>
                        <div className="space-y-4">
                          {fields.map((field, index) => (
                            <div
                              key={field.id}
                              className="group relative flex items-start space-x-3 rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md"
                            >
                              <div className="flex-1 space-y-4">
                                <FormField
                                  name={`attachmentPaths.${index}.path`}
                                  control={form.control}
                                  render={({ field }) => (
                                    <FormControl>
                                      <div className="space-y-2">
                                        <FormLabel className="text-sm font-medium">
                                          Path
                                        </FormLabel>
                                        <Input {...field} className="h-9" />
                                      </div>
                                    </FormControl>
                                  )}
                                />
                                <FormField
                                  name={`attachmentPaths.${index}.type`}
                                  control={form.control}
                                  render={({ field }) => (
                                    <FormControl>
                                      <div className="space-y-2">
                                        <FormLabel className="text-sm font-medium">
                                          Type
                                        </FormLabel>
                                        <Select
                                          defaultValue={field.value}
                                          onValueChange={field.onChange}
                                        >
                                          <SelectTrigger className="h-9">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectGroup>
                                              <SelectItem value="audio_monitoring">
                                                Audio Monitoring
                                              </SelectItem>
                                              <SelectItem value="building_image">
                                                Building Image
                                              </SelectItem>
                                              <SelectItem value="building_selfie">
                                                Building Image Selfie
                                              </SelectItem>
                                              <SelectItem value="family_head_image">
                                                Family Head Image
                                              </SelectItem>
                                              <SelectItem value="family_head_selfie">
                                                Family Head Selfie
                                              </SelectItem>
                                              <SelectItem value="business_image">
                                                Business Image
                                              </SelectItem>
                                              <SelectItem value="business_selfie">
                                                Business Image Selfie
                                              </SelectItem>
                                            </SelectGroup>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </FormControl>
                                  )}
                                />
                              </div>
                              <Button
                                type="button"
                                onClick={() => remove(index)}
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 text-destructive hover:text-destructive/90"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-4 w-4"
                                >
                                  <path d="M18 6 6 18" />
                                  <path d="m6 6 12 12" />
                                </svg>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-4 border-t pt-6">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => router.back()}
                        className="w-32"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-32"
                      >
                        {isLoading ? <LoadingButton /> : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submissions" className="space-y-4">
            <Card className="border-border/50 shadow-lg backdrop-blur-sm bg-white/50">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-medium">
                      Submission Management
                    </h2>
                  </div>
                  <p className="text-muted-foreground">
                    Fetch and manage submissions from your ODK form. You can
                    sync data and monitor collection progress.
                  </p>
                  <FetchSubmissions formId={formId} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
