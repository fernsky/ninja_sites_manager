import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, User, Building } from "lucide-react";

export function BusinessBasicSection({ business }: { business: any }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">आधारभूत जानकारी</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{business.operator_name}</span>
            </div>

            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs">
                {business.operator_gender || "N/A"}
              </Badge>
            </div>

            {business.operator_phone && (
              <div className="text-sm text-muted-foreground">
                फोन: {business.operator_phone}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              {business.business_locality || "N/A"}
              {business.business_gps_latitude &&
                business.business_gps_longitude && (
                  <div className="text-xs text-muted-foreground">
                    GPS:{" "}
                    {business.business_gps_latitude.toString().substring(0, 8)},
                    {business.business_gps_longitude.toString().substring(0, 8)}
                  </div>
                )}
            </div>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              व्यवसाय प्रकृति
            </div>
            <div className="flex items-center gap-1.5">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{business.business_nature}</span>
            </div>
            <div className="text-xs mt-1">
              <span className="text-muted-foreground">प्रकार: </span>
              <span>{business.business_type || "N/A"}</span>
            </div>
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-1">
              लगानी र स्थान
            </div>
            <div className="text-sm">
              {business.investment_amount
                ? `Rs. ${business.investment_amount.toLocaleString()}`
                : "N/A"}
            </div>
            <div className="text-xs mt-1">
              <span className="text-muted-foreground">स्थान स्वामित्व: </span>
              <span>{business.business_location_ownership || "N/A"}</span>
            </div>
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-1">
              व्यक्तिगत विवरण
            </div>
            <div className="text-xs mt-1">
              <span className="text-muted-foreground">शिक्षा: </span>
              <span>{business.operator_education_level || "N/A"}</span>
            </div>
            <div className="text-xs mt-1">
              <span className="text-muted-foreground">व्यवसाय नम्बर: </span>
              <span>{business.business_number || "N/A"}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
