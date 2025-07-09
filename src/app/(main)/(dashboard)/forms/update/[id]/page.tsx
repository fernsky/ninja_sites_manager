import { ContentLayout } from "@/components/admin-panel/content-layout";
import { FormsEdit } from "@/components/dashboard/forms-edit";

const EditFormPage = ({ params }: { params: { id: string } }) => {
  return (
    <ContentLayout title="Edit Form">
      <FormsEdit formId={params.id} />
    </ContentLayout>
  );
};

export default EditFormPage;
