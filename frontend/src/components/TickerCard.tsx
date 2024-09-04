import Image from "next/image";
import quote from '@/functions/quote';
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TickerCard({ symbol, numShares }: { symbol: string, numShares: number }) {
    const api_key = process.env.NEXT_PUBLIC_LOGO_API_KEY;
    const [price, setPrice] = useState(0);
    const router = useRouter();

    quote(symbol)
        .then((data: any) => {
            setPrice(data.c);
        }
    );

    const handleClick = () => {

        router.push(`/${symbol}`);
    }

    return (
        <div className="flex flex-col py-2 w-[150px] gap-2 cursor-pointer" onClick={handleClick}>
            <div className="flex justify-between w-full items-center max-h-[50px]">
                <div className="flex items-center gap-2">
                    <Image
                        src={`https://img.logo.dev/ticker/${String(symbol)}?token=${String(api_key)}`}
                        alt="Logo"
                        className="rounded-full"
                        width={45}
                        height={45}
                    />
                    <span className="font-sans font-bold text-xl">{symbol}</span>
                </div>
            </div>
            <div className="w-full h-[50px] flex flex-col text-sm font-sans text-gray-500 font-semibold">
                <div className="flex justify-between">
                    <span>Current Price: </span>
                    <span className="font-bold text-black">$ {price}</span>
                </div>
                <div className="flex justify-between">
                    <span>Stocks Owned </span>
                    <span className="font-bold text-black">{numShares}</span>
                </div>
            </div>
        </div>
    );
}