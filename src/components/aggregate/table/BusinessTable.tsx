import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FullBusinessDisplay } from "./business/FullBusinessDisplay";

export function BusinessTable({ businesses }: { businesses: any[] }) {
  return (
    <ScrollArea className="w-full">
      <div className="space-y-6">
        {businesses.map((business) => (
          <FullBusinessDisplay key={business.id} business={business} />
        ))}
      </div>
    </ScrollArea>
  );
}
