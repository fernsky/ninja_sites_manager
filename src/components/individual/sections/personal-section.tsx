import { User, Users, Heart } from "lucide-react";
import { DetailsCard } from "../details-card";
import { Individual } from "@/server/api/routers/individuals/individuals.schema";

export function PersonalSection({ individual }: { individual?: Individual }) {
  return (
    <DetailsCard
      title="Personal Information"
      icon={<User className="h-5 w-5 text-primary" />}
      items={[
        {
          label: "Name",
          value: individual?.name,
          icon: <User className="h-4 w-4" />,
        },
        {
          label: "Age",
          value: individual?.age?.toString(),
          icon: <Users className="h-4 w-4" />,
        },
        {
          label: "Gender",
          value: individual?.gender,
          icon: <User className="h-4 w-4" />,
        },
        {
          label: "Family Role",
          value: individual?.familyRole,
          icon: <Users className="h-4 w-4" />,
        },
        {
          label: "Marital Status",
          value: individual?.maritalStatus,
          icon: <Heart className="h-4 w-4" />,
        },
        {
          label: "Marriage Age",
          value: individual?.marriedAge?.toString(),
          icon: <Heart className="h-4 w-4" />,
        },
      ]}
    />
  );
}
