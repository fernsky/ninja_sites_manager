import { Store } from "lucide-react";
import { Card } from "../../building/card";
import { DetailRow } from "../../shared/detail-row";
import { BusinessSchema } from "@/server/db/schema";

export function BusinessBasicSection({
  business,
}: {
  business: BusinessSchema;
}) {
  return (
    <Card title="Business Information" icon={Store}>
      <DetailRow
        icon={Store}
        label="Business Name"
        value={business?.businessName}
      />
      <DetailRow
        icon={Store}
        label="Business Nature"
        value={business?.businessNature}
      />
      {business?.businessNatureOther && (
        <DetailRow
          icon={Store}
          label="Other Business Nature"
          value={business.businessNatureOther}
        />
      )}
      <DetailRow
        icon={Store}
        label="Business Type"
        value={business?.businessType}
      />
      {business?.businessTypeOther && (
        <DetailRow
          icon={Store}
          label="Other Business Type"
          value={business.businessTypeOther}
        />
      )}
    </Card>
  );
}
