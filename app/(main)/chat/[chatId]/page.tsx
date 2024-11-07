"use client";

import { Message } from "@/@types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAtom } from "jotai";
import { Loader2, Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { messagesAtom } from "@/stores/store";
import { toast } from "@/hooks/use-toast";
import DOMPurify from "dompurify";
import ReactMarkDown from "react-markdown";

export default function Chat({ params }: { params: { chatId: string } }) {
  const [chatMessages, setChatMessages] = useAtom(messagesAtom);
  const [inputValue, setInputValue] = React.useState("");
  const [messagesAvail, setMessagesAvail] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const [responseLoader, setResponseLoader] = useState(false);

  async function sendMessage() {
    setResponseLoader(true);
    if (inputValue.trim() === "") {
      return;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_FLASK_API_URL}/chats/${params.chatId}/messages`,
      {
        method: "POST",
        credentials: "include", // ensures cookies are sent with request
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content: inputValue }),
      }
    );
    if (res.ok) {
      const { user_message, bot_message } = await res.json();
      setChatMessages((messages) => [...messages, user_message]);
      setInputValue("");
      setTimeout(() => {
        if (bot_message) {
          setChatMessages((messages) => [...messages, bot_message]);
        }
      }, 1000);
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
      }
    }
    setResponseLoader(false);
  }

  async function getMessages() {
    setMessagesAvail(false);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_FLASK_API_URL}/chats/${params.chatId}/messages`,
      {
        method: "GET",
        credentials: "include", // ensures cookies are sent with request
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (res.ok) {
      const data: Message[] = await res.json();
      setChatMessages(() => data);
      setMessagesAvail(true);
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      toast({
        variant: "destructive",
        description: "Something went wrong while fetching chats",
      });
    }
  }
  useEffect(() => {
    getMessages();
  }, []);
  useEffect(() => {
    if (chatMessages.length > 0 && scrollAreaRef.current) {
      scrollAreaRef.current.scrollIntoView({ behavior: "smooth" }); //Use scrollIntoView to automatically scroll to my ref
    }
  }, [chatMessages.length]);
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollIntoView({ behavior: "smooth" }); //Use scrollIntoView to automatically scroll to my ref
    }
  }, [chatMessages]);
  return (
    <>
      {!messagesAvail ? (
        <div className="w-full sm:w-[95%] px-2 sm:p-5 mx-auto flex flex-col gap-3">
          <div className="w-1/3 h-10 rounded-lg bg-gradient-to-r from-slate-500 to-zinc-600 animate-pulse self-end"></div>
          <div className="w-2/5 h-10 rounded-lg bg-gradient-to-r from-slate-500 to-zinc-600 animate-pulse "></div>
          <div className="w-2/5 h-10 rounded-lg bg-gradient-to-r from-slate-500 to-zinc-600 animate-pulse "></div>
          <div className="w-1/3 h-10 rounded-lg bg-gradient-to-r from-slate-500 to-zinc-600 animate-pulse self-end"></div>
          <div className="w-1/3 h-10 rounded-lg bg-gradient-to-r from-slate-500 to-zinc-600 animate-pulse"></div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <ScrollArea className="h-[87vh] w-full sm:w-[95%] mx-auto">
            <div
              className="px-2 py-1 sm:p-5 flex flex-col gap-4"
              ref={scrollAreaRef || null}
              id="chat-container"
              onLoad={() => {}}
            >
              {chatMessages.map((message, index, list) => (
                <div
                  key={message.id}
                  className={`mb-4 ${
                    message.sender === "user" ? "text-right" : "text-left"
                  }`}
                  ref={index + 1 === list.length ? scrollAreaRef : null}
                >
                  <div
                    className={`inline-block p-2 rounded-lg  text-wrap  break-words ${
                      message.sender === "user"
                        ? "bg-blue-500 text-white max-w-[60%] sm:max-w-[50%]"
                        : "bg-gray-200 text-gray-800 max-w-[70%] sm:max-w-[60%] dark:bg-zinc-800 dark:text-white"
                    }`}
                  >
                    <ReactMarkDown>
                      {DOMPurify.sanitize(message.content)}
                    </ReactMarkDown>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="p-4 border-t border-zinc-700 ">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                onKeyUp={(e) => e.key === "Enter" && sendMessage()}
              />
              <Button
                onClick={sendMessage}
                disabled={inputValue === "" || responseLoader}
                className="flex items-center justify-center"
              >
                {responseLoader ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
