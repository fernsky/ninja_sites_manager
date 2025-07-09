"use client";

import { useMapContext } from "@/lib/map-state";
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { useEffect, useRef } from "react";
import { GeoJSON } from "geojson";
import L from "leaflet";

const isValidGeometry = (geom: any): boolean => {
  try {
    if (!geom || !geom.type || !geom.coordinates) return false;
    // Basic validation - ensure geometry has required properties
    if (!["Polygon", "MultiPolygon"].includes(geom.type)) return false;
    // Ensure coordinates are properly structured
    if (!Array.isArray(geom.coordinates)) return false;
    return true;
  } catch (err) {
    return false;
  }
};

export const MapDrawer = ({ zIndex = 1000 }: { zIndex?: number }) => {
  const { geometry, setGeometry } = useMapContext();
  const featureGroupRef = useRef<any>(null);

  useEffect(() => {
    if (featureGroupRef.current && geometry && isValidGeometry(geometry)) {
      const leafletFG = featureGroupRef.current;
      // Clear existing layers
      leafletFG.clearLayers();
      // Add new geometry
      const leafletGeoJSON = new L.GeoJSON(geometry as GeoJSON);
      leafletGeoJSON.eachLayer((layer) => {
        leafletFG.addLayer(layer);
      });
    }
  }, [geometry]);

  const handleCreated = (e: any) => {
    const layer = e.layer;
    const geojson = layer.toGeoJSON();
    if (isValidGeometry(geojson.geometry)) {
      setGeometry(geojson);
    }
  };

  const handleEdited = (e: any) => {
    const layers = e.layers;
    layers.eachLayer((layer: any) => {
      const geojson = layer.toGeoJSON();
      if (isValidGeometry(geojson.geometry)) {
        setGeometry(geojson);
      }
    });
  };

  const handleDeleted = () => {
    setGeometry(null);
  };

  return (
    <FeatureGroup ref={featureGroupRef}>
      <EditControl
        position="topright"
        onCreated={handleCreated}
        onEdited={handleEdited}
        onDeleted={handleDeleted}
        draw={{
          rectangle: false,
          circle: false,
          circlemarker: false,
          marker: false,
          polyline: false,
          polygon: {
            allowIntersection: false,
            drawError: {
              color: "#e1e4e8",
              message: "<strong>Oh snap!<strong> you can't draw that!",
            },
            shapeOptions: {
              color: "#000",
              fillOpacity: 0.2,
              weight: 2,
              zIndex: zIndex, // Apply zIndex here
            },
          },
        }}
        edit={{
          remove: false,
          edit: true,
        }}
      />
    </FeatureGroup>
  );
};
