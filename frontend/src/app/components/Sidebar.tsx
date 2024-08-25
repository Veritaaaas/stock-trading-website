import Image from "next/image";
import { FaEye } from "react-icons/fa";
import { RiHome6Line } from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";
import { IoWalletOutline } from "react-icons/io5";
import { FaRegBookmark } from "react-icons/fa6";
import { HiOutlineNewspaper } from "react-icons/hi2";

export default function Sidebar() {
    return (
        <div className="bg-white w-full h-screen p-8 flex flex-col gap-8">
            <div className="flex justify-center gap-3">
                <Image src="Subtract.svg" alt="Subtract" width={35} height={35} />
                <h1 className="text-2xl font-bold text-[#1C1C1C]">GoStock</h1>
            </div>
            <div className="bg-[#1c1c1c] rounded-xl p-4 flex flex-col gap-2">
                <h1 className="text-lg text-white">Buying Power</h1>
                <div className="flex gap-2 items-center">
                    <h1 className="text-xl text-white font-bold">$0.00</h1>
                    <FaEye className="text-white" />
                </div>
            </div>
            <div className="flex flex-col text-[20px] font-bold gap-5">
                <div className="flex gap-3 items-center">
                    <RiHome6Line />
                    <h1>Home</h1>
                </div>
                <div className="flex gap-3 items-center">
                    <RxDashboard />
                    <h1>Dashboard</h1>
                </div>
                <div className="flex gap-3 items-center">
                    <IoWalletOutline />
                    <h1>Wallet</h1>
                </div>
                <div className="flex gap-3 items-center">
                    <FaRegBookmark />
                    <h1>Watchlist</h1>
                </div>
                <div className="flex gap-3 items-center">
                    <HiOutlineNewspaper />
                    <h1>News</h1>
                </div>
            </div>
        </div>
    );
}