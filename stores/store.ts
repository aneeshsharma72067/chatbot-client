"use client";

import { atom } from "jotai";
import { Chat, Message, User } from "../@types/types";

export const userAtom = atom<User | null>(null);

export const chatsAtom = atom<Chat[]>([]);

export const messagesAtom = atom<Message[]>([]);
