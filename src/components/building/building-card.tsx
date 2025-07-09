import { BuildingSchema } from "@/server/db/schema";
import { Building2, MapPin, UserSquare2, Binary } from "lucide-react";
import Link from "next/link";

export function BuildingCard({ building }: { building: BuildingSchema }) {
  return (
    <Link href={`/buildings/${building.id}`}>
      <div className="rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Ward {building.tmpWardNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <Binary className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Area Code</span>
              <span className="text-sm">{building.tmpAreaCode || "—"}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <UserSquare2 className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                Collected by
              </span>
              <span className="text-sm">{building.enumeratorName || "—"}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Base</span>
              <span className="text-sm capitalize">{building.base || "—"}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
