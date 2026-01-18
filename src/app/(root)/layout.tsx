import { auth } from "@/src/lib/auth";
import { currentUser } from "@/src/modules/authentication/actions";
import ChatSidebar from "@/src/modules/chat/components/chat-sidebar";
import Header from "@/src/modules/chat/components/header";
import { User } from "@/src/types";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const layout = async ({ children }: { children: ReactNode }) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return redirect("/sign-in");
	}

	const user = (await currentUser()) as User;
	return (
		<div className='flex h-screen overflow-hidden'>
			<ChatSidebar user={user} />
			<main className='flex-1 overflow-hidden'>
				<Header />
				{children}
			</main>
		</div>
	);
};

export default layout;
