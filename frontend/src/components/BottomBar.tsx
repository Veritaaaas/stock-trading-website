import { RiHome6Line } from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";
import { IoWalletOutline } from "react-icons/io5";
import { FaRegBookmark } from "react-icons/fa6";
import { HiOutlineNewspaper } from "react-icons/hi2";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomBar() {
  const pathname = usePathname();

  const icons = [
    { name: "home", icon: <RiHome6Line size={25} />, link: "/" },
    { name: "portfolio", icon: <RxDashboard size={25} />, link: "/portfolio" },
    { name: "wallet", icon: <IoWalletOutline size={25} />, link: "/wallet" },
    { name: "watchlist", icon: <FaRegBookmark size={25} />, link: "/watchlist" },
    { name: "news", icon: <HiOutlineNewspaper size={25} />, link: "/news" },
  ];

  return (
    <div className="md:hidden bg-white bottom-0 fixed p-4 flex justify-between items-center z-10 w-full">
      {icons.map((item, index) => (
        <Link key={index} href={item.link}>
          <div
            className={`flex items-center rounded-full p-3 ${
              pathname === item.link ? "bg-black text-white" : ""
            }`}
          >
            {item.icon}
          </div>
        </Link>
      ))}
    </div>
  );
}