"use client";
import { useLayerStore } from "@/store/use-layer-store";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Layers } from "lucide-react";
import { LayerControl } from "./layer-control";

export const LayerControlWrapper = () => {
  const isControlOpen = useLayerStore((state) => state.isControlOpen);
  const setControlOpen = useLayerStore((state) => state.setControlOpen);

  return (
    <Sheet open={isControlOpen} onOpenChange={setControlOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="lg" className="">
          <Layers className="mr-2 h-4 w-4" />
          Map Layers
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:w-[540px] p-0 border-l z-[100000]"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <LayerControl />
      </SheetContent>
    </Sheet>
  );
};
