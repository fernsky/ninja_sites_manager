import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

export function BusinessAgricultureSection({ business }: { business: any }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">कृषि जानकारी</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground">कृषि प्रकार:</div>
          <div className="text-sm font-medium">
            {business.agricultural_type}
          </div>
        </div>

        <Separator />

        {/* Crops Table */}
        {business.crops?.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-2">फसलहरू</div>
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>फसल</TableHead>
                    <TableHead>प्रकार</TableHead>
                    <TableHead>क्षेत्रफल</TableHead>
                    <TableHead>उत्पादन</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {business.crops.map((crop: any) => (
                    <TableRow key={crop.id}>
                      <TableCell>{crop.crop_name}</TableCell>
                      <TableCell>{crop.crop_type}</TableCell>
                      <TableCell>{crop.crop_area}</TableCell>
                      <TableCell>{crop.crop_production}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        )}

        {/* Animals Table */}
        {business.animals?.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-medium mb-2">पशुहरू</div>
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>पशु</TableHead>
                    <TableHead>संख्या</TableHead>
                    <TableHead>बिक्री</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {business.animals.map((animal: any) => (
                    <TableRow key={animal.id}>
                      <TableCell>{animal.animal_name}</TableCell>
                      <TableCell>{animal.total_count}</TableCell>
                      <TableCell>{animal.sales_count || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        )}

        {/* Animal Products Table */}
        {business.animal_products?.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-medium mb-2">पशुजन्य उत्पादनहरू</div>
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>उत्पादन</TableHead>
                    <TableHead>मात्रा</TableHead>
                    <TableHead>एकाइ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {business.animal_products.map((product: any) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.product_name}</TableCell>
                      <TableCell>{product.production_amount}</TableCell>
                      <TableCell>{product.unit}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        )}

        {/* Aquaculture */}
        {business.aquaculture && (
          <div className="mt-4">
            <div className="text-sm font-medium mb-2">जलकृषि</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-muted/20 p-3 rounded-md">
              <div>
                <div className="text-xs text-muted-foreground">
                  पोखरी संख्या:
                </div>
                <div className="text-sm">
                  {business.aquaculture.pond_count || "N/A"}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">
                  पोखरी क्षेत्रफल:
                </div>
                <div className="text-sm">
                  {business.aquaculture.pond_area || "N/A"}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">
                  माछा उत्पादन:
                </div>
                <div className="text-sm">
                  {business.aquaculture.fish_production || "N/A"}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">वार्षिक आय:</div>
                <div className="text-sm">
                  {business.aquaculture.annual_income || "N/A"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Apiculture */}
        {business.apiculture && (
          <div className="mt-4">
            <div className="text-sm font-medium mb-2">मौरीपालन</div>
            <div className="grid grid-cols-2 gap-3 bg-muted/20 p-3 rounded-md">
              <div>
                <div className="text-xs text-muted-foreground">
                  मौरीघार संख्या:
                </div>
                <div className="text-sm">
                  {business.apiculture.hive_count || "N/A"}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">मह उत्पादन:</div>
                <div className="text-sm">
                  {business.apiculture.honey_production || "N/A"}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
