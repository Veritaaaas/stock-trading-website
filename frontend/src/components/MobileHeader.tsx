'use client'
import { useState } from 'react'
import Image from 'next/image'
import { HiOutlineSearch } from 'react-icons/hi'

export default function MobileHeader() {

    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);

    const handleOpenSearch = () => {
        setShowSearch(true);
    }

    return (
        <div className="md:hidden bg-white p-4 flex justify-between items-center z-10 w-full top-0 fixed">
            <HiOutlineSearch size={30} onClick={handleOpenSearch}/>
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className={`w-full p-2 rounded-lg ${showSearch ? "block" : "hidden"}`}
            />
            <div className="flex  gap-3">
                <Image src="Subtract.svg" alt="Subtract" width={25} height={25} />
                <h1 className="text-xl font-bold text-[#1C1C1C]">GoStock</h1>
            </div>
      </div>
    )
}   