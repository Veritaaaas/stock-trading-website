'use client'
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { RiHome6Line } from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";
import { IoWalletOutline } from "react-icons/io5";
import { FaRegBookmark } from "react-icons/fa6";
import { HiOutlineNewspaper } from "react-icons/hi2";
import { usePathname } from "next/navigation";
import { useUser } from "./UserProvider";
import { useState } from "react";
import Link from "next/link";

export default function Sidebar() {

    const pathname = usePathname();
    const { userData, portfolioData } = useUser() || {};
    const [cashVisible, setCashVisible] = useState(true);

    const sidebarItems = [
        {
            name: "Home",
            icon: <RiHome6Line />,
            path: "/"
        },
        {
            name: "Portfolio",
            icon: <RxDashboard />,
            path: "/portfolio"
        },
        {
            name: "Wallet",
            icon: <IoWalletOutline />,
            path: "/wallet"
        },
        {
            name: "Watchlist",
            icon: <FaRegBookmark />,
            path: "/watchlist"
        },
        {
            name: "News",
            icon: <HiOutlineNewspaper />,
            path: "/news"
        },
    ];

    const handleCashVisibility = () => {
        setCashVisible(!cashVisible);
    }

    return (
        <div className="bg-white w-full min-h-screen p-8 flex flex-col gap-8 font-sans h-[100%]">
            <div className="flex justify-center gap-3">
                <Image src="/Subtract.svg" alt="Subtract" width={35} height={35} /> 
                <h1 className="text-2xl font-bold text-[#1C1C1C]">GoStock</h1>
            </div>
            <div className="bg-[#1c1c1c] rounded-xl p-4 flex flex-col gap-2">
                <h1 className="text-lg text-white">Buying Power</h1>
                <div className="flex gap-2 items-center">
                    <h1 className="text-xl text-white font-bold">
                        {cashVisible ? `$${userData?.cash ?? 0}` : '••••••'}
                    </h1>
                    <button onClick={handleCashVisibility}>
                        {cashVisible ? <FaEye className="text-white" /> : <FaEyeSlash className="text-white" />}
                    </button>
                </div>
            </div>
            <div className="flex flex-col text-[20px] font-bold gap-5">
                {sidebarItems.map((item, index) => (
                    <Link href={item.path} key={index}>
                        <div key={index} className={`flex gap-3 items-center px-2 cursor-pointer hover:bg-[#d9d9d9] rounded-lg ${pathname === item.path ? "bg-[#1c1c1c] text-white" : ""}`}>
                            {item.icon}
                            <h1>{item.name}</h1>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}