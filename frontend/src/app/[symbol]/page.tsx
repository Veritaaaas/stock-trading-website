'use client'
import fetchStockData from "@/functions/fetchStockData";
import fetchTimeSeries from "@/functions/fetchTimeSeries";
import StockChart from "@/components/StockChart";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useUser } from "@/components/UserProvider";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Input } from "@/components/ui/input";
import { db } from "@/firebase/config";
import { collection, getDocs, query, where, doc, runTransaction, deleteDoc, addDoc, Timestamp } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

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

    const api_key = process.env.NEXT_PUBLIC_LOGO_API_KEY;
    const symbol = usePathname().replace("/", "");
    const { userData, bookmarkData } = useUser() || { userData: null };
    const router = useRouter();
    
    const [data, setData] = useState<StockData[]>([]);
    const [timeSeries, setTimeSeries] = useState([]);
    const [timeFrame, setTimeFrame] = useState('1day');
    const [numShares, setNumShares] = useState(0);
    const [bookmarked, setBookmarked] = useState(false);

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

    useEffect(() => {
        if (bookmarkData) {
            console.log(bookmarkData);
            const bookmarked = bookmarkData.find((bookmark) => bookmark.symbol === symbol);
            if (bookmarked) {
                setBookmarked(true);
            }
        }
    }, [bookmarkData, symbol]);

    const handleChange = (
        event: React.MouseEvent<HTMLElement>, 
        newTimeFrame: string, 
    ) => {
        setTimeFrame(newTimeFrame);
    };

    const handleBuy = async () => {

        if (!userData) {
            toast.error("Please log in to buy shares");
            return;
        }
    
        if (userData.cash === undefined || userData.cash < (data[0]?.price ?? 0) * numShares) {
            toast.error("Insufficient funds");
            return;
        }
    
        const userPortfolioRef = collection(db, 'portfolio');
        const userDocRef = doc(db, 'users', userData.uid);
        const userHistoryRef = collection(db, 'history');
    
        try {
            if (isNaN(numShares) || numShares <= 0) {
                toast.error("Invalid number of shares");
                return;
            }
            if (!data[0]?.symbol || !data[0]?.price) {
                toast.error("Invalid stock data");
                return;
            }
    
            const q = query(userPortfolioRef, where('uid', '==', userData.uid), where('symbol', '==', data[0].symbol));
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
                        uid: userData.uid,
                        symbol: data[0].symbol,
                        name: data[0].name,
                        shares: numShares,
                    });
                }
    
                transaction.update(userDocRef, {
                    cash: userData.cash - data[0].price * numShares,
                });

                // Add a new document to the history collection
                await addDoc(userHistoryRef, {
                    uid: userData.uid,
                    symbol: data[0].symbol,
                    name: data[0].name,
                    shares: numShares,
                    price: data[0].price,
                    type: 'buy',
                    timestamp: Timestamp.fromDate(new Date()),
                });
            });
    
            toast.success("Successfully bought shares");
    
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error("Firebase Error:", error);
                toast.error(error.message);
            } else {
                console.error("Unexpected Error:", error);
                toast.error("An unexpected error occurred. Please try again later.");
            }
        }
    }

    const handleBookmark = async () => {
        if (!userData) {
            toast.error("Please log in to bookmark stocks");
            return;
        }
    
        const userBookmarkRef = collection(db, 'bookmark');
    
        try {
            if (!data[0]?.symbol) {
                toast.error("Invalid stock data");
                return;
            }
    
            const q = query(userBookmarkRef, where('uid', '==', userData.uid), where('symbol', '==', data[0].symbol));
            const querySnapshot = await getDocs(q);
    
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const docRef = userDoc.ref;
                await deleteDoc(docRef);
                setBookmarked(false);
                toast.success("Successfully removed bookmark");
            } else {
                await addDoc(userBookmarkRef, {
                    uid: userData.uid,
                    symbol: data[0].symbol,
                    name: data[0].name,
                });
                setBookmarked(true);
                toast.success("Successfully bookmarked stock");
            }
    
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error("Firebase Error:", error);
                toast.error(error.message);
            } else {
                console.error("Unexpected Error:", error);
                toast.error("An unexpected error occurred. Please try again later.");
            }
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between">
                <div className="flex gap-4">
                    <Image src="icons/arrow.svg" 
                        alt="arrow" 
                        className='hover:-translate-y-1' 
                        width={45} 
                        height={45} 
                        onClick={() => router.back()}/>
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
                    <Button className="bg-white text-black hover:bg-gray-200" onClick={handleBookmark}>
                        {bookmarked ? <ClearIcon /> : <AddOutlinedIcon /> }
                        <span className="font-sans font-bold">Bookmark</span>
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
                    
                <div className="mt-6 w-full bg-white py-6 px-4 rounded-lg h-[250px]">
                    <StockChart data={timeSeries} timeFrame={timeFrame} />
                </div>
            </div>
        </div>
    );
}