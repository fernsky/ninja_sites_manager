import React from "react";
import { Popup } from "react-leaflet";
import {
  Building,
  Home,
  Store,
  X,
  MapPin,
  Phone,
  User,
  Users,
  Briefcase,
  ChevronRight,
  Image,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type InfoWindowProps = {
  entity: {
    id: string;
    type: string;
    position: {
      lat: number;
      lng: number;
    };
    buildingId?: string;
    properties: Record<string, any>;
  };
  onClose: () => void;
};

export function InfoWindow({ entity, onClose }: InfoWindowProps) {
  const { type, properties, id, buildingId } = entity;

  const renderEntityIcon = () => {
    switch (type) {
      case "building":
        return <Building className="h-5 w-5" />;
      case "household":
        return <Home className="h-5 w-5" />;
      case "business":
        return <Store className="h-5 w-5" />;
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };

  const renderEntityTitle = () => {
    switch (type) {
      case "building":
        return properties.title || "Building";
      case "household":
        return properties.headName || "Household";
      case "business":
        return properties.businessName || "Business";
      default:
        return "Entity";
    }
  };

  const renderEntityDetails = () => {
    switch (type) {
      case "building":
        return (
          <>
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {properties.ownerName || "Unknown owner"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 mt-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm">
                  Ward {properties.wardNumber || "?"}, Area{" "}
                  {properties.areaCode || "?"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 mt-2">
              <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm">
                  {properties.totalFamilies || 0} families,{" "}
                  {properties.totalBusinesses || 0} businesses
                </p>
              </div>
            </div>

            {properties.enumeratorName && (
              <div className="flex items-start gap-2 mt-2">
                <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Enumerated by</p>
                  <p className="text-sm">{properties.enumeratorName}</p>
                </div>
              </div>
            )}
          </>
        );

      case "household":
        return (
          <>
            <div className="flex items-start gap-2">
              <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm">
                  {properties.totalMembers || 0} members
                </p>
              </div>
            </div>

            {properties.headPhone && (
              <div className="flex items-start gap-2 mt-2">
                <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm">{properties.headPhone}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-2 mt-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm">
                  Ward {properties.wardNumber || "?"}, Area{" "}
                  {properties.areaCode || "?"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {properties.locality || ""}
                </p>
              </div>
            </div>
          </>
        );

      case "business":
        return (
          <>
            {properties.businessType && (
              <div className="flex items-start gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm">{properties.businessType}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-2 mt-2">
              <User className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Operator</p>
                <p className="text-sm">
                  {properties.operatorName || "Unknown"}
                </p>
              </div>
            </div>

            {properties.operatorPhone && (
              <div className="flex items-start gap-2 mt-2">
                <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm">{properties.operatorPhone}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-2 mt-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm">
                  Ward {properties.wardNumber || "?"}, Area{" "}
                  {properties.areaCode || "?"}
                </p>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const getEntityImage = () => {
    if (type === "building" && properties.buildingImage) {
      return properties.buildingImage;
    } else if (type === "household" && properties.familyImage) {
      return properties.familyImage;
    } else if (type === "business" && properties.businessImage) {
      return properties.businessImage;
    }
    return null;
  };

  const getDetailLink = () => {
    switch (type) {
      case "building":
        return `/aggregate/buildings/${id}`;
      case "household":
        return `/aggregate/households/${id}`;
      case "business":
        return `/aggregate/businesses/${id}`;
      default:
        return "#";
    }
  };

  const image = getEntityImage();

  return (
    <Popup
      position={[entity.position.lat, entity.position.lng]}
      onClose={onClose}
      offset={[0, -20]}
      closeButton={false}
      className="custom-popup"
    >
      <Card className="w-[280px] shadow-lg border-0">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {renderEntityIcon()}
              <CardTitle className="text-base">{renderEntityTitle()}</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </CardHeader>

        {image && (
          <div className="px-4 pt-2">
            <div className="w-full h-32 relative rounded-md overflow-hidden">
              <img
                src={image}
                alt={`${type} image`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        <CardContent className="p-4 pt-2">{renderEntityDetails()}</CardContent>

        <CardFooter className="px-4 pb-4 pt-0">
          <Link href={getDetailLink()} className="w-full" passHref>
            <Button
              variant="outline"
              className="w-full flex items-center justify-between"
              size="sm"
            >
              <span>View details</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </Popup>
  );
}
