import { currentUser } from "@/src/modules/authentication/actions";
import UserButton from "@/src/modules/authentication/components/user-button";
import ChatMessageView from "@/src/modules/chat/components/chat-message-view";
import { User } from "@/src/types";

export default async function Home() {
	const user = await currentUser() as User;

	return (
		<ChatMessageView user={user} />
	);
}
