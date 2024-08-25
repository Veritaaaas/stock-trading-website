'use client'
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/config.js";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useEffect } from "react";
import  Header  from "./components/Header.tsx";
import Sidebar from "./components/Sidebar.tsx";

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();


  // Redirect to login page if user is not logged in
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

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

  return (
    <main className="font-sans bg-[#F5F7F9] h-screen flex gap-2">
      <div className="w-[300px]">
        <Sidebar/>
      </div>
      <div className="flex-grow">
        <Header />
      </div>
    </main>
  );
}