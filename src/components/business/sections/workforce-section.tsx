import { Users, Briefcase } from "lucide-react";
import { Card } from "../../building/card";
import { DetailRow } from "../../shared/detail-row";
import type { BusinessSchema } from "../types";

interface WorkforceSectionProps {
  business: BusinessSchema;
}

export function WorkforceSection({ business }: WorkforceSectionProps) {
  const hasValue = (value: number | null | undefined) => value && value > 0;

  return (
    <Card title="Workforce Information" icon={Briefcase}>
      {/* Partners Section */}
      {business?.hasPartners === "yes" && (
        <>
          <DetailRow
            icon={Users}
            label="Total Partners"
            value={business?.totalPartners?.toString()}
          />
          {hasValue(business?.nepaliMalePartners) && (
            <DetailRow
              icon={Users}
              label="Nepali Male Partners"
              value={business?.nepaliMalePartners?.toString()}
            />
          )}
          {hasValue(business?.nepaliFemalePartners) && (
            <DetailRow
              icon={Users}
              label="Nepali Female Partners"
              value={business?.nepaliFemalePartners?.toString()}
            />
          )}
          {business?.hasForeignPartners === "yes" && (
            <>
              {hasValue(business?.foreignMalePartners) && (
                <DetailRow
                  icon={Users}
                  label="Foreign Male Partners"
                  value={business?.foreignMalePartners?.toString()}
                />
              )}
              {hasValue(business?.foreignFemalePartners) && (
                <DetailRow
                  icon={Users}
                  label="Foreign Female Partners"
                  value={business?.foreignFemalePartners?.toString()}
                />
              )}
            </>
          )}
        </>
      )}

      {/* Family Members Section */}
      {business?.hasInvolvedFamily === "yes" && (
        <>
          <DetailRow
            icon={Users}
            label="Total Family Members"
            value={business?.totalInvolvedFamily?.toString()}
          />
          {hasValue(business?.maleInvolvedFamily) && (
            <DetailRow
              icon={Users}
              label="Male Family Members"
              value={business?.maleInvolvedFamily?.toString()}
            />
          )}
          {hasValue(business?.femaleInvolvedFamily) && (
            <DetailRow
              icon={Users}
              label="Female Family Members"
              value={business?.femaleInvolvedFamily?.toString()}
            />
          )}
        </>
      )}

      {/* Permanent Employees Section */}
      {business?.hasPermanentEmployees === "yes" && (
        <>
          <DetailRow
            icon={Users}
            label="Total Permanent Employees"
            value={business?.totalPermanentEmployees?.toString()}
          />
          {hasValue(business?.nepaliMalePermanentEmployees) && (
            <DetailRow
              icon={Users}
              label="Nepali Male Permanent"
              value={business?.nepaliMalePermanentEmployees?.toString()}
            />
          )}
          {hasValue(business?.nepaliFemalePermanentEmployees) && (
            <DetailRow
              icon={Users}
              label="Nepali Female Permanent"
              value={business?.nepaliFemalePermanentEmployees?.toString()}
            />
          )}
          {business?.hasForeignPermanentEmployees === "yes" && (
            <>
              {hasValue(business?.foreignMalePermanentEmployees) && (
                <DetailRow
                  icon={Users}
                  label="Foreign Male Permanent"
                  value={business?.foreignMalePermanentEmployees?.toString()}
                />
              )}
              {hasValue(business?.foreignFemalePermanentEmployees) && (
                <DetailRow
                  icon={Users}
                  label="Foreign Female Permanent"
                  value={business?.foreignFemalePermanentEmployees?.toString()}
                />
              )}
            </>
          )}
        </>
      )}

      {/* Temporary Employees Section */}
      {business?.hasTemporaryEmployees === "yes" && (
        <>
          <DetailRow
            icon={Users}
            label="Total Temporary Employees"
            value={business?.totalTemporaryEmployees?.toString()}
          />
          {hasValue(business?.nepaliMaleTemporaryEmployees) && (
            <DetailRow
              icon={Users}
              label="Nepali Male Temporary"
              value={business?.nepaliMaleTemporaryEmployees?.toString()}
            />
          )}
          {hasValue(business?.nepaliFemaleTemporaryEmployees) && (
            <DetailRow
              icon={Users}
              label="Nepali Female Temporary"
              value={business?.nepaliFemaleTemporaryEmployees?.toString()}
            />
          )}
          {business?.hasForeignTemporaryEmployees === "yes" && (
            <>
              {hasValue(business?.foreignMaleTemporaryEmployees) && (
                <DetailRow
                  icon={Users}
                  label="Foreign Male Temporary"
                  value={business?.foreignMaleTemporaryEmployees?.toString()}
                />
              )}
              {hasValue(business?.foreignFemaleTemporaryEmployees) && (
                <DetailRow
                  icon={Users}
                  label="Foreign Female Temporary"
                  value={business?.foreignFemaleTemporaryEmployees?.toString()}
                />
              )}
            </>
          )}
        </>
      )}
    </Card>
  );
}
