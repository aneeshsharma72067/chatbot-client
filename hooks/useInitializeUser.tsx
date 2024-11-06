"use client";

import { useAtom } from "jotai";
import { userAtom } from "../stores/store";
import { useEffect } from "react";

function useInitializeUser() {
  const [, setUser] = useAtom(userAtom);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DEV_SERVER_URL}/auth-check`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const userData = await response.json();
        setUser(userData); // Initialize Jotai user state with user data
      }
    };

    fetchUser();
  }, [setUser]);
}

export default useInitializeUser;
