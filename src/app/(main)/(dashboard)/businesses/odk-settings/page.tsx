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
            href={"/businesses"}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Businesses
          </Link>
        </div>
      }
    >
      <ODKResourcesForm formId={"Kerabari_business_survey"} />
    </ContentLayout>
  );
};

export default EditFormPage;
