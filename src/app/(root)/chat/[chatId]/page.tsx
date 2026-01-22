import ActiveChatLoader from "@/src/modules/messages/components/active-chat-loader";
import MessagesWithForm from "@/src/modules/messages/components/messages-with-form";

const ChatPage = async ({ params }: { params: Promise<{ chatId: string }> }) => {
    const { chatId } = await params

    return (
        <div>
            <ActiveChatLoader chatId={chatId} />
            <MessagesWithForm chatId={chatId} />
        </div>
    )
};

export default ChatPage