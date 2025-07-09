import { FileText } from "lucide-react";
import { Card } from "../../building/card";
import { DetailRow } from "../../shared/detail-row";
import { BusinessSchema } from "@/server/db/schema";
import { MultipleDetailRow } from "@/components/shared/multiple-detail-row";

export function LegalInfoSection({ business }: { business: BusinessSchema }) {
  return (
    <Card title="Legal Information" icon={FileText}>
      <DetailRow
        icon={FileText}
        label="Registration Status"
        value={business?.registrationStatus}
      />
      <MultipleDetailRow
        icon={FileText}
        label="Registered Bodies"
        values={business?.registeredBodies}
      />
      {business?.registeredBodiesOther && (
        <DetailRow
          icon={FileText}
          label="Other Registered Bodies"
          value={business.registeredBodiesOther}
        />
      )}
      <DetailRow
        icon={FileText}
        label="Statutory Status"
        value={business?.statutoryStatus}
      />
      {business?.statutoryStatusOther && (
        <DetailRow
          icon={FileText}
          label="Other Statutory Status"
          value={business.statutoryStatusOther}
        />
      )}
      <DetailRow
        icon={FileText}
        label="PAN Status"
        value={business?.panStatus}
      />
      {business?.panNumber && (
        <DetailRow
          icon={FileText}
          label="PAN Number"
          value={business.panNumber}
        />
      )}
    </Card>
  );
}
