import Image from "next/image";

export default function LogIn() {
  return (
    <div className="grid grid-cols-[55%_45%] min-h-screen">
      <div className="flex flex-col items-center pt-20">
        <Image src="Subtract.svg" alt="Subtract" width={45} height={45} />
        <div className="text-center flex flex-col gap-2 mt-7">
          <h1 className="text-3xl font-bold text-[#1C1C1C]">Sign in to your account</h1>
          <p className="text-sm font-medium text-[#6F6F6F]">Welcome Back! Please enter your details</p>
        </div>
        <form className="flex flex-col gap-1 mt-7">
          <div className="flex flex-col gap-1">
            <label htmlFor="Username/Email" className="text-m font-medium text-[#1C1C1C]">Username/Email</label>
            <input type="text" id="Username/Email" className="p-2 border border-[#1C1C1C] rounded-md" />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="Password" className="text-m font-medium text-[#1C1C1C]">Password</label>
            <input type="password" id="Password" className="p-2 border border-[#1C1C1C] rounded-md" />
          </div>
          <button type="submit" className="bg-[#1C1C1C] text-white font-medium text-lg rounded-xl p-2 mt-4">Sign In</button>
          <p className="text-xs font-medium text-[#6F6F6F] text-center mt-4">By logging in, you agree to follow our <span className="text-[#007AFF]">terms and service</span></p>
        </form>
      </div>
      <div className="bg-[url('/black_chart.svg')] bg-cover bg-center h-full rounded-tl-bl" />
    </div>
  );
}