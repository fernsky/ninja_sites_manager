"use client";
import React, { useEffect } from "react";
import { useAggregateStore } from "@/hooks/use-aggregate-store";
import { AggregateTableView } from "./table/AggregateTableView";
import { AggregateGridView } from "./AggregateGridView";
import { AggregateMapView } from "./map/AggregateMapView";
import { AggregateViewSwitch } from "./AggregateViewSwitch";
import { AggregateFiltersPanel } from "./AggregateFiltersPanel";
import { Card } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Home, Store, BarChart4, Info } from "lucide-react";
import { localizeNumber } from "@/lib/utils/localize-number";

export function AggregateDataView() {
  const { view, pagination, filters, sorting, setPagination } =
    useAggregateStore();

  // Fetch building stats for informational purposes
  const { data: buildingStats } = api.aggregate.getBuildingStats.useQuery();

  // Reset pagination offset when filters change
  useEffect(() => {
    setPagination({ offset: 0 });
  }, [filters, setPagination]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="text-muted-foreground">
          {buildingStats ? (
            <>
              {localizeNumber(buildingStats.totalBuildings, "ne")} भवनहरू,{" "}
              {localizeNumber(buildingStats.totalHouseholds, "ne")} परिवारहरू र{" "}
              {localizeNumber(buildingStats.totalBusinesses, "ne")} व्यवसायहरू
            </>
          ) : (
            "डाटा लोड हुँदैछ..."
          )}
        </div>
        <AggregateViewSwitch />
      </div>

      <AggregateFiltersPanel />

      <Tabs defaultValue="data" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="data" className="flex gap-2 items-center">
            {view.viewMode === "map" ? (
              <MapPin className="h-4 w-4" />
            ) : (
              <Building className="h-4 w-4" />
            )}
            <span>डाटा</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex gap-2 items-center">
            <BarChart4 className="h-4 w-4" />
            <span>विश्लेषण</span>
          </TabsTrigger>
          <TabsTrigger value="about" className="flex gap-2 items-center">
            <Info className="h-4 w-4" />
            <span>बारेमा</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="data" className="space-y-4">
          {view.viewMode === "table" && <AggregateTableView />}

          {view.viewMode === "grid" && <AggregateGridView />}

          {view.viewMode === "map" && (
            <Card className="overflow-hidden border rounded-lg">
              <AggregateMapView />
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="p-6">
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <BarChart4 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">
                विश्लेषण चाँडै आउँदैछ
              </h3>
              <p className="text-muted-foreground max-w-md">
                समग्र डाटाको विश्लेषण ड्यासबोर्ड हाल विकासको क्रममा छ। यहाँ
                तपाईंले चाँडै नै तपाईंको सर्वेक्षण डाटाबाट निकालिएको चार्टहरू,
                प्रवृत्तिहरू र तथ्यांकहरू हेर्न सक्नुहुनेछ।
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">समग्र डाटाको बारेमा</h3>

            <div className="space-y-4">
              <p>
                समग्र डाटा मोड्युलले केराबारी नगरपालिकामा संकलित सबै सर्वेक्षण
                डाटाको एकीकृत दृष्टिकोण प्रदान गर्दछ, भवनहरू, परिवारहरू, र
                व्यवसायहरूलाई एउटै इन्टरफेसमा एकीकृत गर्दछ।
              </p>

              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">भवनहरू</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    स्वामित्व विवरण, निर्माण सामग्री, र स्थान डाटा सहित भौतिक
                    संरचनाहरूको जानकारी हेर्नुहोस्।
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Home className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">परिवारहरू</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    परिवार विवरण, कृषि गतिविधिहरू, र सामाजिक-आर्थिक जानकारी सहित
                    आवासीय एकाइहरूको डाटामा पहुँच गर्नुहोस्।
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Store className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">व्यवसायहरू</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    व्यवसाय प्रकारहरू, कर्मचारी जानकारी, र आर्थिक योगदानहरू सहित
                    व्यापारिक गतिविधिहरू अन्वेषण गर्नुहोस्।
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Map pin icon component
function MapPin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
