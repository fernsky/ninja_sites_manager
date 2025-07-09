"use client";
import { FetchSubmissions } from "./fetch-submissions";
import { api } from "@/trpc/react";

export const ShowForm = ({ formId }: { formId: string }) => {
  const form = api.superadmin.getForm.useQuery({ id: formId });

  if (form.isLoading) {
    return <div>Loading...</div>;
  }

  if (form.error) {
    return <div>Error fetching form: {form.error.message}</div>;
  }

  return (
    <div>
      {/* <h1>{form.data?.name}</h1> */}
      {/* Render other form details */}
      <FetchSubmissions formId={formId} />
    </div>
  );
};
