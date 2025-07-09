import { BusinessSchema } from "@/server/db/schema/business/business";
import { Building2, MapPin, Store, User2 } from "lucide-react";
import Link from "next/link";

export function BusinessCard({ business }: { business: BusinessSchema }) {
  return (
    <Link href={`/businesses/${business.id}`}>
      <div className="rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Store className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                Business Name
              </span>
              <span className="text-sm">{business.businessName || "—"}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Location</span>
              <span className="text-sm">
                Ward {business.wardId}, {business.locality || "—"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Nature</span>
              <span className="text-sm capitalize">
                {business.businessNature || "—"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <User2 className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Operator</span>
              <span className="text-sm">{business.operatorName || "—"}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
