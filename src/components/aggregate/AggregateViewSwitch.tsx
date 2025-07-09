import React from "react";
import { useAggregateStore } from "@/hooks/use-aggregate-store";
import { Button } from "@/components/ui/button";
import { TableIcon, GridIcon, MapIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type AggregateViewSwitchProps = {
  className?: string;
};

export function AggregateViewSwitch({ className }: AggregateViewSwitchProps) {
  const { view, setViewMode } = useAggregateStore();

  return (
    <div
      className={cn(
        "flex items-center bg-muted rounded-md border p-1",
        className,
      )}
    >
      <Button
        variant={view.viewMode === "table" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => setViewMode("table")}
        className="flex gap-1.5 items-center"
      >
        <TableIcon className="h-4 w-4" />
        <span className="sr-only sm:not-sr-only">Table</span>
      </Button>
      <Button
        variant={view.viewMode === "grid" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => setViewMode("grid")}
        className="flex gap-1.5 items-center"
      >
        <GridIcon className="h-4 w-4" />
        <span className="sr-only sm:not-sr-only">Grid</span>
      </Button>
      <Button
        variant={view.viewMode === "map" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => setViewMode("map")}
        className="flex gap-1.5 items-center"
      >
        <MapIcon className="h-4 w-4" />
        <span className="sr-only sm:not-sr-only">Map</span>
      </Button>
    </div>
  );
}
