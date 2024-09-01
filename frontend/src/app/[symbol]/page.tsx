'use client'
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MobileHeader from "../components/MobileHeader";
import BottomBar from "../components/BottomBar";
import fetchStockData from "../functions/fetchStockData";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Button from '@mui/material/Button';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Stack from '@mui/material/Stack';

export default function SearchResult() {

    const api_key = process.env.NEXT_PUBLIC_LOGO_API_KEY
    const symbol = usePathname().replace("/", "");
    
    const [data , setData] = useState(null);

    useEffect(() => {
        fetchStockData(symbol).then((data) => {
            setData(data);
            console.log(data);
        });
    }, [symbol]);

  return (
    <main className="font-sans md:py-0 bg-[#F5F7F9] h-screen flex md:gap-2 flex-col md:flex-row py-16 ">
        <div className="w-[300px] md:block hidden">
            <Sidebar/>
        </div>
        <div className="flex-grow md:block hidden">
            <Header />
            <div className="p-6">
                <div className="flex justify-between">
                    <div className="flex gap-4">
                        <Image src="icons/arrow.svg" alt="arrow" width={45} height={45} />
                        <img src={`https://img.logo.dev/ticker/${String(symbol)}?token=${String(api_key)}`}
                        className="rounded-full aspect-square h-16"/>
                        <div>
                            {data && (
                                <>
                                    <h1 className="text-3xl font-bold">{data[0]?.name}(${data[0]?.price})</h1>
                                    <p className="text-gray-500">{data[0]?.symbol}</p>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-4 ">
                        <button className="bg-white flex justify-center items-center px-6 gap-2 h-10 rounded-md ">
                            <AddOutlinedIcon />
                            <span className="font-sans font-bold">Watchlist</span>
                        </button>
                        <button className="bg-white flex justify-center items-center px-6 gap-2 h-10 rounded-md ">
                            <span className="font-sans font-bold">Buy</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>
  );
}
