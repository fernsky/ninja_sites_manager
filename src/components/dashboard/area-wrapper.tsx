"use client";

import { MapStateProvider } from "@/lib/map-state";
import { ReactNode } from "react";

interface AreaWrapperProps {
  children: ReactNode;
  initialGeometry?: unknown;
}

export function AreaWrapper({ children, initialGeometry }: AreaWrapperProps) {
  return (
    <MapStateProvider>
      <div className="py-4">{children}</div>
    </MapStateProvider>
  );
}
