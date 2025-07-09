import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { localizeNumber } from "@/lib/utils/localize-number";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HouseholdAdditionalTables({ household }: { household: any }) {
  // Group crops by type for organization
  const groupCropsByType = () => {
    if (!household.crops || !household.crops.length) return {};

    return household.crops.reduce((acc: any, crop: any) => {
      const type = crop.crop_type || "other";
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(crop);
      return acc;
    }, {});
  };

  const groupedCrops = groupCropsByType();

  // Map crop type to Nepali labels
  const getCropTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      food: "अन्न बाली",
      pulse: "दलहन बाली",
      vegetable: "तरकारी बाली",
      oilseed: "तेल बाली",
      fruit: "फलफूल बाली",
      cash: "नगदे बाली",
      spice: "मसला बाली",
      other: "अन्य बाली",
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Agricultural Lands */}
      {household.agricultural_lands?.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">कृषि भूमि</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full overflow-auto max-h-[400px]">
              <div className="min-w-[700px]">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-background">
                    <TableRow className="bg-muted/50">
                      <TableHead>वडा</TableHead>
                      <TableHead>स्वामित्वको प्रकार</TableHead>
                      <TableHead>जमिनको क्षेत्रफल</TableHead>
                      <TableHead>सिँचाई स्रोत</TableHead>
                      <TableHead>सिँचाई समय</TableHead>
                      <TableHead>सिँचित क्षेत्र</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {household.agricultural_lands.map((land: any) => (
                      <TableRow key={land.id} className="hover:bg-muted/30">
                        <TableCell className="py-2">
                          {localizeNumber(land.ward_number, "ne")}
                        </TableCell>
                        <TableCell className="py-2">
                          {land.land_ownership_type}
                        </TableCell>
                        <TableCell className="py-2">
                          {land.land_area &&
                            localizeNumber(land.land_area, "ne")}
                        </TableCell>
                        <TableCell className="py-2">
                          {land.irrigation_source}
                        </TableCell>
                        <TableCell className="py-2">
                          {land.irrigation_time
                            ? localizeNumber(land.irrigation_time, "ne")
                            : "N/A"}
                        </TableCell>
                        <TableCell className="py-2">
                          {land.irrigated_land_area
                            ? localizeNumber(land.irrigated_land_area, "ne")
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Crops - Grouped by Type */}
      {Object.keys(groupedCrops).length > 0 &&
        Object.entries(groupedCrops).map(([cropType, crops]: [string, any]) => (
          <Card key={cropType}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                {getCropTypeLabel(cropType)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full overflow-auto max-h-[400px]">
                <div className="min-w-[700px]">
                  <Table>
                    <TableHeader className="sticky top-0 z-10 bg-background">
                      <TableRow className="bg-muted/50">
                        <TableHead>वडा</TableHead>
                        <TableHead>बालीको नाम</TableHead>
                        <TableHead>क्षेत्रफल</TableHead>
                        <TableHead>उत्पादन</TableHead>
                        <TableHead>रुखको संख्या</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {crops.map((crop: any) => (
                        <TableRow key={crop.id} className="hover:bg-muted/30">
                          <TableCell className="py-2">
                            {localizeNumber(crop.ward_number, "ne")}
                          </TableCell>
                          <TableCell className="py-2">
                            {crop.crop_name}
                          </TableCell>
                          <TableCell className="py-2">
                            {crop.area && localizeNumber(crop.area, "ne")}
                          </TableCell>
                          <TableCell className="py-2">
                            {crop.production &&
                              localizeNumber(crop.production, "ne")}
                          </TableCell>
                          <TableCell className="py-2">
                            {crop.tree_count
                              ? localizeNumber(crop.tree_count, "ne")
                              : "N/A"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ))}

      {/* Animals and Products in a split view */}
      {(household.animals?.length > 0 ||
        household.animal_products?.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Animals */}
          {household.animals?.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">पशुपालन</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="w-full overflow-auto max-h-[300px]">
                  <Table>
                    <TableHeader className="sticky top-0 z-10 bg-background">
                      <TableRow className="bg-muted/50">
                        <TableHead>पशुको नाम</TableHead>
                        <TableHead className="text-right">संख्या</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {household.animals.map((animal: any) => (
                        <TableRow key={animal.id} className="hover:bg-muted/30">
                          <TableCell className="py-2">
                            {animal.animal_name}
                            {animal.animal_name_other && (
                              <span className="text-xs text-muted-foreground ml-1">
                                ({animal.animal_name_other})
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-medium py-2">
                            {localizeNumber(animal.total_animals, "ne")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Animal Products */}
          {household.animal_products?.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">पशुजन्य उत्पादन</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="w-full overflow-auto max-h-[300px]">
                  <Table>
                    <TableHeader className="sticky top-0 z-10 bg-background">
                      <TableRow className="bg-muted/50">
                        <TableHead>उत्पादनको नाम</TableHead>
                        <TableHead>एकाइ</TableHead>
                        <TableHead className="text-right">उत्पादन</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {household.animal_products.map((product: any) => (
                        <TableRow
                          key={product.id}
                          className="hover:bg-muted/30"
                        >
                          <TableCell className="py-2">
                            {product.product_name}
                            {product.product_name_other && (
                              <span className="text-xs text-muted-foreground ml-1">
                                ({product.product_name_other})
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="py-2">
                            {product.unit}
                            {product.unit_other && (
                              <span className="text-xs text-muted-foreground ml-1">
                                ({product.unit_other})
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-medium py-2">
                            {localizeNumber(product.production, "ne")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Deaths */}
      {household.deaths?.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                मृतक
              </Badge>
              मृतक परिवारका सदस्य
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full overflow-auto max-h-[300px]">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-background">
                  <TableRow className="bg-muted/50">
                    <TableHead>नाम</TableHead>
                    <TableHead>लिङ्ग</TableHead>
                    <TableHead>उमेर</TableHead>
                    <TableHead>कारण</TableHead>
                    <TableHead>प्रजनन मृत्यु अवस्था</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {household.deaths.map((death: any) => (
                    <TableRow key={death.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium py-2">
                        {death.deceased_name}
                      </TableCell>
                      <TableCell className="py-2">
                        <Badge variant="secondary" className="text-xs">
                          {death.deceased_gender}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2">
                        {localizeNumber(death.deceased_age, "ne")}
                      </TableCell>
                      <TableCell className="py-2">
                        {death.deceased_death_cause}
                      </TableCell>
                      <TableCell className="py-2">
                        {death.deceased_fertility_death_condition || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Suggestions to municipality */}
      {household.municipal_suggestions?.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">नगरपालिकालाई सुझाव</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {Array.isArray(household.municipal_suggestions) &&
                  household.municipal_suggestions.map(
                    (suggestion: string, idx: number) => (
                      <Badge key={idx} variant="secondary">
                        {suggestion}
                      </Badge>
                    ),
                  )}
                {!Array.isArray(household.municipal_suggestions) && (
                  <div className="text-sm">
                    {household.municipal_suggestions}
                  </div>
                )}
              </div>

              {household.municipal_suggestions_other && (
                <>
                  <Separator className="my-2" />
                  <div className="text-sm bg-muted/20 p-3 rounded-md italic">
                    {household.municipal_suggestions_other}
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
