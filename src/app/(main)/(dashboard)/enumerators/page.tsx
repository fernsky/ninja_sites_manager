import React from "react";
import { EnumeratorsList } from "@/components/dashboard/enumerators-list";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tractor, UserPlus } from "lucide-react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

const EnumeratorsPage: React.FC = () => {
  return (
    <ContentLayout
      title="Enumerators"
      actions={
        <>
          <Link href="/enumerators/create">
            <Button className="mr-2">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Enumerator
            </Button>
          </Link>
          <Link href="/enumerators/track">
            <Button>
              <MagnifyingGlassIcon className="mr-2 h-4 w-4" />
              Track Enumerators
            </Button>
          </Link>
        </>
      }
    >
      <div className="container px-0">
        <EnumeratorsList />
      </div>
    </ContentLayout>
  );
};

export default EnumeratorsPage;
