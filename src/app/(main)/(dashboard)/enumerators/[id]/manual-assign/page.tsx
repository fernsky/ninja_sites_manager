"use client";
import RequestArea from "@/components/dashboard/request-area";
import { useParams } from "next/navigation";
import { api } from "@/trpc/react";

import { useState } from "react";
import ManualAssign from "@/components/dashboard/manual-assignment";

const ManualAssignPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const { data: enumerator } = api.enumerator.getById.useQuery(id as string, {
    enabled: !!id,
  });

  return (
    <div className="p-4">
      <ManualAssign
        //@ts-ignore
        user={{
          id: enumerator?.id || "",
          name: enumerator?.name || "",
          userName: enumerator?.userName || "",
          email: enumerator?.email || "",
          wardNumber: enumerator?.wardNumber || 1,
          phoneNumber: enumerator?.phoneNumber || "",
          role: enumerator?.role || "enumerator",
          avatar: enumerator?.avatar || "",
        }}
      />
    </div>
  );
};

export default ManualAssignPage;
