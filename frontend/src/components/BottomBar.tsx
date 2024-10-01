'use client'
import { DashboardIcon, BookmarkIcon, HomeIcon, ClockIcon, ExitIcon } from '@radix-ui/react-icons';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/firebase/config"; 

export default function BottomBar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push('/login'); // Redirect to login page after sign out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const icons = [
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
    {
      name: "Logout",
      icon: <ExitIcon width={24} height={24} />,
      path: "/logout",
      onClick: handleSignOut 
    }
  ];

  return (
    <div className="md:hidden bg-white bottom-0 fixed p-4 flex justify-between items-center z-10 w-full">
      {icons.map((item, index) => (
        <Link key={index} href={item.path} onClick={item.onClick}>
          <div
            className={`flex items-center rounded-full p-3 ${
              pathname === item.path ? "bg-black text-white" : ""
            }`}
          >
            {item.icon}
          </div>
        </Link>
      ))}
    </div>
  );
}