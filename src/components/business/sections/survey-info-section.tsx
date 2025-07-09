import { Users, Binary, Globe } from "lucide-react";
import { Card } from "../../building/card";
import { DetailRow } from "../../shared/detail-row";
import { BusinessSchema } from "@/server/db/schema";

export function SurveyInfoSection({ business }: { business: BusinessSchema }) {
  return (
    <Card title="Survey Information" icon={Users}>
      <DetailRow
        icon={Users}
        label="Enumerator"
        value={business?.enumeratorName}
      />
      <DetailRow
        icon={Binary}
        label="Enumerator ID"
        value={business?.enumeratorId}
      />
      <DetailRow icon={Globe} label="Phone" value={business?.phone} />
    </Card>
  );
}
