import { Hotel } from "lucide-react";
import { Card } from "../../building/card";
import { DetailRow } from "../../shared/detail-row";
import type { BusinessSchema } from "../types";

export function HotelSection({ business }: { business: BusinessSchema }) {
  return (
    <Card title="Hotel Details" icon={Hotel}>
      <DetailRow
        icon={Hotel}
        label="Accommodation Type"
        value={business?.hotelAccommodationType}
      />
      <DetailRow
        icon={Hotel}
        label="Room Count"
        value={business?.hotelRoomCount?.toString()}
      />
      <DetailRow
        icon={Hotel}
        label="Bed Count"
        value={business?.hotelBedCount?.toString()}
      />
      <DetailRow
        icon={Hotel}
        label="Room Type"
        value={business?.hotelRoomType}
      />
      <DetailRow icon={Hotel} label="Has Hall" value={business?.hotelHasHall} />
      {business?.hotelHallCapacity && (
        <DetailRow
          icon={Hotel}
          label="Hall Capacity"
          value={business.hotelHallCapacity.toString()}
        />
      )}
    </Card>
  );
}
