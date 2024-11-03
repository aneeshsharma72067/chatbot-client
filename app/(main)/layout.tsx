"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Loader2,
  MessageSquare,
  Plus,
  Ellipsis,
  Pencil,
  Trash,
  LogOut,
} from "lucide-react";
import { ModeToggle } from "@/components/ui/theme-toggle";
import Link from "next/link";
import { useAtom } from "jotai";
import { chatsAtom, userAtom } from "../../stores/store";
import { Chat } from "../../@types/types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import RenameDialog from "@/components/rename-dialog";
import { useRouter } from "next/navigation";
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
  const [chats, setChats] = useAtom(chatsAtom);
  const [title, setTitle] = useState("New Chat");
  const [isOpen, setIsOpen] = useState(false);
  const [titleLoader, setTitleLoader] = useState(false);
  const [logoutLoader, setLogoutLoader] = useState(false);
  const [, setUser] = useAtom(userAtom);
  const [renameDialog, setRenameDialog] = useState(false);
  const [chatToRename, setChatToRename] = useState("");

  async function getChats() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/chats`, {
      method: "GET",
      credentials: "include", // ensures cookies are sent with request
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const data = await res.json();
      setChats(() => data);
    } else {
      toast({
        variant: "destructive",
        description: "Something went wrong while fetching chats !!",
      });
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
