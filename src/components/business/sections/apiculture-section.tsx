import { Globe } from "lucide-react";
import { Card } from "../../building/card";
import { DetailRow } from "../../shared/detail-row";
import type { BusinessSchema } from "../types";

export function ApicultureSection({ business }: { business: BusinessSchema }) {
  const hasValue = (value: number | null | undefined) => value && value > 0;

  return (
    <Card title="Apiculture Information" icon={Globe}>
      <DetailRow
        icon={Globe}
        label="Ward Number"
        value={business?.apicultureWardNo?.toString()}
      />
      {hasValue(business?.hiveCount) && (
        <DetailRow
          icon={Globe}
          label="Hive Count"
          value={business?.hiveCount?.toString()}
        />
      )}
      {business?.honeyProduction && (
        <DetailRow
          icon={Globe}
          label="Honey Production"
          value={business.honeyProduction.toString()}
        />
      )}
    </Card>
  );
}
