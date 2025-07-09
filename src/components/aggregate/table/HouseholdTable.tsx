import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "@/lib/utils";
import { FullHouseholdDisplay } from "./household/FullHouseholdDisplay";

export function HouseholdTable({ households }: { households: any[] }) {
  if (!households || households.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No households found
      </div>
    );
  }

  return (
    <ScrollArea className="w-full">
      <div className="space-y-10 pb-6">
        {households.map((household) => (
          <FullHouseholdDisplay key={household.id} household={household} />
        ))}
      </div>
    </ScrollArea>
  );
}
