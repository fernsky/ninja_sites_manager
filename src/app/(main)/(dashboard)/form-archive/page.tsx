"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { FormPhotoUploader } from "@/components/form-archive/form-photo-uploader";
import { FormPhotoGallery } from "@/components/form-archive/form-photo-gallery";
import { useState } from "react";

const FormArchivePage = () => {
  const [refreshGallery, setRefreshGallery] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshGallery((prev) => prev + 1);
  };

  return (
    <ContentLayout title="Form Archive">
      <div className="container mx-auto p-8 space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Form Archive Submissions</h1>
          <p className="text-gray-600 mb-6">
            Upload photos of physical forms and view your archived submissions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FormPhotoUploader onUploadSuccess={handleUploadSuccess} />
          <FormPhotoGallery key={refreshGallery} />
        </div>
      </div>
    </ContentLayout>
  );
};

export default FormArchivePage;
