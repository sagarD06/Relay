import { create } from "zustand";
import { ChatwithMessages, Messages } from "@/src/types";

interface ChatState {
	chats: ChatwithMessages[];
	activeChatId: string;
	messages: Messages[];
	setActiveChatId: (chatId: string) => void;
	setChats: (chats: ChatwithMessages[]) => void;
	setMessages: (messages: Messages[]) => void;
	addChat: (chat: ChatwithMessages) => void;
	addMessage: (message: Messages) => void;
	clearMessage: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
	chats: [],
	activeChatId: "",
	messages: [],
	setActiveChatId: (chatId: string) => set({ activeChatId: chatId }),
	setChats: (chats) => set({ chats }),
	setMessages: (messages) => set({ messages }),
	addChat: (chat: ChatwithMessages) => set({chats:[chat, ...get().chats]}),
	addMessage: (message: Messages) => set({messages:[...get().messages, message]}),
	clearMessage: ()=> set({messages: []})
}));
