'use client'
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useUser } from "@/components/UserProvider";
import dynamic from "next/dynamic";
import Image from "next/image";
import { BiErrorAlt } from "react-icons/bi";
import TickerCard from '@/components/TickerCard';
import BookMarkCard from "@/components/BookMarkCard";

const MarketOverviewNoSSR = dynamic(
  () => import('react-ts-tradingview-widgets').then((mod) => mod.MarketOverview),
  { ssr: false }
);

export default function Home() {
  const { portfolioData = [], bookmarkData = [] } = useUser() || {};
  const router = useRouter();
  const [visibleCards, setVisibleCards] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(2);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(3);
      } else {
        setVisibleCards(5);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="px-4 md:px-6">
      <div className="mt-2 flex flex-col gap-3">
        <h1 className="text-xl font-bold">My Portfolio</h1>
        <div className="relative w-full">
          <div className={`bg-white px-5 rounded-lg w-full ${portfolioData?.length ? '' : 'flex justify-center items-center'}`}>
            {(portfolioData?.length ?? 0) > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-12">
                {portfolioData?.slice(0, visibleCards).map((stock) => (
                  <TickerCard key={stock.symbol} symbol={stock.symbol} numShares={stock.shares}/>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-3 text-lg sm:text-xl md:text-2xl font-bold text-red-500 py-4">
                <BiErrorAlt />
                <h1>You Have No Stock Options Yet</h1>
              </div>
            )}
            {(portfolioData?.length ?? 0) > visibleCards && (
              <Image
                src="icons/right_arrow.svg"
                alt="arrow"
                className='absolute -right-5 z-10 cursor-pointer transform top-1/2 -translate-y-1/2 hover:scale-110 transition-transform'
                width={45}
                height={45}
                onClick={() => router.push('/portfolio')}
              />
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] mt-5 md:gap-8 gap-y-12 md:w-full">
        <div className="w-full h-full">
          <h1 className="text-xl font-bold mb-4">Market Overview</h1>
          <div className="lg:h-[90%] h-[390px]">
            <MarketOverviewNoSSR autosize={true}/>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl w-full lg:w-fit h-full ">
          <h1 className="text-xl font-bold mb-4">My Bookmarks</h1>
          {(bookmarkData?.length ?? 0) > 0 ? (
            <div className="flex flex-col gap-2">
              {bookmarkData?.slice(0, 4).map((stock) => (
                <BookMarkCard key={stock.symbol} symbol={stock.symbol} name={stock.name}/>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3 text-lg sm:text-xl md:text-2xl font-bold text-red-500 min-h-[200px] justify-center">
              <BiErrorAlt />
              <h1>Empty Bookmark</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}