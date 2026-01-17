"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "@/src/lib/auth-client";
import Image from "next/image";

const SignInPage = () => {
	return (
		<section className='flex flex-col items-center justify-center bg-background min-h-screen px-4 py-16 md:py-32'>
			<div className='flex flex-row items-center justify-center gap-x-2'>
				<h1 className='text-4xl font-extrabold text-foreground italic'>Welcome to</h1>
				<Image src={"/RelayLogo.svg"} alt='Logo of the platform' width={140} height={140} />
			</div>
			<p className='text-base font-semibold'>A Personal AI Orchestration Platform</p>
			<p className='mt-4 text-lg text-muted-foreground font-semibold'>Sign In Below</p>
			<Button
				variant={"default"}
				className='max-w-sm mt-5 px-7 py-7 flex flex-row justify-center items-center cursor-pointer'
				onClick={() => signIn.social({ provider: "github", callbackURL: "/" })}
			>
				<Image src={"/github.svg"} alt='github icon' width={24} height={24} className="invert" />
                <span className="font-bold ml-2">Sign in with GitHub</span>
			</Button>
		</section>
	);
};

export default SignInPage;
