"use client";
import { User } from "@/src/types";
import React, { useState } from "react";
import ChatMessageTabs from "./chat-message-tabs";
import ChatMessageForm from "./chat-message-form";

type ChatMessageViewProps = {
	user: User;
};
const ChatMessageView: React.FC<ChatMessageViewProps> = ({ user }) => {
	const [selectedMessage, setSelectedMessage] = useState("");

	const handleSelectedMessage = (message: string) => {
		setSelectedMessage(message);
	};

	const handledMessageChange = (message: string) => {
		setSelectedMessage(message);
	};

	return (
		<div className='flex flex-col items-center justify-center h-screen space-y10'>
			<ChatMessageTabs username={user?.name} handleMessageSelect={handleSelectedMessage} />
			<ChatMessageForm
				initialMessage={selectedMessage}
				onMessageChange={handledMessageChange}
			/>
		</div>
	);
};

export default ChatMessageView;
