import Image from "next/image";
import quote from '@/functions/quote';
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function BookMarkCard({ symbol, name } : { symbol: String, name: String }) {
    const api_key = process.env.NEXT_PUBLIC_LOGO_API_KEY;
    const router = useRouter();
    const [price, setPrice] = useState(0);
    const [percentChange, setPercentChange] = useState(0);

    quote(symbol)
        .then((data: any) =>  {
            const price = data.c.toFixed(2);
            setPrice(price);
            setPercentChange(data.dp)
        }
    )

    const handleClick = () => {

        router.push(`/${symbol}`);
    }

    return (
        <div className="flex px-2 py-4 border-gray-100 border-b-2 gap-3  " onClick={handleClick}>
            <Image
                src={`https://img.logo.dev/ticker/${String(symbol)}?token=${String(api_key)}`}
                alt="Logo"
                className="rounded-full"
                width={45}
                height={45}
            />
            <div className="flex flex-col w-full pr-4">
                <div className="flex justify-between w-full items-center font-bold text-md">
                    <span>{symbol}</span>
                    <span>${price}</span>
                </div>
                <div className="flex justify-between w-full items-center font-sans text-sm text-gray-400">
                    <span>{name}</span>
                    <span className={`font-bold text-md ${percentChange < 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {percentChange}%
                    </span>
                </div>
            </div>
        </div>
    )
    
}

