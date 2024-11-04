"use client";

import { useAtom } from "jotai";
import { userAtom } from "../stores/store";
import { useEffect } from "react";

function useInitializeUser() {
  const [, setUser] = useAtom(userAtom);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      console.log("fetchUser in useInitializeUser called, token = ", token);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FLASK_API_URL}/auth-check`,
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
        console.log(userData);

        console.log("user is logged in");
        setUser(userData); // Initialize Jotai user state with user data
      } else {
        console.log("user is not logged in");
      }
    };

    fetchUser();
  }, [setUser]);
}

export default useInitializeUser;
