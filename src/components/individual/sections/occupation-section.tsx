import { Briefcase, GraduationCap, Home } from "lucide-react";
import { DetailsCard } from "../details-card";
import { Individual } from "@/server/api/routers/individuals/individuals.schema";

export function OccupationSection({ individual }: { individual?: Individual }) {
  return (
    <div className="space-y-4">
      <DetailsCard
        title="Occupation Details"
        icon={<Briefcase className="h-5 w-5 text-primary" />}
        items={[
          {
            label: "Work Duration",
            value: individual?.financialWorkDuration,
            icon: <Briefcase className="h-4 w-4" />,
          },
          {
            label: "Primary Occupation",
            value: individual?.primaryOccupation,
            icon: <Briefcase className="h-4 w-4" />,
          },
          {
            label: "Work Barrier",
            value: individual?.workBarrier,
            icon: <Briefcase className="h-4 w-4" />,
          },
          {
            label: "Work Availability",
            value: individual?.workAvailability,
            icon: <Briefcase className="h-4 w-4" />,
          },
          {
            label: "Training Status",
            value: individual?.hasTraining,
            icon: <GraduationCap className="h-4 w-4" />,
          },
          {
            label: "Primary Skill",
            value: individual?.primarySkill,
            icon: <GraduationCap className="h-4 w-4" />,
          },
        ]}
      />
      {individual?.isPresent === "No" && (
        <DetailsCard
          title="Migration Information"
          icon={<Home className="h-5 w-5 text-primary" />}
          items={[
            {
              label: "Current Location",
              value: individual?.absenteeLocation,
              icon: <Home className="h-4 w-4" />,
            },
            {
              label: "Country",
              value: individual?.absenteeCountry,
              icon: <Home className="h-4 w-4" />,
            },
            {
              label: "Reason",
              value: individual?.absenceReason,
              icon: <Briefcase className="h-4 w-4" />,
            },
            {
              label: "Remittance",
              value:
                individual?.absenteeHasSentCash === "Yes"
                  ? `NPR ${individual?.absenteeCashAmount}`
                  : "No",
              icon: <Briefcase className="h-4 w-4" />,
            },
          ]}
        />
      )}
    </div>
  );
}
