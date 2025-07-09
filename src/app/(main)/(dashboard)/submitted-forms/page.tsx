"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { SubmittedFormsViewer } from "@/components/form-archive/submitted-forms-viewer";

const SubmittedFormsPage = () => {
  return (
    <ContentLayout title="Submitted Forms">
      <div className="container mx-auto p-8 space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Physical Form Submissions</h1>
          <p className="text-gray-600 mb-6">
            View and manage all submitted physical forms by ward and area code.
            Track submissions from all enumerators across different areas.
          </p>
        </div>

        <SubmittedFormsViewer />
      </div>
    </ContentLayout>
  );
};

export default SubmittedFormsPage;
