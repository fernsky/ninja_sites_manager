import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { unknown } from "zod";

interface MapState {
  geometry: unknown;
}

interface MapContextType {
  geometry: MapState["geometry"];
  setGeometry: Dispatch<SetStateAction<MapState["geometry"]>>;
}

export const MapContext = createContext<MapContextType | undefined>(undefined);

export function MapStateProvider({ children }: { children: ReactNode }) {
  const [geometry, setGeometry] = useState<MapState["geometry"]>(unknown);

  return (
    <MapContext.Provider value={{ geometry, setGeometry }}>
      {children}
    </MapContext.Provider>
  );
}

export function useMapContext(): MapContextType {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMapContext must be used within a MapStateProvider");
  }
  return context;
}
