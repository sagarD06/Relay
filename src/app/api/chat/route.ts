import { prisma } from "@/src/lib/db";
import { CHAT_SYSTEM_PROMPT } from "@/src/lib/prompt";
import { Messages } from "@/src/types";
import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { MessageRole, MessageType } from "@prisma/client";
import { convertToModelMessages, streamText, UIMessage } from "ai";

const provider = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

function convertStoredMessageToUI(msg:Messages) {
    try {
        const parts = JSON.parse(msg.content);
        const validParts = parts.filter((part: { type: string; }) => part.type === "text");

        if (validParts.length === 0) return null;

        return {
            id: msg.id,
            role: msg.messageRole.toLowerCase(),
            parts: validParts,
            createdAt: msg.createdAt,
        };
    } catch (e) {
        return {
            id: msg.id,
            role: msg.messageRole.toLowerCase(),
            parts: [{ type: "text", text: msg.content }],
            createdAt: msg.createdAt,
        };
    }
}

function extractPartsAsJSON(message:UIMessage & Messages) {
    if (message.parts && Array.isArray(message.parts)) {
        return JSON.stringify(message.parts);
    }

    const content = message.content || "";
    return JSON.stringify([{ type: "text", text: content }]);
}

export async function POST(req:Request) {
    try {
        const {
            chatId,
            messages: newMessages,
            model,
            skipUserMessage,
        } = await req.json();

        const previousMessages = chatId
            ? await prisma.message.findMany({
                where: { chatId },
                orderBy: {
                    createdAt: "asc",
                },
            })
            : [];

        const uiMessages = previousMessages
            .map(convertStoredMessageToUI)
            .filter((msg) => msg !== null);

        const normalizedNewMessages = Array.isArray(newMessages)
            ? newMessages
            : [newMessages];

        const allUIMessages = [...uiMessages, ...normalizedNewMessages];

        let modelMessages;

        try {
            modelMessages = await convertToModelMessages(allUIMessages);
        } catch (conversionError) {
            modelMessages = allUIMessages
                .map((msg:UIMessage) => ({
                    role: msg.role,
                    content: msg.parts
                        .filter((p) => p.type === "text")
                        .map((p) => p.text)
                        .join("\n"),
                }))
                .filter((m) => m.content);
        }

        const result = streamText({
            model: provider.chat(model),
            messages: modelMessages,
            system: CHAT_SYSTEM_PROMPT,
        });

        return result.toUIMessageStreamResponse({
            sendReasoning: true,
            originalMessages: allUIMessages,
            onFinish: async ({ responseMessage }) => {
                try {
                    const messagesToSave = [];

                    if (!skipUserMessage) {
                        const latestUserMessage =
                            normalizedNewMessages[normalizedNewMessages.length - 1];

                        if (latestUserMessage?.role === "user") {
                            const userPartsJSON = extractPartsAsJSON(latestUserMessage);

                            messagesToSave.push({
                                chatId,
                                content: userPartsJSON,
                                messageRole: MessageRole.USER,
                                model,
                                messageType: MessageType.NORMAL,
                            });
                        }
                    }

                    if (responseMessage?.parts && responseMessage.parts.length > 0) {
                        const assistantPartsJSON = extractPartsAsJSON(responseMessage);

                        messagesToSave.push({
                            chatId,
                            content: assistantPartsJSON,
                            messageRole: MessageRole.ASSISTANT,
                            model,
                            messageType: MessageType.NORMAL,
                        });
                    }

                    if (messagesToSave.length > 0) {
                        await prisma.message.createMany({
                            data: messagesToSave,
                        });
                    }
                } catch (error) {
                    console.error("❌ Error saving messages:", error);
                }
            },
        });
    } catch (error) {
        console.error("❌ API Route Error:", error);
        return new Response(
            JSON.stringify({
                error: error instanceof Error ? error.message : "Internal server error",
                details: error instanceof Error && error.toString(),
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}