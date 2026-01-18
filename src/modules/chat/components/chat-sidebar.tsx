import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { PlusIcon, SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import UserButton from "../../authentication/components/user-button";
import { User } from "@/src/types";

type ChatSidebarProps = {
	user: User;
};

const ChatSidebar: React.FC<ChatSidebarProps> = ({ user }) => {
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
					/>
				</div>
			</div>
			<div className='flex-1 overflow-y-auto px-2'>
				<div className='text-center text-sm text-muted-foreground py-8'>No chats Yet</div>
			</div>

			<div className='flex items-center p-3 gap-2 border-t border-sidebar-b'>
				<UserButton user={user} />
				<span className='flex-1 text-sm text-sidebar-primary truncate'>
					{user.email}
				</span>
			</div>
		</div>
	);
};

export default ChatSidebar;
