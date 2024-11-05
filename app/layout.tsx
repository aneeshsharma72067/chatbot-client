"use client";

import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import useInitializeUser from "@/hooks/useInitializeUser";
import { useAtom } from "jotai";
import { userAtom } from "@/stores/store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [user] = useAtom(userAtom);
  useInitializeUser();
  useEffect(() => {
    if (user) {
      router.push("/");
    } else {
      router.push("/login");
    }
  }, [user]);
  return (
    <html lang="en">
      <head>
        <title>AI Powered Chat Assistant</title>
      </head>
      <body className={inter.className}>
        <Toaster />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
