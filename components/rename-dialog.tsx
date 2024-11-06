import { chatsAtom } from "@/stores/store";
import { useAtom } from "jotai";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { Loader2, Plus } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

type Props = {
  chat_id: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function RenameDialog({ chat_id, isOpen, setIsOpen }: Props) {
  const [titleLoader, setTitleLoader] = useState(false);
  const [, setChats] = useAtom(chatsAtom);
  const [title, setTitle] = useState("");

  async function onRename(chat_id: string) {
    setTitleLoader(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DEV_SERVER_URL}/chats/${chat_id}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: title }),
      }
    );

    if (res.ok) {
      setChats((storedChats) =>
        storedChats.map((c) => {
          if (c.id === chat_id) {
            return { ...c, title: title };
          }
          return c;
        })
      );
      toast({
        description: "Chat renamed",
      });
    } else {
      toast({
        variant: "destructive",
        description: "Chat renamed",
      });
    }
    setTitleLoader(false);
    setIsOpen(false);
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
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
                  onRename(chat_id);
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
              onClick={() => onRename(chat_id)}
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
  );
}
