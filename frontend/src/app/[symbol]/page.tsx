'use client'
import fetchStockData from "@/functions/fetchStockData";
import fetchTimeSeries from "@/functions/fetchTimeSeries";
import StockChart from "@/components/StockChart";
import MyAlert from "@/components/Alert";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useUser } from "@/components/UserProvider";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Input } from "@/components/ui/input"
import { db } from "@/firebase/config";
import { collection, getDocs, query, where, addDoc, updateDoc, doc, runTransaction } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"



interface StockData {
    name: string;
    price: number;
    symbol: string;
    volume: number;
    dayHigh: number;
    dayLow: number;
    previousClose: number;
    changesPercentage: number;
}

export default function SearchResult() {

    const api_key = process.env.NEXT_PUBLIC_LOGO_API_KEY
    const symbol = usePathname().replace("/", "");
    const user = useUser();
    
    const [data, setData] = useState<StockData[]>([]);
    const [timeSeries, setTimeSeries] = useState([]);
    const [timeFrame, setTimeFrame] = useState('1day');
    const [numShares, setNumShares] = useState(0);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');


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

    const handleBuy = async () => {

        if (!user) {
            setAlertMessage("Please log in to buy shares");
            setAlertType("error");
            setShowAlert(true);
            return;
        }
    
        if (user?.cash === undefined || user.cash < (data[0]?.price ?? 0) * numShares) {
            setAlertMessage("Insufficient funds");
            setAlertType("error");
            setShowAlert(true);
            return;
        }
    
        const userPortfolioRef = collection(db, 'portfolio');
        const userDocRef = doc(db, 'users', user.uid);
    
        try {
            if (isNaN(numShares) || numShares <= 0) {
                setAlertMessage("Invalid number of shares");
                setAlertType("error");
                setShowAlert(true);
                return;
            }
            if (!data[0]?.symbol || !data[0]?.price) {
                setAlertMessage("Invalid stock data");
                setAlertType("error");
                setShowAlert(true);
                return;
            }
    
            const q = query(userPortfolioRef, where('uid', '==', user.uid), where('symbol', '==', data[0].symbol));
            const querySnapshot = await getDocs(q);
    
            await runTransaction(db, async (transaction) => {
                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    const docRef = userDoc.ref;
                    transaction.update(docRef, {
                        shares: userDoc.data().shares + numShares,
                    });
                } else {
                    const newDocRef = doc(userPortfolioRef);
                    transaction.set(newDocRef, {
                        uid: user.uid,
                        symbol: data[0].symbol,
                        shares: numShares,
                    });
                }
    
                transaction.update(userDocRef, {
                    cash: user.cash - data[0].price * numShares,
                });
            });
    
            setAlertMessage("Successfully bought shares");
            setAlertType("success");
            setShowAlert(true);
    
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error("Firebase Error:", error);
                setAlertMessage(error.message);
                setAlertType("error");
                setShowAlert(true);
            } else {
                console.error("Unexpected Error:", error);
                alert("An unexpected error occurred. Please try again later.");
            }
        }
    }

    return (
        <div className="p-6">
            <div className="flex justify-between">
                <div className="flex gap-4">
                    <Image src="icons/arrow.svg" alt="arrow" className='hover:-translate-y-1' width={45} height={45} />
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
                    <Button className="bg-white text-black hover:bg-gray-200">
                        <AddOutlinedIcon />
                        <span className="font-sans font-bold">Watchlist</span>
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button>
                                <span className="font-sans font-extrabold">Buy</span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="w-64">
                            <AlertDialogTitle>Buy {data[0]?.name}({data[0]?.symbol})</AlertDialogTitle>
                            <AlertDialogDescription>
                                How many shares would you like to buy for {data[0]?.name}?
                                <Input type="number" min='0' value={numShares} onChange={(e) => setNumShares(Number(e.target.value))} className="mt-2"/>
                            </AlertDialogDescription>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleBuy}>Buy</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
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
            {showAlert && <MyAlert message={alertMessage} type={alertType} />}
        </div>
    );
}