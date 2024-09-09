'use client'
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/firebase/config.js";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LogIn() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const Router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {

      // sign in user with email and password
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in successfully");
      Router.push("/");
    
    } catch (error) {
      console.error("Error signing in: ", error);
    }

  }

  return (
    <div className="grid grid-cols-[55%_45%] min-h-screen font-sans">
      <div className="flex flex-col items-center pt-20">
        <Image src="Subtract.svg" alt="Subtract" width={45} height={45} />
        <div className="text-center flex flex-col gap-2 mt-7">
          <h1 className="text-3xl font-bold text-[#1C1C1C]">Sign in to your account</h1>
          <p className="text-sm font-medium text-[#6F6F6F]">Welcome Back! Please enter your details</p>
        </div>
        <form className="flex flex-col gap-1 mt-7" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="Email" className="text-m font-medium text-[#1C1C1C]">Email</label>
            <input type="text" id="Email" className="p-2 border border-[#1C1C1C] rounded-md" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}/>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="Password" className="text-m font-medium text-[#1C1C1C]">Password</label>
            <input type="password" id="Password" className="p-2 border border-[#1C1C1C] rounded-md" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <button type="submit" className="bg-[#1C1C1C] text-white font-medium text-lg rounded-xl p-2 mt-4">Sign In</button>
          <p className="text-xs font-medium text-[#6F6F6F] text-center mt-4">Doesn&apos;t have an account yet? <Link href="/signup"><span className="text-[#007AFF] cursor-pointer">Sign Up</span></Link></p>
        </form>
      </div>
      <div className="bg-[url('/black_chart.svg')] bg-cover bg-center h-full rounded-tl-bl" />
    </div>
  );
}