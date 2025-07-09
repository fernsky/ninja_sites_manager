import { BookOpen, Users, Home } from "lucide-react";
import { DetailsCard } from "../details-card";
import { Individual } from "@/server/api/routers/individuals/individuals.schema";

export function CulturalSection({ individual }: { individual?: Individual }) {
  return (
    <DetailsCard
      title="Cultural Background"
      icon={<BookOpen className="h-5 w-5 text-primary" />}
      items={[
        {
          label: "Citizenship",
          value: individual?.citizenOf,
          icon: <Home className="h-4 w-4" />,
        },
        {
          label: "Caste",
          value: individual?.caste,
          icon: <Users className="h-4 w-4" />,
        },
        {
          label: "Ancestral Language",
          value: individual?.ancestorLanguage,
          icon: <BookOpen className="h-4 w-4" />,
        },
        {
          label: "Mother Tongue",
          value: individual?.primaryMotherTongue,
          icon: <BookOpen className="h-4 w-4" />,
        },
        {
          label: "Religion",
          value: individual?.religion,
          icon: <BookOpen className="h-4 w-4" />,
        },
      ]}
    />
  );
}
