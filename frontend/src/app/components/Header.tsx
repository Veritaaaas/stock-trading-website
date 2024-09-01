'use client';
import Image from "next/image";
import { VscBell } from "react-icons/vsc";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import fetchStockList from "../functions/fetchStockList";

export default function Header() {
  const [search, setSearch] = useState("");
  const [stockList, setStockList] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

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
      setFilteredStocks(filtered);
      setShowDropdown(true);
    }
  }, [search, stockList]);

  const handleSelectStock = (stock) => {
    setSearch(stock);
    setShowDropdown(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      router.push(`/${search}`);
    }
  }

  return (
    <header className="bg-white px-6 py-4 flex justify-between">
      <div className="relative">
        <form onSubmit={handleSearch} className="bg-[#F5F7F9] w-fit p-3 flex gap-2 rounded-xl">
          <Image src="/icons/search.svg" alt="search" width={20} height={20} />
          <input
            type="text"
            placeholder="Search for various stocks"
            className="bg-[#F5F7F9] border-none outline-none ml-2 w-[340px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        {showDropdown && filteredStocks.length > 0 && (
          <ul className="absolute bg-white border border-gray-300 rounded-md mt-2 w-[340px] z-10 max-h-60 overflow-y-auto">
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
      <div className="flex gap-4 items-center pr-16">
        <VscBell size={25} />
        <h1 className="pl-4 border-l-2 border-black text-lg font-bold">Your Username</h1>
      </div>
    </header>
  );
}