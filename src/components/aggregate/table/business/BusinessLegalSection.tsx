import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function BusinessLegalSection({ business }: { business: any }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">कानूनी जानकारी</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              दर्ता स्थिति
            </div>
            <div className="flex items-center gap-1.5">
              <Badge
                variant={
                  business.registration_status === "registered"
                    ? "default"
                    : "outline"
                }
                className="text-xs"
              >
                {business.registration_status || "N/A"}
              </Badge>
            </div>

            {Array.isArray(business.registered_bodies) &&
              business.registered_bodies.length > 0 && (
                <div className="text-xs mt-2">
                  <span className="text-muted-foreground">
                    दर्ता संस्थाहरू:{" "}
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {business.registered_bodies.map(
                      (body: string, idx: number) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs font-normal"
                        >
                          {body}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
              )}
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-1">
              प्यान स्थिति
            </div>
            <div className="flex items-center gap-1.5">
              <Badge
                variant={business.pan_status === "yes" ? "default" : "outline"}
                className="text-xs"
              >
                {business.pan_status || "N/A"}
              </Badge>
            </div>
            {business.pan_number && (
              <div className="text-xs mt-1">
                <span className="text-muted-foreground">प्यान नं: </span>
                <span>{business.pan_number}</span>
              </div>
            )}
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-1">
              अन्य कानूनी विवरण
            </div>
            <div className="text-xs">
              <span className="text-muted-foreground">वैधानिक स्थिति: </span>
              <span>{business.statutory_status || "N/A"}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
