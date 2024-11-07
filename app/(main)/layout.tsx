"use client";

import React, { useEffect } from "react";
import { useAtom } from "jotai";
import { chatsAtom, userAtom } from "../../stores/store";
import { toast } from "@/hooks/use-toast";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

function getTime(timestamp: string): string[] {
  const datetime = new Date(timestamp);
  const time = datetime.toLocaleTimeString("en-gb", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "UTC",
  });
  const date = datetime.toLocaleDateString("en-gb", {
    dateStyle: "medium",
  });
  return [time.toString(), date.toString()];
}

export default function ChatbotInterface({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [, setChats] = useAtom(chatsAtom);
  const [user] = useAtom(userAtom);
  async function getChats() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/chats`, {
      method: "GET",
      credentials: "include", // ensures cookies are sent with request
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    if (res.ok) {
      setChats(() => data);
    } else {
      if (user) {
        toast({
          variant: "destructive",
          description: "Something went wrong while fetching chats !!",
        });
      }
    }
  }

  useEffect(() => {
    getChats();
  }, []);
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        {/* Sidebar */}
        <AppSidebar />
        {/* Main Chat Area */}
        <SidebarTrigger size="icon" className="py-6" />
        <div className="flex-1 flex flex-col w-full">{children}</div>
      </div>
    </SidebarProvider>
  );
}
