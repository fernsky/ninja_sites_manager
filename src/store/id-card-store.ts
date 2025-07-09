import { create } from "zustand";
import { IdCardDetails } from "@/types/idCard";

interface IdCardStore {
  details: IdCardDetails;
  setDetails: (details: Partial<IdCardDetails>) => void;
  resetDetails: () => void;
}

const defaultDetails: IdCardDetails = {
  nepaliName: null,
  nepaliAddress: null,
  nepaliPhone: null,
};

export const useIdCardStore = create<IdCardStore>((set) => ({
  details: defaultDetails,
  setDetails: (newDetails) =>
    set((state) => ({
      details: { ...state.details, ...newDetails },
    })),
  resetDetails: () =>
    set({
      details: defaultDetails,
    }),
}));
