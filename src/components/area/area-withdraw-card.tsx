"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, ArrowRight, AlertCircle, Info } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AreaWithdrawCardProps {
  area: {
    areaId: string;
    code: string;
    areaStatus: string;
    wardNumber: number;
    userid: string;
    geometry: any;
    centroid: any;
  };
  onWithdraw: (areaId: string, userId: string) => Promise<void>;
  isWithdrawing: boolean;
}

export const AreaWithdrawCard: React.FC<AreaWithdrawCardProps> = ({
  area,
  onWithdraw,
  isWithdrawing,
}) => {
  const statusColor = {
    unassigned: "border-yellow-200 bg-yellow-50 text-yellow-800",
    assigned: "border-green-200 bg-green-50 text-green-800",
    pending: "border-blue-200 bg-blue-50 text-blue-800",
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:bg-muted/50 hover:shadow-lg">
      <div className="absolute right-3 top-3 z-20">
        <Badge
          className={`${
            statusColor[area.areaStatus as keyof typeof statusColor]
          } border px-2.5 py-1 text-xs font-medium capitalize tracking-wide shadow-sm`}
        >
          {area.areaStatus}
        </Badge>
      </div>

      <div className="relative h-[220px] overflow-hidden bg-muted/10">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/20 to-transparent" />
        <MapContainer
          center={area.centroid.coordinates.reverse()}
          zoom={15}
          zoomControl={false}
          className="h-full w-full transition-transform duration-300 will-change-transform group-hover:scale-105"
          dragging={false}
          scrollWheelZoom={false}
        >
          <TileLayer url="https://mts1.google.com/vt/lyrs=m@186112443&hl=x-local&src=app&x={x}&y={y}&z={z}&s=Galile" />
          <GeoJSON
            data={area.geometry}
            style={() => ({
              color: "#2563eb",
              weight: 2.5,
              fillOpacity: 0.15,
              fillColor: "#3b82f6",
            })}
          />
        </MapContainer>
      </div>

      <CardContent className="space-y-4 p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-[13px] font-medium text-muted-foreground">
                Area Code
              </p>
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                {area.code}
              </h3>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="rounded-full bg-primary/10 p-2 transition-colors hover:bg-primary/15">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left" className="text-xs">
                  Ward {area.wardNumber}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">
                Ward {area.wardNumber}
              </span>
            </div>
            <span className="text-muted-foreground/40">•</span>
            <span className="text-muted-foreground">
              {/** @ts-ignore */}
              Zone {Math.floor(area.code / 100)}
            </span>
          </div>
        </div>

        <Button
          variant="destructive"
          size="sm"
          className="w-full gap-2"
          onClick={async () => {
            try {
              if (!area.userid) throw new Error("User ID is required");
              await onWithdraw(area.areaId, area.userid);
            } catch (error) {
              console.error("Withdrawal failed:", error);
            }
          }}
          disabled={isWithdrawing}
        >
          {isWithdrawing ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span className="text-sm">Withdrawing...</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-3.5 w-3.5" />
              <span className="text-sm">Withdraw Request</span>
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
