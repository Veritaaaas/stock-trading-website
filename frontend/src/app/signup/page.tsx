'use client'
import Image from "next/image";
import { useState } from "react";
import { auth, db } from "../firebase/config.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function SignUp() {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const Router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // checks if password and confirm password match
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {

      // create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // add user details to firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
      });

      // redirect to default page
      console.log("User created successfully");
      Router.push("/");
    } 
      catch (error) {
        console.error("Error creating user: ", error);
    }
  }

  return (
    <div className="grid grid-cols-[55%_45%] min-h-screen">
      <div className="flex flex-col items-center pt-8">
        <Image src="/Subtract.svg" alt="Subtract" width={45} height={45} />
        <div className="text-center flex flex-col gap-2 mt-7">
          <h1 className="text-3xl font-bold text-[#1C1C1C]">Create your new account</h1>
          <p className="text-sm font-medium text-[#6F6F6F]">Welcome! Please enter your details</p>
        </div>
        <form className="flex flex-col gap-1 mt-7" onSubmit={handleSubmit}>
          <div className="flex gap-16">
            <div className="flex flex-col gap-1">
              <label htmlFor="firstName" className="text-m font-medium text-[#1C1C1C]">First Name</label>
              <input type="text" id="firstName" className="p-2 border border-[#1C1C1C] rounded-md" 
                onChange={(e) => setFirstName(e.target.value)} 
                value={firstName}/>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="lastName" className="text-m font-medium text-[#1C1C1C]">Last Name</label>
              <input type="text" id="lastName" className="p-2 border border-[#1C1C1C] rounded-md" 
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}/>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="text-m font-medium text-[#1C1C1C]">Username</label>
            <input type="text" id="username" className="p-2 border border-[#1C1C1C] rounded-md" 
            onChange={(e) => setUsername(e.target.value)}
            value={username}/>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-m font-medium text-[#1C1C1C]">Email</label>
            <input type="email" id="email" className="p-2 border border-[#1C1C1C] rounded-md" 
            onChange={(e) => setEmail(e.target.value)}
            value={email}/>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-m font-medium text-[#1C1C1C]">Password</label>
            <input type="password" id="password" className="p-2 border border-[#1C1C1C] rounded-md" 
            onChange={(e) => setPassword(e.target.value)}
            value={password}/>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="confirmPassword" className="text-m font-medium text-[#1C1C1C]">Confirm Password</label>
            <input type="password" id="confirmPassword" className="p-2 border border-[#1C1C1C] rounded-md" 
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}/>
          </div>
          <button type="submit" className="bg-[#1C1C1C] text-white font-medium text-lg rounded-xl p-2 mt-4">Create Account</button>
          <p className="text-xs font-medium text-[#6F6F6F] text-center mt-4">By logging in, you agree to follow our <span className="text-[#007AFF]">terms and service</span></p>
        </form>
      </div>
      <div className="bg-[url('/black_chart.svg')] bg-cover bg-center h-full rounded-tl-bl" />
    </div>
  );
}