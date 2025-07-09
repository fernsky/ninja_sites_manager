import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Role } from "@/lib/menu-list";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: Role;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      setUser: (user) => set({ user }),
      setIsLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "user-storage",
    },
  ),
);
