import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createChatWithMessage, deleteChat, getChatById } from "../actions";
import { toast } from "sonner";

export const useCreateChat = () => {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: (values: { content: string; model: string }) => createChatWithMessage(values),
		onSuccess: (res) => {
			if (res.success && res.data) {
				const chat = res.data;

				queryClient.invalidateQueries({ queryKey: ["chats"] });
				router.push(`/chat/${chat.id}?autoTrigger=true`);
			}
		},
		onError: (error) => {
			console.error("Failed to create chat error: ", error);
			toast.error("Failed to create chat");
		},
	});
};

export const useDeleteChat = (chatId: string) => {
	const queryClient = useQueryClient();
	// const router = useRouter();

	return useMutation({
		mutationFn: () => deleteChat(chatId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["chats"] });
		},
		onError: () => {
			toast.error("Failed to delete the chat");
		},
	});
};

export const useGetChatById = (chatId: string) => {

	return useQuery(
		{
			queryKey: ["chats", chatId],
			queryFn: () => getChatById(chatId)
		}
	)
};
