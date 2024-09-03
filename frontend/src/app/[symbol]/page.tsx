'use client'
import fetchStockData from "@/functions/fetchStockData";
import fetchTimeSeries from "@/functions/fetchTimeSeries";
import StockChart from "@/components/StockChart";

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function SearchResult() {

    const api_key = process.env.NEXT_PUBLIC_LOGO_API_KEY
    const symbol = usePathname().replace("/", "");
    
    const [data , setData] = useState(null);
    const [timeSeries, setTimeSeries] = useState([]);
    const [timeFrame, setTimeFrame] = useState('1day');

    useEffect(() => {
        fetchStockData(symbol).then((data) => {
            setData(data);
        });
    }, [symbol]);

    useEffect(() => {
        fetchTimeSeries(symbol, timeFrame).then((data) => {
            setTimeSeries(data);
            console.log(data);
        });
    }, [timeFrame]);

    const handleChange = (
        event: React.MouseEvent<HTMLElement>, 
        newTimeFrame: string, 
    ) => {
        setTimeFrame(newTimeFrame);
    };

  return (
    <div className="p-6">
        <div className="flex justify-between">
            <div className="flex gap-4">
                <Image src="icons/arrow.svg" alt="arrow" width={45} height={45} />
                <Image
                    src={`https://img.logo.dev/ticker/${String(symbol)}?token=${String(api_key)}`}
                    alt="Logo"
                    className="rounded-full"
                    width={60}
                    height={60}
                />
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
                <button className="bg-[#0DD66A] text-white flex justify-center items-center px-6 gap-2 h-10 rounded-md">
                    <span className="font-sans font-extrabold">Buy</span>
                </button>
            </div>
        </div>
        <div className="bg-white rounded-lg p-2 mt-6">
            <table className="w-full table-auto font-sans">
                <thead>
                <tr className="min-w-full text-bold text-xl">
                    <th className="px-4 py-2">Current Volume</th>
                    <th className="px-4 py-2">Day's High</th>
                    <th className="px-4 py-2">Day's Low</th>
                    <th className="px-4 py-2">Previous Close</th>
                    <th className="px-4 py-2">Change Percent</th>
                </tr>
                </thead>
                <tbody>
                <tr className="min-w-full text-center font-medium text-lg">
                    <td className="px-4 py-2">{data && data[0]?.volume}</td>
                    <td className="px-4 py-2">${data && data[0]?.dayHigh}</td>
                    <td className="px-4 py-2">${data && data[0]?.dayLow}</td>
                    <td className="px-4 py-2">${data && data[0]?.previousClose}</td>
                    <td className="px-4 py-2">{data && data[0]?.changesPercentage}</td>
                </tr>
                </tbody>
            </table>
        </div>
        <div className="mt-4">
            <ToggleButtonGroup
                value={timeFrame}
                exclusive
                onChange={handleChange}
                aria-label="Platform"
                sx={{ 
                    backgroundColor: '#FFFFFF', 
                    borderRadius: '12px',
                    marginTop: '10px',
                    '& .MuiToggleButton-root': {  
                        fontSize: '12px',
                        fontFamily: 'sans-serif',
                        fontWeight: 'bold', 
                        '&.Mui-selected': {
                            backgroundColor: 'black',
                            color: 'white',
                        },
                        '&:hover': {
                            backgroundColor: '#d9d9d9',
                        },
                    },
                }}
            >
                <ToggleButton value="1day">Daily</ToggleButton>
                <ToggleButton value="1week">Weekly</ToggleButton>
                <ToggleButton value="1month">Monthly</ToggleButton>
            </ToggleButtonGroup>
                
            <div className="mt-6 w-full bg-white py-6 px-2 rounded-lg h-[250px]">
                <StockChart data={timeSeries} timeFrame={timeFrame} />
            </div>
        </div>
    </div>
  );
}
