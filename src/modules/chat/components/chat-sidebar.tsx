"use client";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { EllipsisIcon, PlusIcon, SearchIcon, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import UserButton from "../../authentication/components/user-button";
import { ChatwithMessages, User } from "@/src/types";
import React, { Fragment, useMemo, useState } from "react";
import { useChatStore } from "../store/chat-store";
import { cn } from "@/src/lib/utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import DeleteChatModal from "../modals/chat-delete-modal";

type ChatSidebarProps = {
	user: User;
	chats: ChatwithMessages[] | undefined;
};

const ChatSidebar: React.FC<ChatSidebarProps> = ({ user, chats }) => {
	const { activeChatId } = useChatStore() as { activeChatId: string | null };
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedChatId, setSelectedChatId] = useState("");
	const [searchQuery, setSearchQuery] = useState("");

	const filteredChats = useMemo(() => {
		if (!searchQuery.trim()) {
			return chats;
		}
		const query = searchQuery.toLowerCase();
		return chats?.filter(
			(chat) =>
				chat.title.toLowerCase().includes(query) ||
				chat.messages.some((message) => message.content.toLowerCase().includes(query))
		);
	}, [chats, searchQuery]);

	// Group chats by date ( today , yesterday , inMonth , inYear);
	const groupedChats = useMemo(() => {
		const now = new Date();
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);
		const lastWeek = new Date(today);
		lastWeek.setDate(lastWeek.getDate() - 7);

		const groups = {
			today: [] as ChatwithMessages[],
			yesterday: [] as ChatwithMessages[],
			lastWeek: [] as ChatwithMessages[],
			older: [] as ChatwithMessages[],
		};

		filteredChats?.forEach((chat) => {
			const chatDate = new Date(chat.createdAt);

			if (chatDate >= today) {
				groups.today.push(chat);
			} else if (chatDate >= yesterday) {
				groups.yesterday.push(chat);
			} else if (chatDate >= lastWeek) {
				groups.lastWeek.push(chat);
			} else {
				groups.older.push(chat);
			}
		});

		return groups;
	}, [filteredChats]);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	const onDelete = (e: React.MouseEvent, chatId: string) => {
		e.preventDefault();
		e.stopPropagation();
		setSelectedChatId(chatId)
		setIsModalOpen(true)
	};

	const renderChats = (chatList: ChatwithMessages[]) => {
		if (chatList.length === 0) {
			return null;
		}
		return chatList.map((chat) => (
			<Fragment key={chat.id}>
				<Link
					href={`/chat/${chat.id}`}
					className={cn(
						"block rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
						chat.id === activeChatId && "bg-sidebar-accent"
					)}
				>
					<div className='flex flex-row items-between justify-center gap-2'>
						<span className='truncated flex-1 line-clamp-1'>{chat.title}</span>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant='ghost'
									size='icon'
									className='h-6 w-6 group-hover:opacity-100 hover:bg-sidebar-accent-foreground/10'
									onClick={(e) => e.preventDefault()}
								>
									<EllipsisIcon className='h-4 w-4' />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='end'>
								<DropdownMenuLabel>Actions</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className='flex flex-row gap-2 cursor-pointer'
									onClick={(e) => onDelete(e, chat.id)}
								>
									<Trash className='h-4 w-4 text-red-500' />
									<span className='text-red-500'>Delete</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</Link>
				<DeleteChatModal
					chatId={chat.id}
					isModalOpen={isModalOpen}
					setIsModalOpen={setIsModalOpen}
				/>
			</Fragment>
		));
	};
	return (
		<div className='flex flex-col h-full w-64 border-r border-border bg-sidebar'>
			<div className='flex justify-between items-center border-r border-sidebar-border px-4 py-3'>
				<div className='flex items-center gap-2'>
					<Image src={"/RelayLogo.svg"} alt='Logo' width={100} height={100} />
				</div>
			</div>
			<div className='p-4'>
				<Link href={"/"}>
					<Button className='w-full'>
						<PlusIcon className='mr-2 h-4 w-4' />
						New Chat
					</Button>
				</Link>
			</div>

			<div className='px-4 pb-4'>
				<div className='relative'>
					<SearchIcon className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
					<Input
						placeholder='Search your chats...'
						className='pl-9 pr-8 bg-sidebar-accent border-sidebar-b'
						value={searchQuery}
						onChange={handleSearchChange}
					/>
				</div>
			</div>
			<div className='flex-1 overflow-y-auto px-2'>
				{filteredChats?.length === 0 ? (
					<div className='text-center text-sm text-muted-foreground py-8'>
						{searchQuery ? "No Chats Found" : "No Chats Yet"}
					</div>
				) : (
					<>
						{groupedChats.today.length > 0 && (
							<div className='mb-4'>
								<div className='mb-2 px-2 text-xs font-semibold text-muted-foreground'>
									Today
								</div>
								{renderChats(groupedChats.today)}
							</div>
						)}
						{groupedChats.yesterday.length > 0 && (
							<div className='mb-4'>
								<div className='mb-2 px-2 text-xs font-semibold text-muted-foreground'>
									Yesterday
								</div>
								{renderChats(groupedChats.yesterday)}
							</div>
						)}
						{groupedChats.lastWeek.length > 0 && (
							<div className='mb-4'>
								<div className='mb-2 px-2 text-xs font-semibold text-muted-foreground'>
									Last 7 days
								</div>
								{renderChats(groupedChats.lastWeek)}
							</div>
						)}
						{groupedChats.older.length > 0 && (
							<div className='mb-4'>
								<div className='mb-2 px-2 text-xs font-semibold text-muted-foreground'>
									Older
								</div>
								{renderChats(groupedChats.older)}
							</div>
						)}
					</>
				)}
			</div>

			<div className='flex items-center p-3 gap-2 border-t border-sidebar-b'>
				<UserButton user={user} />
				<span className='flex-1 text-sm text-sidebar-primary truncate'>{user.email}</span>
			</div>
		</div>
	);
};

export default ChatSidebar;
