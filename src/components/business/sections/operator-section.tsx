import { Users, Globe, GraduationCap } from "lucide-react";
import { Card } from "../../building/card";
import { DetailRow } from "../../shared/detail-row";
import type { BusinessSchema } from "../types";

export function OperatorSection({ business }: { business: BusinessSchema }) {
  return (
    <Card title="Operator Details" icon={Users}>
      <DetailRow icon={Users} label="Name" value={business?.operatorName} />
      <DetailRow icon={Globe} label="Phone" value={business?.operatorPhone} />
      <DetailRow
        icon={Users}
        label="Age"
        value={business?.operatorAge?.toString()}
      />
      <DetailRow icon={Users} label="Gender" value={business?.operatorGender} />
      <DetailRow
        icon={GraduationCap}
        label="Education"
        value={business?.operatorEducation}
      />
    </Card>
  );
}
