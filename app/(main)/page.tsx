"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Search, Send, Sparkle } from "lucide-react";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useAtom } from "jotai";
import { chatsAtom } from "@/stores/store";
import { Chat } from "@/@types/types";
import { Label } from "@/components/ui/label";
const Page = () => {
  const [title, setTitle] = useState("New Chat");
  const [isOpen, setIsOpen] = useState(false);
  const [isFactOpen, setIsFactOpen] = useState(false);
  const [titleLoader, setTitleLoader] = useState(false);
  const [, setChats] = useAtom(chatsAtom);
  const [fact, setFact] = useState("");
  const [factLoading, setFactLoading] = useState(false);

  async function onSubmit() {
    if (!title) {
      toast({
        variant: "destructive",
        description: "Title can't be empty !",
      });
      return;
    }
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
        description: data.error,
      });
    }
    setTitleLoader(false);
    setIsOpen(false);
  }

  async function generateNewFact() {
    setFactLoading(true);
    try {
      const res = await fetch("https://api.api-ninjas.com/v1/facts", {
        headers: {
          "X-Api-Key": `${process.env.NEXT_PUBLIC_FACT_API_KEY}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setFact(data[0].fact);
        setIsFactOpen(true);
      } else {
        console.log(data);
      }
      setFactLoading(false);
    } catch (e) {
      console.log(e);
      setFactLoading(false);
      toast({
        description: "Something Went Wrong !",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="h-full flex flex-col items-center pt-32 gap-10 pr-6">
      <h1 className="text-center text-5xl font-bold">
        <span className="text-primary">AI</span> Powered Chat Assistant
      </h1>
      <div className="w-4/5 sm:w-2/3 text-center">
        Your personal AI assistant is here and ready to help you with whatever
        you need. Whether it&apos;s answering questions, learning something new,
        or simply having a chat, just type in what’s on your mind.
      </div>
      <div className="w-2/3 sm:w-1/2 flex gap-4 items-center justify-center">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full py-6 rounded-full">
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
        <Dialog open={isFactOpen} onOpenChange={setIsFactOpen}>
          <DialogContent className="p-10 border-green-500">
            <DialogHeader>
              <DialogTitle className="text-2xl">Did you know ?</DialogTitle>
            </DialogHeader>
            {fact && (
              <div className="mt-4">
                <p className="text-gray-600 dark:text-gray-300">{fact}</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
        <Button
          className="w-full py-6 rounded-full bg-zinc-800"
          variant="outline"
          disabled={factLoading}
          onClick={generateNewFact}
        >
          <Sparkle className="mr-2 h-4 w-4" /> Random Fact
        </Button>
      </div>
    </div>
  );
};

export default Page;
