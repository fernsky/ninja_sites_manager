import { create } from 'zustand'

interface MapViewState {
    isStreetView: boolean
    toggleView: () => void
    setStreetView: (value: boolean) => void
}

export const useMapViewStore = create<MapViewState>((set) => ({
    isStreetView: true,
    toggleView: () => set((state) => ({ isStreetView: !state.isStreetView })),
    setStreetView: (value: boolean) => set({ isStreetView: value }),
}))