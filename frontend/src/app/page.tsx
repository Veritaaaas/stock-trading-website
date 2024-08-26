'use client'
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/config.js";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useEffect } from "react";
import Header from "./components/Header.tsx";
import Sidebar from "./components/Sidebar.tsx";
import { BiErrorAlt } from "react-icons/bi";
import dynamic from "next/dynamic";

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  // Redirect to login page if user is not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Logout function
  const handleLogout = async () => {
    // sign out user
    try {
      await signOut(auth);
      console.log("User signed out");
      router.push("/login"); 
    } 
    catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const MarketOverviewNoSSR = dynamic(
    () => import('react-ts-tradingview-widgets').then((mod) => mod.MarketOverview),
    {
      ssr: false
    }
  )

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="font-sans bg-[#F5F7F9] h-screen flex gap-2">
      <div className="w-[300px]">
        <Sidebar/>
      </div>
      <div className="flex-grow">
        <Header />
        <div className="px-6">
          <div className="mt-5 flex flex-col gap-3">
            <h1 className="text-xl font-bold">My Portfolio</h1>
            <div className="bg-white h-[110px] flex justify-center items-center ">
              <div className="flex items-center gap-3 text-2xl font-bold text-red-500">
                <BiErrorAlt />
                <h1>You Have No Stock Options Yet</h1>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-[65%_35%] mt-5 h-[400px] gap-6">
            <div className="w-full h-full">
              <h1 className="text-xl font-bold mb-4">Market Overview</h1>
              <MarketOverviewNoSSR
                height={380}
                width={750}
              />
            </div>
            <div className="bg-white p-4 mr-6 rounded-2xl mb-4">
              <h1 className="text-xl font-bold">My Watchlist</h1>
              <div className="flex items-center gap-3 text-2xl font-bold text-red-500 min-h-full justify-center">
                <BiErrorAlt />
                <h1>Empty Watchlist</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}