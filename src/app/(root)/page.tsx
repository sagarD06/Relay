import { currentUser } from "@/src/modules/authentication/actions";
import ChatMessageView from "@/src/modules/chat/components/chat-message-view";
import { User } from "@/src/types";

export default async function Home() {
	const user = await currentUser() as User;

	return (
		<ChatMessageView user={user} />
	);
}
