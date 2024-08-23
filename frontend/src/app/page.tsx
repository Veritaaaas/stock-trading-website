'use client'
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/config.js";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useEffect } from "react";

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
    <main className="font-sans">
      <h2>Index</h2>
      <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">
        Logout
      </button>
    </main>
  );
}