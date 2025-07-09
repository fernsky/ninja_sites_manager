"use client";

import { useUserStore } from "@/store/user";
import { useEffect } from "react";

interface UserHydrationProps {
  user: any | null; // Replace with your actual user type
}

export function UserHydration({ user }: UserHydrationProps) {
  const setUser = useUserStore((state) => state.setUser);
  const setIsLoading = useUserStore((state) => state.setIsLoading);

  useEffect(() => {
    setUser(user);
    setIsLoading(false);
  }, [user, setUser, setIsLoading]);

  return null;
}
