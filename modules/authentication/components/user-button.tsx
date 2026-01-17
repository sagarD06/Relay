import { useState } from "react";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "@/components/ui/badge";
import { CreditCard, LogOut, Settings, UserIcon } from "lucide-react";

type TUserProps = {
	user: any;
	onSettings: () => void;
	onProfile: () => void;
	onBilling: () => void;
	showBadge: boolean;
	badgeText: string;
	badgeVariant: "default";
	size: "md" | "lg" | "sm";
	showEmail: boolean;
	showMemberSince: boolean;
};

const UserButton: React.FC<TUserProps> = ({
	user,
	onSettings,
	onProfile,
	onBilling,
	showBadge = false,
	badgeText = "Pro",
	badgeVariant = "default",
	size = "md",
	showEmail = true,
	showMemberSince = true,
}: TUserProps) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter();

	const SignOut = async () => {
		await signOut({
			fetchOptions: {
				onSuccess: () => router.push("/sign-in"),
			},
		});
	};

	const handleLogout = async () => {
		setIsLoading(true);
		try {
			await SignOut();
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	//to get user initials from namr or email if not logged in then guest user "U"
	const getUserInitials = (name?: string, email?: string) => {
		if (name) {
			return name
				.split(" ")
				.map((splitted_name) => splitted_name[0])
				.join("")
				.toUpperCase()
				.slice(0, 2);
		}

		if (email) {
			return email.slice(0, 2).toUpperCase();
		}

		return "U";
	};

	const formatMemberSince = (date: Date) => {
		return Intl.DateTimeFormat("en-us", {
			month: "long",
			year: "numeric",
		}).format(new Date(date));
	};

	// Avatar sizes
	const avatarSizes = {
		sm: "h-8 w-8",
		md: "h-10 w-10",
		lg: "h-12 w-12",
	};

	// Don't render if no user
	if (!user) {
		return null;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					className={`relative ${avatarSizes[size]} rounded-full p-0 hover:bg-accent`}
					disabled={isLoading}
				>
					<Avatar>
						<AvatarImage src={user.image || ""} alt={user.name || "User Icon"} />
						<AvatarFallback className='bg-primary text-primary-foreground font-medium text-lg'>
							{getUserInitials(user.name, user.email)}
						</AvatarFallback>
					</Avatar>
					{showBadge && (
						<Badge
							variant={badgeVariant}
							className='absolute -bottom-1 -right-1 h-5 px-1 text-xs'
						>
							{badgeText}
						</Badge>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-64' align='end' forceMount>
				<DropdownMenuLabel className='font-normal'>
					<div className='flex flex-col space-y-2'>
						<div className='flex items-center space-x-3'>
							<Avatar>
								<AvatarImage
									src={user.image || ""}
									alt={user.name || "User Icon"}
								/>
								<AvatarFallback className='bg-primary text-primary-foreground font-medium text-lg'>
									{getUserInitials(user.name, user.email)}
								</AvatarFallback>
							</Avatar>
							<div className='flex flex-col space-y-1'>
								<p className='text-sm font-medium leading-none'>
									{user.name || "Guest User"}
								</p>
								{showEmail && user.email && (
									<p className='text-xs leading-none text-muted-foreground'>
										{user.email}
									</p>
								)}
								{showBadge && (
									<Badge variant={badgeVariant} className='w-fit'>
										{badgeText}
									</Badge>
								)}
							</div>
						</div>
						{showMemberSince && (
							<p className='text-xs text-muted-foreground'>
								Member since {formatMemberSince(user.createdAt)}
							</p>
						)}
					</div>
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				{onProfile && (
					<DropdownMenuItem onClick={onProfile} className='cursor-pointer'>
						<UserIcon className='mr-2 h-4 w-4' />
						Profile
					</DropdownMenuItem>
				)}

				{onBilling && (
					<DropdownMenuItem onClick={onBilling} className='cursor-pointer'>
						<CreditCard className='mr-2 h-4 w-4' />
						Billing
					</DropdownMenuItem>
				)}

				{onSettings && (
					<DropdownMenuItem onClick={onSettings} className='cursor-pointer'>
						<Settings className='mr-2 h-4 w-4' />
						Settings
					</DropdownMenuItem>
				)}

				<DropdownMenuSeparator />

				<DropdownMenuItem
					onClick={handleLogout}
					disabled={isLoading}
					className='cursor-pointer text-destructive focus:text-destructive'
				>
					<LogOut className='mr-2 h-4 w-4' />
					{isLoading ? "Logging out..." : "Log out"}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserButton;
