'use client'
import Image from "next/image";
import { FaEye } from "react-icons/fa";
import { RiHome6Line } from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";
import { IoWalletOutline } from "react-icons/io5";
import { FaRegBookmark } from "react-icons/fa6";
import { HiOutlineNewspaper } from "react-icons/hi2";
import { usePathname } from "next/navigation";

import { db } from "../firebase/config";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config"; 
import { useState, useEffect } from 'react';

export default function Sidebar() {

    const pathname = usePathname();
    const [user] = useAuthState(auth);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
    
          if (user) {
            const usersCollectionRef = collection(db, 'users');
            const q = query(usersCollectionRef, where('uid', '==', user.uid)); 
    
            try {
              const querySnapshot = await getDocs(q);
              if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                setUserData(userDoc.data());
              } else {
                console.log('No user document found');
              }
            } catch (error) {
              console.error('Error fetching user data:', error);
            }
          }
        };
    
        fetchUserData();
      }, [user]); 

    const sidebarItems = [
        {
            name: "Home",
            icon: <RiHome6Line />,
            path: "/"
        },
        {
            name: "Portfolio",
            icon: <RxDashboard />,
            path: "/portfolio"
        },
        {
            name: "Wallet",
            icon: <IoWalletOutline />,
            path: "/wallet"
        },
        {
            name: "Watchlist",
            icon: <FaRegBookmark />,
            path: "/watchlist"
        },
        {
            name: "News",
            icon: <HiOutlineNewspaper />,
            path: "/news"
        },
    ];

    return (
        <div className="bg-white w-full h-screen p-8 flex flex-col gap-8 font-sans">
            <div className="flex justify-center gap-3">
                <Image src="/Subtract.svg" alt="Subtract" width={35} height={35} /> {/* Corrected image path */}
                <h1 className="text-2xl font-bold text-[#1C1C1C]">GoStock</h1>
            </div>
            <div className="bg-[#1c1c1c] rounded-xl p-4 flex flex-col gap-2">
                <h1 className="text-lg text-white">Buying Power</h1>
                <div className="flex gap-2 items-center">
                    <h1 className="text-xl text-white font-bold">${userData?.cash || 'Loading...'}</h1> {/* Added optional chaining */}
                    <FaEye className="text-white" />
                </div>
            </div>
            <div className="flex flex-col text-[20px] font-bold gap-5">
                {sidebarItems.map((item, index) => (
                    <div key={index} className={`flex gap-3 items-center px-2 cursor-pointer hover:bg-[#d9d9d9] rounded-lg ${pathname === item.path ? "bg-[#1c1c1c] text-white" : ""}`}>
                        {item.icon}
                        <h1>{item.name}</h1>
                    </div>
                ))}
            </div>
        </div>
    );
}