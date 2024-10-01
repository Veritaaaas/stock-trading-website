'use client';
import { ExitIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import fetchStockList from "../functions/fetchStockList";
import { auth } from "@/firebase/config"; 
import { useUser } from "./UserProvider";

interface UserData {
  uid: string;
  username: string;
  cash: number;
  firstName: string;
  lastName: string;
}

export default function Header() {
  const [search, setSearch] = useState("");
  const { userData } = useUser() as { userData: UserData };
  const [stockList, setStockList] = useState<string[]>([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchStockList().then((data) => {
      setStockList(data);
    });
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredStocks([]);
      setShowDropdown(false);
    } else {
      const filtered = stockList.filter(stock =>
        stock.toLowerCase().startsWith(search.toLowerCase())
      );
      setFilteredStocks(filtered as never[]);
      setShowDropdown(true);
    }
  }, [search, stockList]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !(dropdownRef.current as HTMLElement).contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleSelectStock = (stock : string) => {
    setSearch(stock);
    setShowDropdown(false);
  };

  const handleSearch = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search.trim() !== "") {
      router.push(`/${search}`);
    }
  }

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push("/login"); // Redirect to login page after sign out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="bg-white px-6 py-4 justify-between hidden md:flex">
      <div className="relative">
        <form onSubmit={handleSearch} className="bg-[#F5F7F9] w-fit p-3 flex items-center gap-2 rounded-xl">
          <MagnifyingGlassIcon className="w-6 h-6" />
          <input
            type="text"
            placeholder="Search for stocks"
            className="bg-[#F5F7F9] border-none outline-none lg:w-64 active:border-none"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          />
        </form>
        {showDropdown && filteredStocks.length > 0 && (
          <ul ref={dropdownRef} className="absolute bg-white border border-gray-300 rounded-md mt-2 w-[340px] z-10 max-h-60 overflow-y-auto">
            {filteredStocks.map((stock, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectStock(stock)}
              >
                {stock}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex gap-4 items-center lg:pr-16">
        <ExitIcon className="w-6 h-6 cursor-pointer" onClick={handleSignOut} />
        <h1 className="pl-4 border-l-2 border-black text-lg font-bold cursor-pointer">{userData?.username}</h1>
      </div>
    </header>
  );
}