"use server";
import { prisma } from "@/src/lib/db";
import { currentUser } from "../../authentication/actions";
import { MessageRole, MessageType } from "@prisma/client";
import { revalidatePath } from "next/cache";

//Action to initialize new chat with first message
export const createChatWithMessage = async (values: { content: string; model: string }) => {
	try {
		const user = await currentUser();
		if (!user) {
			return {
				success: false,
				message: "Unauthorized user!",
			};
		}
		const { content, model } = values;
		if (!content || content.length === 0) {
			return {
				success: false,
				message: "Message content is required",
			};
		}
		const title = content.slice(0, 50) + (content.length > 50 ? "..." : "");
		const chat = await prisma.chat.create({
			data: {
				title,
				model,
				userId: user.id,
				messages: {
					create: {
						content,
						messageRole: MessageRole.USER,
						messageType: MessageType.NORMAL,
						model,
					},
				},
			},
			include: {
				messages: true,
			},
		});

		revalidatePath("/");

		return {
			success: true,
			mnessage: "Chat initailized successfully",
			data: chat,
		};
	} catch (error) {
		console.error(error);
		return {
			success: true,
			message: "Something went wrong while creating chat with message.",
		};
	}
};

//Action to fetch all chats for the user
export const getAllChatsForUser = async () => {
	try {
		const user = await currentUser();
		if (!user) {
			return {
				success: false,
				message: "Unauthorized user!",
			};
		}

		const chats = await prisma.chat.findMany({
			where: {
				userId: user?.id,
			},
			include: {
				messages: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return {
			success: true,
			data: chats,
			message: "Chats fetched successfully",
		};
	} catch (error) {
		console.error(error);
		return {
			success: true,
			message: "Something went wrong while fetching chats.",
		};
	}
};

export const deleteChat = async (chatId: string) => {
	try {
		const user = await currentUser();
		if (!user) {
			return {
				success: false,
				message: "Unauthorized user!",
			};
		}
		const chat = await prisma.chat.findUnique({
			where: { id: chatId, userId: user.id },
		});

		if (!chat) {
			return {
				success: false,
				message: "No chat found!",
			};
		}
		await prisma.chat.delete({
			where: { id: chatId },
		});

		revalidatePath("/");
		return {
			success: true,
			message: "Chat deleted successfully",
		};
	} catch (error) {
		console.error(error);
		return {
			success: true,
			message: "Something went wrong while fetching chats.",
		};
	}
};
