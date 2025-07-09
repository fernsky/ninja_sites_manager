import { Globe, DollarSign, Users } from "lucide-react";
import { Card } from "../../building/card";
import { DetailRow } from "../../shared/detail-row";
import type { BusinessSchema } from "../types";

export function AquacultureSection({ business }: { business: BusinessSchema }) {
  const hasValue = (value: number | null | undefined) => value && value > 0;

  return (
    <Card title="Aquaculture Information" icon={Globe}>
      <DetailRow
        icon={Globe}
        label="Ward Number"
        value={business.aquacultureWardNo?.toString()}
      />
      {hasValue(business?.pondCount) && (
        <DetailRow
          icon={Globe}
          label="Pond Count"
          value={business?.pondCount?.toString()}
        />
      )}
      {business?.pondArea && (
        <DetailRow
          icon={Globe}
          label="Pond Area"
          value={business.pondArea.toString()}
        />
      )}
      {business?.fishProduction && (
        <DetailRow
          icon={Globe}
          label="Fish Production"
          value={business.fishProduction.toString()}
        />
      )}
      {hasValue(business?.fingerlingNumber) && (
        <DetailRow
          icon={Globe}
          label="Fingerling Number"
          value={business?.fingerlingNumber?.toString()}
        />
      )}
      {business?.totalInvestment && (
        <DetailRow
          icon={DollarSign}
          label="Total Investment"
          value={business.totalInvestment.toString()}
        />
      )}
      {business?.annualIncome && (
        <DetailRow
          icon={DollarSign}
          label="Annual Income"
          value={business.annualIncome.toString()}
        />
      )}
      {hasValue(business?.employmentCount) && (
        <DetailRow
          icon={Users}
          label="Employment Count"
          value={business.employmentCount?.toString()}
        />
      )}
    </Card>
  );
}
