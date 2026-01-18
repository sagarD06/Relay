import { ModeToggle } from "@/src/components/ui/mode-toggle"

const Header = () => {

    return (
        <div className="flex flex-row h-14 w-full justify-end items-center border-b border-border bg-sidebar px-4 py-2">
            <ModeToggle />
        </div>
    )
}

export default Header