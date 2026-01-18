"use client";
import { useTheme } from "next-themes";
import { Button } from "./button";
import { Sunrise, Sunset } from "lucide-react";

const ModeToggle = () => {
	const { theme, setTheme } = useTheme();

	return (
		<Button
			variant={"ghost"}
			size={"icon"}
			onClick={() => setTheme(theme === "light" ? "dark" : "light")}
		>
			{theme === "light" ? <Sunset size={"size-5"} /> : <Sunrise size={"size-5"}/>}
		</Button>
	);
};

export { ModeToggle };
