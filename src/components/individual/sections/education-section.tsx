import { GraduationCap, BookOpen, Users } from "lucide-react";
import { DetailsCard } from "../details-card";
import { Individual } from "@/server/api/routers/individuals/individuals.schema";

export function EducationSection({ individual }: { individual?: Individual }) {
  return (
    <DetailsCard
      title="Education Status"
      icon={<GraduationCap className="h-5 w-5 text-primary" />}
      items={[
        {
          label: "Literacy Status",
          value: individual?.literacyStatus,
          icon: <BookOpen className="h-4 w-4" />,
        },
        {
          label: "Education Level",
          value: individual?.educationalLevel,
          icon: <GraduationCap className="h-4 w-4" />,
        },
        {
          label: "School Status",
          value: individual?.schoolPresenceStatus,
          icon: <GraduationCap className="h-4 w-4" />,
        },
        {
          label: "Primary Subject",
          value: individual?.primarySubject,
          icon: <BookOpen className="h-4 w-4" />,
        },
        {
          label: "School Barrier",
          value: individual?.schoolBarrier,
          icon: <GraduationCap className="h-4 w-4" />,
        },
        {
          label: "Internet Access",
          value: individual?.hasInternetAccess,
          icon: <Users className="h-4 w-4" />,
        },
      ]}
    />
  );
}
