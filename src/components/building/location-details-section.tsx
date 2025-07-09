import { Building2, MapPin } from "lucide-react";
import { ShowPoint } from "@/components/shared/maps/show-point";

interface LocationDetailsSectionProps {
  coordinates: [number, number];
  gpsAccuracy?: number;
  altitude?: number;
}

export function LocationDetailsSection({
  coordinates,
  gpsAccuracy,
  altitude,
}: LocationDetailsSectionProps) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
      <div className="border-b bg-muted/50 px-3 py-2">
        <h3 className="text-sm font-medium">Location Details</h3>
      </div>
      <div className="p-3 space-y-3">
        <div className="aspect-[3/2] w-full overflow-hidden rounded-md border">
          <ShowPoint coordinates={coordinates} />
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-md bg-muted/50 p-2">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="font-medium">GPS Accuracy</p>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {gpsAccuracy?.toFixed(2) || "—"} meters
            </p>
          </div>
          <div className="rounded-md bg-muted/50 p-2">
            <div className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="font-medium">Altitude</p>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {altitude?.toFixed(2) || "—"} meters
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
