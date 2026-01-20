import { create } from "zustand";

export const useChatStore = create((set, get) => ({
	activeChatId: "",

	setActiveChatId: (chatId: string) => set({ activeChatId: chatId }),
}));
