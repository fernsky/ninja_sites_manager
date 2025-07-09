"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/trpc/react";

import "leaflet/dist/leaflet.css";
import Link from "next/link";
import {
  Loader2,
  MapPin,
  Puzzle,
  ClipboardList,
  Download,
  Printer,
  FileSpreadsheet,
  Users,
  Key,
  Map,
} from "lucide-react";
import L from "leaflet";
import { useUserStore } from "@/store/user";
import { UserInfoCard } from "@/components/shared/user-info-card";
import TokenStats from "@/components/token-stats";
import { TokenList } from "../tokens/token-list";
import { AreaStatusActions } from "@/components/area/area-status-actions";
import dynamic from "next/dynamic";
import { useMapViewStore } from "@/store/toggle-layer-store";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);

const GeoJSON = dynamic(
  () => import("react-leaflet").then((mod) => mod.GeoJSON),
  { ssr: false },
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);

export function EnumeratorArea() {
  const user = useUserStore((state) => state.user);
  const { data: area, isLoading } = api.enumerator.getAssignedArea.useQuery();
  const { data: tokenStats } = api.area.getTokenStatsByAreaId.useQuery(
    { areaId: area?.id ?? "" },
    { enabled: !!area?.id },
  );
  const { isStreetView, toggleView } = useMapViewStore();

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!area) {
    return (
      <div className="container mx-auto max-w-4xl space-y-6 px-4">
        <Card className="overflow-hidden">
          <div className="flex flex-col items-center gap-6 p-8 text-center md:p-12">
            <div className="rounded-full bg-primary/10 p-4">
              <MapPin className="h-10 w-10 text-primary" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">
                No Area Assigned
              </h2>
              <p className="max-w-md text-muted-foreground">
                You currently don't have any area assigned for surveying.
                Request an area to begin collecting data for your designated
                territory.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <Link href="/area/request">
                <Button size="lg" className="gap-2">
                  <Puzzle className="h-5 w-5" />
                  Request an Area
                </Button>
              </Link>
              <Button variant="outline" size="lg" asChild>
                <Link
                  href="https://www.youtube.com/playlist?list=PLvMsqIrhicjMXwQb6xl_FchBzhKAw1xjz"
                  target="_blank"
                >
                  Learn about area assignments
                </Link>
              </Button>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-full bg-muted px-4 py-2">
              <div className="h-2 w-2 rounded-full bg-yellow-500" />
              <span className="text-sm text-muted-foreground">
                Contact your supervisor if you need immediate assistance
              </span>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 px-8 pb-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="rounded-full bg-primary/10 p-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Contact Support Team</h3>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  name: "Kriti Adhikari",
                  phone: "9852080217",
                  role: "Team Lead",
                },
                {
                  name: "Sarbagya Shrestha",
                  phone: "9745326651",
                  role: "Technical Support",
                },
                {
                  name: "Trilochan Bhusal",
                  phone: "9851402011",
                  role: "Technical Support",
                },
              ].map((contact) => (
                <div
                  key={contact.phone}
                  className="group flex h-[160px] flex-col justify-between p-6 rounded-xl border bg-card hover:bg-muted/50 hover:shadow-md transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <p className="font-medium leading-none">{contact.name}</p>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {contact.role}
                    </p>
                  </div>
                  <div className="pt-2">
                    <Badge variant="secondary" className="font-normal text-sm">
                      {contact.phone}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4 lg:px-10">
      {/* Overview Section */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="border-b bg-muted/50">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Area Overview</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 p-6 sm:grid-cols-2">
            {/* Ward Info */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Ward Number
              </p>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold tracking-tight">
                  {area.wardNumber}
                </p>
                <Badge variant="secondary" className="px-4 py-1">
                  Ward{" "}
                  {area.wardNumber < 10
                    ? `0${area.wardNumber}`
                    : area.wardNumber}
                </Badge>
              </div>
            </div>

            {/* Area Code */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Area Code
              </p>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold tracking-tight">{area.code}</p>
                <Badge variant="outline">
                  Zone {Math.floor(area.code / 100)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Info Card - Simplified */}
        <UserInfoCard
          name={user?.name ?? "Anonymous"}
          userId={user?.id ?? ""}
          role={user?.role ?? "enumerator"}
        />
      </div>

      {/* Token Stats and Actions Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Token Stats */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b bg-muted/50">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Token Statistics</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {tokenStats && <TokenStats stats={tokenStats} />}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="border-b bg-muted/50">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col gap-3">
              <Button className="justify-start gap-2 w-full" variant="outline">
                <FileSpreadsheet className="h-4 w-4" />
                Building Form
              </Button>
              <Button className="justify-start gap-2 w-full" variant="outline">
                <Users className="h-4 w-4" />
                Family Form
              </Button>
              <Button className="justify-start gap-2 w-full" variant="outline">
                <Printer className="h-4 w-4" />
                Print All Forms
              </Button>
              <Button className="justify-start gap-2 w-full" variant="outline">
                <Download className="h-4 w-4" />
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add the AreaStatusActions component here */}
      {area && <AreaStatusActions area={area} />}

      {/* Map and Token List Section */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Survey Area</CardTitle>
            </div>
            <Badge variant="outline">Ward {area.wardNumber}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-b">
            <div className="h-[400px] w-full z-0">
              <MapContainer
                className="h-full w-full z-0"
                zoom={15}
                scrollWheelZoom={false}
                center={(() => {
                  if (!area.geometry)
                    return [26.72069444681497, 88.04840072844279];
                  const bounds = L.geoJSON(area.geometry).getBounds();
                  return bounds.getCenter();
                })()}
              >
                {/* Add the toggle button */}
                <div className="absolute top-2 right-2 z-[400]">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white"
                    onClick={toggleView}
                  >
                    <Map className="h-4 w-4 mr-2" />
                    {isStreetView ? "Satellite View" : "Street View"}
                  </Button>
                </div>

                {/* Replace the existing TileLayer with this conditional one */}
                <TileLayer
                  key={isStreetView ? "street" : "satellite"}
                  attribution={
                    isStreetView ? "© OpenStreetMap contributors" : "© Google"
                  }
                  url={
                    isStreetView
                      ? "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                      : "https://mt1.google.com/vt/lyrs=y,h&x={x}&y={y}&z={z}"
                  }
                  className="z-0"
                />
                {area.geometry && (
                  <GeoJSON
                    data={area.geometry}
                    style={{
                      color: "#2563eb",
                      weight: 2,
                      opacity: 0.6,
                      fillColor: "#3b82f6",
                      fillOpacity: 0.1,
                    }}
                  />
                )}
              </MapContainer>
            </div>
          </div>
        </CardContent>
      </Card>
      <TokenList areaId={area.id} />
    </div>
  );
}
