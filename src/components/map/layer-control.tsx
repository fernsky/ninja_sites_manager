"use client";
import { api } from "@/trpc/react";
import { useLayerStore } from "@/store/use-layer-store";
import { Layers, Search, Building2, MapPin } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

export const LayerControl = () => {
  const { data: wardsData, isLoading: isLoadingWards } =
    api.ward.getWards.useQuery();
  const { data: areasData, isLoading: isLoadingAreas } =
    api.area.getLayerAreas.useQuery();
  const setControlOpen = useLayerStore((state) => state.setControlOpen);

  const {
    wards,
    areas,
    wardLayers,
    setWards,
    setAreas,
    setWardVisibility,
    setAreaVisibility,
    initializeWardLayer,
  } = useLayerStore();

  const [isExpanded, setIsExpanded] = useState(false);

  const handleWardVisibility = (
    e: React.MouseEvent,
    wardNumber: string,
    checked: boolean,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setWardVisibility(wardNumber, checked);
    if (!checked) {
      const wardAreas = areas.filter(
        (area) => area.wardNumber.toString() === wardNumber,
      );
      wardAreas.forEach((area) => {
        setAreaVisibility(wardNumber, area.id, false);
      });
    }
  };

  const handleAreaVisibility = (
    e: React.MouseEvent,
    wardNumber: string,
    areaId: string,
    checked: boolean,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setAreaVisibility(wardNumber, areaId, checked as boolean);
  };

  // Initialize store with data while preserving visibility state
  useEffect(() => {
    if (wardsData && areasData) {
      setWards(wardsData);
      setAreas(areasData);

      wardsData.forEach((ward) => {
        const wardAreas = areasData.filter(
          (area) => area.wardNumber === ward.wardNumber,
        );

        // Only initialize if the ward layer doesn't exist
        if (!wardLayers[ward.wardNumber]) {
          initializeWardLayer(
            ward.wardNumber.toString(),
            wardAreas.map((area) => area.id),
          );
        }
      });
    }
  }, [
    wardsData,
    areasData,
    setWards,
    setAreas,
    initializeWardLayer,
    wardLayers,
  ]);

  if (isLoadingWards || isLoadingAreas) return null;

  return (
    <div className="h-full flex flex-col z-[400]">
      <div className="p-6 border-b">
        <SheetHeader>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Layers className="h-5 w-5 text-primary" />
            </div>
            <SheetTitle>Map Layers</SheetTitle>
          </div>
          <SheetDescription>
            Toggle visibility of different map layers
          </SheetDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search layers..." className="pl-9" />
          </div>
        </SheetHeader>
      </div>

      <ScrollArea className="flex-1 px-6">
        <div className="space-y-6 pb-6">
          <Accordion type="multiple" className="space-y-4">
            {wards?.map((ward) => (
              <AccordionItem
                key={ward.wardNumber}
                value={`ward-${ward.wardNumber}`}
                className="border rounded-lg px-2 shadow-sm bg-white transition-all duration-200 hover:shadow-md"
              >
                <AccordionTrigger className="hover:no-underline py-3">
                  <div
                    className="flex items-center gap-3 w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={wardLayers[ward.wardNumber]?.visible}
                      onCheckedChange={(checked) =>
                        setWardVisibility(
                          ward.wardNumber.toString(),
                          checked as boolean,
                        )
                      }
                      className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-2"
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <Building2 className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">
                        Ward {ward.wardNumber}
                      </span>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {
                          areas.filter(
                            (area) => area.wardNumber === ward.wardNumber,
                          ).length
                        }{" "}
                        areas
                      </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-3 transition-all duration-200">
                  <div className="ml-8 space-y-2 border-l-2 border-gray-100 pl-4">
                    {areas
                      .filter((area) => area.wardNumber === ward.wardNumber)
                      .map((area) => (
                        <div
                          key={area.id}
                          className="flex items-center gap-3 group hover:bg-gray-50 p-1 rounded-md transition-all duration-200 ease-in-out"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            checked={
                              wardLayers[ward.wardNumber]?.areas[area.id]
                            }
                            onCheckedChange={(checked) => {
                              const syntheticEvent = {
                                preventDefault: () => {},
                                stopPropagation: () => {},
                              } as React.MouseEvent;
                              handleAreaVisibility(
                                syntheticEvent,
                                ward.wardNumber.toString(),
                                area.id,
                                checked as boolean,
                              );
                            }}
                            className="data-[state=checked]:bg-primary/80 border-2"
                          />
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-600">
                              Area {area.code}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
};
