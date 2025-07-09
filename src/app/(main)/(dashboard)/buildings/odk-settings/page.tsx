import { ContentLayout } from "@/components/admin-panel/content-layout";
import { ODKResourcesForm } from "@/components/dashboard/odk-resources-form";
import Link from "next/link";

const EditFormPage = ({ params }: { params: { id: string } }) => {
  return (
    <ContentLayout
      title="Edit Form"
      actions={
        <div className="flex gap-2">
          <Link
            href={"/buildings"}
            className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Buildings
          </Link>
        </div>
      }
    >
      <ODKResourcesForm formId={"Kerabari_building_survey"} />
    </ContentLayout>
  );
};

export default EditFormPage;
