import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function HouseholdAgricultural({ household }: { household: any }) {
  return (
    <Tabs defaultValue="summary">
      <TabsList>
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="land">Land</TabsTrigger>
        <TabsTrigger value="crops">Crops</TabsTrigger>
        <TabsTrigger value="animals">Animals</TabsTrigger>
      </TabsList>

      <TabsContent value="summary">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Agriculture Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium text-muted-foreground">
                  Has Agricultural Land
                </div>
                <div>{household.has_agricultural_land ? "Yes" : "No"}</div>

                <div className="font-medium text-muted-foreground">
                  Land Ownership
                </div>
                <div>
                  {Array.isArray(household.agricultural_land_ownership_types)
                    ? household.agricultural_land_ownership_types.join(", ")
                    : household.agricultural_land_ownership_types || "N/A"}
                </div>

                <div className="font-medium text-muted-foreground">
                  Is Farmer
                </div>
                <div>{household.is_farmer ? "Yes" : "No"}</div>

                <div className="font-medium text-muted-foreground">
                  Male Farmers
                </div>
                <div>{household.total_male_farmers}</div>

                <div className="font-medium text-muted-foreground">
                  Female Farmers
                </div>
                <div>{household.total_female_farmers}</div>

                <div className="font-medium text-muted-foreground">
                  Months Sustained
                </div>
                <div>{household.months_sustained_from_agriculture}</div>

                <div className="font-medium text-muted-foreground">
                  Months Involved
                </div>
                <div>{household.months_involved_in_agriculture}</div>

                <div className="font-medium text-muted-foreground">
                  Agricultural Machinery
                </div>
                <div>
                  {Array.isArray(household.agricultural_machinery)
                    ? household.agricultural_machinery.join(", ")
                    : household.agricultural_machinery || "N/A"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Animal Husbandry</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium text-muted-foreground">
                  Has Animal Husbandry
                </div>
                <div>{household.has_animal_husbandry ? "Yes" : "No"}</div>

                <div className="font-medium text-muted-foreground">
                  Animal Types
                </div>
                <div>
                  {Array.isArray(household.animal_types)
                    ? household.animal_types.join(", ")
                    : household.animal_types || "N/A"}
                </div>

                <div className="font-medium text-muted-foreground">
                  Has Aquaculture
                </div>
                <div>{household.has_aquaculture ? "Yes" : "No"}</div>

                <div className="font-medium text-muted-foreground">
                  Has Apiculture
                </div>
                <div>{household.has_apiculture ? "Yes" : "No"}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="land">
        <div className="mt-4">
          {household.agricultural_lands?.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ward</TableHead>
                  <TableHead>Ownership Type</TableHead>
                  <TableHead>Land Area</TableHead>
                  <TableHead>Irrigation Source</TableHead>
                  <TableHead>Irrigation Time</TableHead>
                  <TableHead>Irrigated Area</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {household.agricultural_lands.map((land: any) => (
                  <TableRow key={land.id}>
                    <TableCell>{land.ward_number}</TableCell>
                    <TableCell>{land.land_ownership_type}</TableCell>
                    <TableCell>{land.land_area}</TableCell>
                    <TableCell>{land.irrigation_source}</TableCell>
                    <TableCell>{land.irrigation_time || "N/A"}</TableCell>
                    <TableCell>{land.irrigated_land_area || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center text-muted-foreground py-4">
              No agricultural land data available
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="crops">
        <div className="mt-4">
          {household.crops?.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ward</TableHead>
                  <TableHead>Crop Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Production</TableHead>
                  <TableHead>Tree Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {household.crops.map((crop: any) => (
                  <TableRow key={crop.id}>
                    <TableCell>{crop.ward_number}</TableCell>
                    <TableCell>{crop.crop_name}</TableCell>
                    <TableCell>{crop.crop_type}</TableCell>
                    <TableCell>{crop.area}</TableCell>
                    <TableCell>{crop.production}</TableCell>
                    <TableCell>{crop.tree_count || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center text-muted-foreground py-4">
              No crop data available
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="animals">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <h5 className="font-medium mb-2">Animals</h5>
            {household.animals?.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Animal Name</TableHead>
                    <TableHead>Count</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {household.animals.map((animal: any) => (
                    <TableRow key={animal.id}>
                      <TableCell>
                        {animal.animal_name}
                        {animal.animal_name_other
                          ? ` (${animal.animal_name_other})`
                          : ""}
                      </TableCell>
                      <TableCell>{animal.total_animals}</TableCell>
                      <TableCell>{animal.animal_sales || "N/A"}</TableCell>
                      <TableCell>{animal.animal_revenue || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center text-muted-foreground py-4">
                No animal data available
              </div>
            )}
          </div>

          <div>
            <h5 className="font-medium mb-2">Animal Products</h5>
            {household.animal_products?.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Production</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {household.animal_products.map((product: any) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        {product.product_name}
                        {product.product_name_other
                          ? ` (${product.product_name_other})`
                          : ""}
                      </TableCell>
                      <TableCell>
                        {product.unit}
                        {product.unit_other ? ` (${product.unit_other})` : ""}
                      </TableCell>
                      <TableCell>{product.production}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center text-muted-foreground py-4">
                No animal product data available
              </div>
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
