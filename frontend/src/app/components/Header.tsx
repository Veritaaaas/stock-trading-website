import Image from "next/image";
import { VscBell } from "react-icons/vsc";

export default function Header() {
    return (
        <header className="bg-white px-6 py-4 flex justify-between">
            <div className="bg-[#F5F7F9] w-fit p-3 flex gap-2 rounded-xl">
                <Image src="/icons/search.svg" alt="search" width={20} height={20} />
                <input type="text" placeholder="Search for various stocks" className="bg-[#F5F7F9] border-none outline-none ml-2 w-[340px]" />
            </div>
            <div className="flex gap-4 items-center pr-16">
                <VscBell size={25} />
                <h1 className="pl-4 border-l-2 border-black text-lg font-bold">Your Username</h1>
            </div>
        </header>
    );
}
