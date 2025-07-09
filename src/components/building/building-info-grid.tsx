import {
  Building2,
  Users,
  MapPin,
  Home,
  Binary,
  Calendar,
  Globe,
  AlertTriangle,
  Clock,
  Construction,
} from "lucide-react";
import { Card } from "./card";
import { DetailRow } from "../shared/detail-row";
import { MultipleDetailRow } from "../shared/multiple-detail-row";
import { BuildingSchema } from "@/server/db/schema";
import { LocationDetailsSection } from "./location-details-section";

interface BuildingInfoGridProps {
  building: BuildingSchema;
  locationDetails?: {
    coordinates: [number, number];
    gpsAccuracy?: number;
    altitude?: number;
  };
}

export function BuildingInfoGrid({
  building,
  locationDetails,
}: BuildingInfoGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Survey Info and Building Details */}
      <div className="space-y-6">
        <Card title="Survey Information" icon={Users}>
          <DetailRow
            icon={Calendar}
            label="Survey Date"
            value={building?.surveyDate?.toLocaleDateString()}
          />
          <DetailRow
            icon={Users}
            label="Enumerator"
            value={building?.enumeratorName}
          />
          <DetailRow
            icon={Binary}
            label="Enumerator ID"
            value={building?.enumeratorId}
          />
        </Card>

        <Card title="Building Details" icon={Building2}>
          <DetailRow
            icon={Home}
            label="Land Ownership"
            value={building?.landOwnership}
          />
          <DetailRow icon={Building2} label="Base" value={building?.base} />
          <DetailRow
            icon={Building2}
            label="Outer Wall"
            value={building?.outerWall}
          />
          <DetailRow icon={Building2} label="Roof" value={building?.roof} />
          <DetailRow icon={Building2} label="Floor" value={building?.floor} />
          <DetailRow
            icon={AlertTriangle}
            label="Map Status"
            value={building?.mapStatus}
          />
          <MultipleDetailRow
            icon={AlertTriangle}
            label="Natural Disasters"
            values={building?.naturalDisasters}
          />
        </Card>
      </div>

      {/* Location and Accessibility */}
      <div className="space-y-6">
        <Card title="Location Details" icon={MapPin}>
          <DetailRow
            icon={MapPin}
            label="Ward Number"
            value={building?.tmpWardNumber}
          />
          <DetailRow icon={Globe} label="Locality" value={building?.locality} />
          <DetailRow
            icon={Binary}
            label="Area Code"
            value={building?.tmpAreaCode}
          />

          {locationDetails && (
            <div className="mt-4 pt-4 border-t">
              <LocationDetailsSection {...locationDetails} />
            </div>
          )}
        </Card>

        <Card title="Accessibility Information" icon={Clock}>
          <DetailRow
            icon={Clock}
            label="Time to Market"
            value={building?.timeToMarket}
          />
          <DetailRow
            icon={Clock}
            label="Time to Active Road"
            value={building?.timeToActiveRoad}
          />
          <DetailRow
            icon={Clock}
            label="Time to Public Bus"
            value={building?.timeToPublicBus}
          />
          <DetailRow
            icon={Clock}
            label="Time to Health Organization"
            value={building?.timeToHealthOrganization}
          />
          <DetailRow
            icon={Clock}
            label="Time to Financial Organization"
            value={building?.timeToFinancialOrganization}
          />
          <DetailRow
            icon={Construction}
            label="Road Status"
            value={building?.roadStatus}
          />
        </Card>
      </div>
    </div>
  );
}
