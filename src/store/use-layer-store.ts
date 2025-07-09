import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { persist } from "zustand/middleware";
import { produce } from "immer";
import { Area } from "@/server/api/routers/areas/area.schema";
import { Ward } from "@/server/api/routers/ward/ward.schema";

interface LayerState {
  wards: Ward[];
  areas: Area[];
  wardLayers: {
    [wardNumber: string]: {
      visible: boolean;
      areas: {
        [areaId: string]: boolean;
      };
    };
  };
  setWards: (wards: Ward[]) => void;
  setAreas: (areas: Area[]) => void;
  setWardVisibility: (wardNumber: string, visible: boolean) => void;
  setAreaVisibility: (
    wardNumber: string,
    areaId: string,
    visible: boolean,
  ) => void;
  initializeWardLayer: (wardNumber: string, areaIds: string[]) => void;

  // Add UI state
  isControlOpen: boolean;
  setControlOpen: (open: boolean) => void;
}

export const useLayerStore = create<LayerState>()(
  devtools(
    persist(
      (set) => ({
        wards: [],
        areas: [],
        wardLayers: {},

        setWards: (wards) => set({ wards }),
        setAreas: (areas) => set({ areas }),

        setWardVisibility: (wardNumber, visible) =>
          set((state) => ({
            wardLayers: {
              ...state.wardLayers,
              [wardNumber]: {
                ...state.wardLayers[wardNumber],
                visible,
              },
            },
          })),

        setAreaVisibility: (wardNumber, areaId, visible) =>
          set((state) => ({
            wardLayers: {
              ...state.wardLayers,
              [wardNumber]: {
                ...state.wardLayers[wardNumber],
                areas: {
                  ...state.wardLayers[wardNumber]?.areas,
                  [areaId]: visible,
                },
              },
            },
          })),

        initializeWardLayer: (wardNumber, areaIds) =>
          set((state) => ({
            wardLayers: {
              ...state.wardLayers,
              [wardNumber]: {
                visible: false,
                areas: Object.fromEntries(areaIds.map((id) => [id, false])),
              },
            },
          })),

        // Add UI state
        isControlOpen: false,
        setControlOpen: (open) => set({ isControlOpen: open }),
      }),
      {
        name: "layer-store", // unique name for localStorage
        partialize: (state) => ({
          wardLayers: state.wardLayers, // only persist layer visibility state
        }),
      },
    ),
  ),
);
