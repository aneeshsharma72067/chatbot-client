import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { chatsAtom, userAtom } from "@/stores/store";
import { useAtom } from "jotai";
import {
  Ellipsis,
  Loader2,
  LogOut,
  MessageSquare,
  Pencil,
  Plus,
  Trash,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Chat } from "@/@types/types";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { ModeToggle } from "./ui/theme-toggle";
import { toast } from "@/hooks/use-toast";
import RenameDialog from "./rename-dialog";

export function AppSidebar() {
  const [chats, setChats] = useAtom(chatsAtom);
  const [title, setTitle] = useState("New Chat");
  const [isOpen, setIsOpen] = useState(false);
  const [titleLoader, setTitleLoader] = useState(false);
  const [logoutLoader, setLogoutLoader] = useState(false);
  const [, setUser] = useAtom(userAtom);
  const [renameDialog, setRenameDialog] = useState(false);
  const [chatToRename, setChatToRename] = useState("");
  const router = useRouter();

  async function onSubmit() {
    setTitleLoader(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/chats`, {
      method: "POST",
      credentials: "include", // ensures cookies are sent with request
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ title: title }),
    });
    const data = await res.json();
    if (res.ok) {
      const newChat: Chat = data;
      setChats((chats) => [newChat, ...chats]);
    } else {
      toast({
        variant: "destructive",
        description: "Something went wrong while creating chat !!",
      });
    }
    setTitleLoader(false);
    setIsOpen(false);
  }

  async function onLogout() {
    setLogoutLoader(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.ok) {
      setUser(() => null);
      toast({
        description: "Logged out successfully",
      });
    } else {
      toast({
        variant: "destructive",
        description: "Something went wrong !",
      });
    }
    setLogoutLoader(false);
  }

  async function onDelete(chat_id: string) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_FLASK_API_URL}/chats/${chat_id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await res.json();

    if (res.ok) {
      setChats((chats) => chats.filter((chat) => chat.id != chat_id));
      toast({
        description: "Chat deleted successfully",
      });
      router.push("/");
    } else {
      toast({
        variant: "destructive",
        description: "Something went wrong while fetching chats",
      });
    }
  }

  return (
    <Sidebar collapsible="offcanvas">
      <RenameDialog
        chat_id={chatToRename}
        isOpen={renameDialog}
        setIsOpen={setRenameDialog}
      />
      <SidebarHeader>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" /> New Chat
            </Button>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-[425px]"
            aria-describedby={undefined}
          >
            <DialogHeader>
              <DialogTitle>Enter a title</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Title
                </Label>
                <Input
                  id="username"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="col-span-3"
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      onSubmit();
                    }
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  disabled={titleLoader}
                  aria-busy={titleLoader}
                  onClick={onSubmit}
                >
                  {titleLoader ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing
                    </>
                  ) : (
                    "Confirm"
                  )}
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <div>Recent Chats</div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild>
                    <div className="w-full flex items-center py-2">
                      <Link
                        href={`/chat/${item.id}`}
                        className="flex items-center gap-1 w-full"
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="ghost" size="icon">
                            <Ellipsis className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.preventDefault();
                              setChatToRename(item.id);
                              setRenameDialog(true);
                            }}
                          >
                            <Pencil />
                            <span>Rename</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={(e) => {
                              e.preventDefault();
                              onDelete(item.id);
                            }}
                          >
                            <Trash />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <div className="p-5 flex gap-2">
          <ModeToggle />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={onLogout}
                  disabled={logoutLoader}
                >
                  <LogOut />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
