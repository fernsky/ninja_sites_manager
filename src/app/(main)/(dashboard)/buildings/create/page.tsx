import React from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CreateBuilding: React.FC = () => {
  return (
    <ContentLayout title="Create Building">
      <div className="flex justify-start mb-4">
        <Link href="/buildings">
          <Button variant="outline" type="button">
            Back to Buildings
          </Button>
        </Link>
      </div>
      {/* Add your building creation form here */}
    </ContentLayout>
  );
};

export default CreateBuilding;
