import { GraduationCap, Home, Map, Plane } from "lucide-react";
import { DetailsCard } from "../details-card";
import { Individual } from "@/server/api/routers/individuals/individuals.schema";

export function MigrationSection({ individual }: { individual?: Individual }) {
  if (!individual) return null;
  return (
    <DetailsCard
      title="Absentee Information"
      icon={<Plane className="h-5 w-5 text-primary" />}
      items={[
        {
          label: "Current Location",
          value: individual.absenteeLocation,
          icon: <Map className="h-4 w-4" />,
        },
        {
          label: "Province",
          value: individual.absenteeProvince,
          icon: <Map className="h-4 w-4" />,
        },
        {
          label: "District",
          value: individual.absenteeDistrict,
          icon: <Map className="h-4 w-4" />,
        },
        {
          label: "Country",
          value: individual.absenteeCountry,
          icon: <Plane className="h-4 w-4" />,
        },
        {
          label: "Age When Left",
          value: individual.absenteeAge?.toString(),
          icon: <Home className="h-4 w-4" />,
        },
        {
          label: "Education Level",
          value: individual.absenteeEducationalLevel,
          icon: <GraduationCap className="h-4 w-4" />,
        },
        {
          label: "Reason for Absence",
          value: individual.absenceReason,
          icon: <Home className="h-4 w-4" />,
        },
        {
          label: "Sends Remittance",
          value:
            individual.absenteeHasSentCash === "Yes"
              ? `NPR ${individual.absenteeCashAmount}`
              : "No",
          icon: <Home className="h-4 w-4" />,
        },
      ]}
    />
  );
}
