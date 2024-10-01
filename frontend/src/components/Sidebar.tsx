'use client'
import Image from "next/image";
import { EyeOpenIcon, EyeClosedIcon, DashboardIcon, BookmarkIcon, HomeIcon, ClockIcon } from '@radix-ui/react-icons';
import { usePathname } from "next/navigation";
import { useUser } from "./UserProvider";
import { useState } from "react";
import Link from "next/link";

export default function Sidebar() {

    const pathname = usePathname();
    const { userData } = useUser() || {};
    const [cashVisible, setCashVisible] = useState(true);

    const sidebarItems = [
        {
            name: "Home",
            icon: <HomeIcon width={24} height={24} />, 
            path: "/"
        },
        {
            name: "Portfolio",
            icon: <DashboardIcon width={24} height={24} />, 
            path: "/portfolio"
        },
        {
            name: "History",
            icon: <ClockIcon width={24} height={24} />, 
            path: "/history"
        },
        {
            name: "Bookmark",
            icon: <BookmarkIcon width={24} height={24} />, 
            path: "/bookmark"
        },
    ];

    const handleCashVisibility = () => {
        setCashVisible(!cashVisible);
    }

    return (
        <div className="bg-white w-full min-h-screen p-8 hidden flex-col gap-8 font-sans h-full md:flex">
            <div className="flex justify-center gap-3">
                <Image src="/Subtract.svg" alt="Subtract" width={35} height={35} /> 
                <h1 className="text-2xl font-bold text-[#1C1C1C]">GoStock</h1>
            </div>
            <div className="bg-[#1c1c1c] rounded-xl p-4 flex flex-col gap-2">
                <h1 className="text-lg text-white">Buying Power</h1>
                <div className="flex gap-2 items-center">
                    <h1 className="text-xl text-white font-bold">
                        {cashVisible ? `$${userData?.cash.toFixed(2) ?? 0}` : '••••••'}
                    </h1>
                    <button onClick={handleCashVisibility}>
                        {cashVisible ? <EyeOpenIcon className="text-white" /> : <EyeClosedIcon className="text-white" />}
                    </button>
                </div>
            </div>
            <div className="flex flex-col text-[20px] font-bold gap-5">
                {sidebarItems.map((item, index) => (
                    <Link href={item.path} key={index}>
                        <div key={index} className={`flex gap-3 items-center px-2 text-xl cursor-pointer hover:bg-[#d9d9d9] rounded-lg ${pathname === item.path ? "bg-[#1c1c1c] text-white" : ""}`}>
                            {item.icon}
                            <h1>{item.name}</h1>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}