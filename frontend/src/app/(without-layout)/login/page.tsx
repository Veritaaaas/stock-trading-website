'use client'
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/firebase/config.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Input } from "@/components/ui/input";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const Router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in successfully");
      Router.push("/");
    } catch (error) {
      console.error("Error signing in: ", error);
      setError("Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:grid md:grid-cols-[55%_45%] min-h-screen font-sans flex justify-center">
      <div className="flex flex-col items-center pt-10 md:pt-20 px-4 md:px-0">
        <Image src="Subtract.svg" alt="Subtract" width={45} height={45} />
        <div className="text-center flex flex-col gap-2 mt-7">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1C1C1C]">Sign in to your account</h1>
          <p className="text-sm font-medium text-[#6F6F6F]">Welcome Back! Please enter your details</p>
        </div>
        <form className="flex flex-col gap-1 mt-7 w-full max-w-xs md:w-64" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="Email" className="text-m font-medium text-[#1C1C1C]">Email</label>
            <Input
              type="email"
              id="Email"
              className="border-[#1C1C1C]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-required="true"
              aria-invalid={!!error}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="Password" className="text-m font-medium text-[#1C1C1C]">Password</label>
            <Input
              type="password"
              id="Password"
              className="border-[#1C1C1C]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-required="true"
              aria-invalid={!!error}
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <button
            type="submit"
            className="bg-[#1C1C1C] text-white font-medium text-lg rounded-xl p-2 mt-4"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
          <p className="text-xs font-medium text-[#6F6F6F] text-center mt-4">
            Doesn&apos;t have an account yet? <Link href="/signup"><span className="text-[#007AFF] cursor-pointer">Sign Up</span></Link>
          </p>
        </form>
      </div>
      <div className="bg-[url('/black_chart.svg')] bg-cover bg-center h-full rounded-tl-bl hidden md:block" />
    </div>
  );
}