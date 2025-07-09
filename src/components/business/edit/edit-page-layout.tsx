import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import React from "react";

interface EditPageLayoutProps {
  children: React.ReactNode;
}

export function EditPageLayout({ children }: { children: React.ReactNode }) {
  // Extract the first 3 children (assignments) and rest of the form
  const [
    enumeratorAssignment,
    wardAssignment,
    areaAssignment,
    ...restChildren
  ] = React.Children.toArray(children);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {enumeratorAssignment}
        {wardAssignment}
        {areaAssignment}
      </div>
      {restChildren}
    </div>
  );
}
