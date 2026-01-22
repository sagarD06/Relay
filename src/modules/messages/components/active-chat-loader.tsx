"use client"
import { useEffect } from "react";
import { useGetChatById } from "../../chat/hooks/chat";
import { useChatStore } from "../../chat/store/chat-store";

const ActiveChatLoader = ({ chatId }: { chatId: string }) => {
    const { setActiveChatId, addChat, setMessages, chats } = useChatStore();

    const { data } = useGetChatById(chatId)

    useEffect(() => {
        if (!chatId) return;
        setActiveChatId(chatId)
    }, [chatId, setActiveChatId])

    useEffect(() => {
        if (!data || !data.success) return;
        const chat = data.data
        setMessages(chat?.messages || []);

        if (!chats.some(c => c.id === chat?.id)) {
            addChat(chat!)
        }

    }, [data, setMessages, addChat, chats])


    return null;
};

export default ActiveChatLoader;