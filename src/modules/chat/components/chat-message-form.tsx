"use client";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { Send } from "lucide-react";
import { KeyboardEvent, useEffect, useState } from "react";

type ChatMessageFormProps = {
	initialMessage: string;
	onMessageChange: (message: string) => void;
};
const ChatMessageForm: React.FC<ChatMessageFormProps> = ({ initialMessage, onMessageChange }) => {
	const [message, setMessage] = useState(initialMessage);

	useEffect(() => {
		if (initialMessage) {
			onMessageChange?.("");
		}
	}, [initialMessage, onMessageChange]);

	const handleSubmit = async (
		e: KeyboardEvent<HTMLTextAreaElement> | React.FormEvent<HTMLFormElement>
	) => {
		try {
			if ("preventDefault" in e) {
				e.preventDefault();
			}
			console.log("Message sent");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='w-full max-w-3xl mx-auto px-4 pb-6'>
			<form onSubmit={handleSubmit}>
				<div className='relative rounded-2xl border-border shadow-sm transition-all'>
					<Textarea
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						placeholder='Type your message here...'
						className='min-h-15 max-h-50 resize-none border-0 bg-transparent px-4 py-3 text-base focus-visible:ring-0 focus-visible:ring-offset-0'
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								handleSubmit(e);
							}
						}}
					/>
					<div className='flex items-center justify-between gap-2 px-3 py-2 border-t'>
						<div className='flex items-center gap-1'>
							<Button variant={"outline"}>Select a model</Button>
						</div>
						<Button
							type='submit'
							size={"sm"}
							disabled={!message.trim()}
							variant={message.trim() ? "default" : "ghost"}
							className='h-8 w-8 rounded-full p-0'
						>
							<Send className='h-4 w-4' />
							<span className='sr-only'>Send the message</span>
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default ChatMessageForm;
