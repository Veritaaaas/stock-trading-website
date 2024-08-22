import Image from "next/image";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";

export default function Home() {
  return (
    <main className="font-sans">
      <LogIn />
    </main>
  );
}