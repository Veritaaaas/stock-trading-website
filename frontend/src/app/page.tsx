'use client'
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config.js";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@/components/UserProvider";
import dynamic from "next/dynamic";
import Image from "next/image";
import { BiErrorAlt } from "react-icons/bi";
import LinearProgress from '@mui/material/LinearProgress';
import TickerCard from '@/components/TickerCard';
import BookMarkCard from "@/components/BookMarkCard";

const MarketOverviewNoSSR = dynamic(
  () => import('react-ts-tradingview-widgets').then((mod) => mod.MarketOverview),
  {
    ssr: false
  }
);

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const { portfolioData, bookmarkData } = useUser() || {};

  useEffect(() => {
    console.log(user);
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);


  if (loading) {
    return <LinearProgress />;
  }

  return (
    <div className="px-6">
      <div className="mt-2 flex flex-col gap-3">
        <h1 className="text-xl font-bold">My Portfolio</h1>
        <div className="relative">
          <div className={`bg-white px-5 rounded-lg overflow-hidden ${[portfolioData?.length ?? 0 > 0 ? '' : 'flex justify-center items-center']}`}>
            { portfolioData?.length ?? 0 > 0 ? (
                <>
                    <div className="flex gap-14">
                        {portfolioData?.slice(0, 5).map((stock) => (
                            <TickerCard key={stock.symbol} symbol={stock.symbol} numShares={stock.shares}/>
                        ))}
                    </div>
                    { (portfolioData?.length ?? 0) > 5 && (
                        <Image
                            src="icons/right_arrow.svg"
                            alt="arrow"
                            className='absolute -right-5 z-10 cursor-pointer transform top-10 hover:scale-110 transition-transform'
                            width={45}
                            height={45}
                        />
                    )}
                </>
            ) : (
                <div className="flex items-center gap-3 text-2xl font-bold text-red-500">
                    <BiErrorAlt />
                    <h1>You Have No Stock Options Yet</h1>
                </div>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-[65%_35%] mt-5 h-[250px] gap-6 pr-4">
        <div className="w-full h-full">
          <h1 className="text-xl font-bold mb-4">Market Overview</h1>
            <MarketOverviewNoSSR
              showChart={true}
              height={305}
              width={660}
              plotLineColorGrowing="#46B49E"
              plotLineColorFalling="#46B49E"
              belowLineFillColorFalling="rgba(70, 180, 158, 0)"
              belowLineFillColorGrowing="rgba(70, 180, 158, 0.12)"
              belowLineFillColorFallingBottom="rgba(70, 190, 158, 1)"
              belowLineFillColorGrowingBottom="rgba(70, 190, 158, 0.08)"
            />
        </div>
        <div className="bg-white p-4 rounded-2xl">
          <h1 className="text-xl font-bold">My Bookmarks</h1>
          {bookmarkData?.length ?? 0 > 0 ? (
            <div className="flex flex-col">
              {bookmarkData?.slice(0, 4).map((stock) => (
                <BookMarkCard key={stock.symbol} symbol={stock.symbol} name={stock.name}/>
              ))}
            </div>
            ) :
            <div className="flex items-center gap-3 text-2xl font-bold text-red-500 min-h-full justify-center">
              <BiErrorAlt />
              <h1>Empty Bookmark</h1>
            </div>
          }
        </div>
      </div>
    </div>
  );
}