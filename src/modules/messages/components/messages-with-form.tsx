"use client";
import { Fragment, useMemo, useState } from "react";
import { useAiModels } from "../../ai-agent/hooks/ai-agent";
import { useGetChatById } from "../../chat/hooks/chat";
import { useChatStore } from "../../chat/store/chat-store";
import { useChat } from "@ai-sdk/react";
import { Spinner } from "@/src/components/ui/spinner";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/src/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/src/components/ai-elements/message";
import { PromptInput, PromptInputBody, PromptInputButton, PromptInputFooter, PromptInputSubmit, PromptInputTextarea, PromptInputTools } from "@/src/components/ai-elements/prompt-input";
import ModelSelector from "../../chat/components/chat-ai-model-selector";
import { DefaultChatTransport, UIMessage } from "ai";
import { Messages } from "@/src/types";
import { RotateCcwIcon, StopCircleIcon } from "lucide-react";
import { Reasoning, ReasoningContent, ReasoningTrigger } from "@/src/components/ai-elements/reasoning";

const MessagesWithForm = ({ chatId }: { chatId: string }) => {
  const { data: models, isPending: isModelLoading } = useAiModels();
  const { data, isPending } = useGetChatById(chatId)
  const { hasChatBeenTriggered, markChatsAsTriggered } = useChatStore();

  const [selectedModel, setSelectedModel] = useState(data?.data?.model);
  const [input, setInput] = useState("");

  const initialMessages = useMemo(() => {
    if (!data?.data?.messages) {
      return [];
    }

    return data.data.messages
      .filter((message: Messages) => message.content && message.content.trim() !== "" && message.id)
      .map((message: Messages) => {
        try {
          const parts = JSON.parse(message.content);

          return {
            id: message.id,
            role: message.messageRole.toLowerCase() as "user" | "system" | "assistant",
            parts: Array.isArray(parts) ? parts : [{ type: "text", text: message.content }],
            createdAt: message.createdAt
          }
        } catch (error) {
          console.log(error)
          return {
            id: message.id,
            role: message.messageRole.toLowerCase() as "user" | "system" | "assistant",
            parts: [{ type: "text", text: message.content }],
            createdAt: message.createdAt
          }
        }
      })
  }, [data])

  const { stop, messages, status, sendMessage, regenerate } = useChat({ transport: new DefaultChatTransport({ api: "/api/chat" }) })

  if (isPending) {
    return <div className="flex h-full items-center justify-center">
      <Spinner />
    </div>
  }

  const handleSubmit = () => {
    if (!input.trim()) return;
    sendMessage({ text: input }, { body: { model: selectedModel, chatId } })
    setInput("")
  }

  const handleRegenerate = () => {
    regenerate()
  }

  const handleStop = () => {
    stop()
  }

  const messagesToRender = [...initialMessages, ...messages]

  return <div className="max-w-4xl mx-auto p-6 relative size-full h-[calc(100vh-4rem)]">
    <div className="flex flex-col h-full">
      <Conversation className="h-full">
        <ConversationContent>
          {
            initialMessages.length === 0 ?
              (<>
                <div className="felx items-center justify-center h-full text-gray-500">
                  Start a consersation...
                </div>
              </>) :
              (<>
                {initialMessages.map((message: UIMessage) => (
                  <Fragment key={message.id}>
                    {
                      message.parts.map((part, i) => {
                        switch (part.type) {
                          case "text":
                            return (
                              <Message from={message.role as "user" | "system" | "assistant"} key={`${message.id}-${i}`}>
                                <MessageContent>
                                  <MessageResponse>
                                    {part.text}
                                  </MessageResponse>
                                </MessageContent>
                              </Message>
                            )
                          case "reasoning":
                            return (
                              <Reasoning className="max-w-2xl px-4 py-4 border border-muted bg-muted/50 rounded-md" key={`${message.id}-${i}`}>
                                <ReasoningTrigger />
                                <ReasoningContent 
                                className="mt-2 font-light italic text-muted-foreground">
                                  {part.text}
                                </ReasoningContent>
                              </Reasoning>
                            )
                        }
                      })
                    }
                  </Fragment>
                ))}

              </>)
          }
          {
            status === "streaming" && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Spinner />
                <span className="text-sm">AI is thinking</span>
              </div>
            )
          }
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <PromptInput onSubmit={handleSubmit} className="mt-4">
        <PromptInputBody>
          <PromptInputTextarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools className="flex items-center gap-2">
            {isModelLoading ? (<Spinner />) : (<ModelSelector models={models?.models} selectedModelId={selectedModel!} onModelSelect={setSelectedModel} />)}
            {status === "streaming" ? (<PromptInputButton onClick={handleStop}>
              <StopCircleIcon size={16} />
              <span>Stop</span>
            </PromptInputButton>) : (messagesToRender.length > 0 && <PromptInputButton onClick={handleRegenerate}>
              <RotateCcwIcon size={16} />
              <span>Retry</span>
            </PromptInputButton>)}
          </PromptInputTools>
          <PromptInputSubmit status={status} />
        </PromptInputFooter>
      </PromptInput>
    </div>
  </div>
};

export default MessagesWithForm