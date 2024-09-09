"use client"

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { ArrowUpDown } from "lucide-react"
import { format } from 'date-fns';
import { useRouter } from "next/navigation";
import { Timestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Bookmark = {
  uid: string
  name: string
  symbol: string
  change: number
  high_price: number
  low_price: number
  change_percentage: number
  price: number
}

const api_key = process.env.NEXT_PUBLIC_LOGO_API_KEY;

export const columns: ColumnDef<Bookmark>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <NameCell row={row} />
  },
  {
      accessorKey: "symbol",
      header: "Symbol",
  },
  {
    accessorKey: "change",
    header: "Change",
  },
  {
    accessorKey: "high_price",
    header: "High Price",
    cell: ({ row }) => {
      const highPrice = (row.getValue("high_price") as number).toFixed(2)
      return <span>$ {highPrice}</span>
    }
  },
  {
    accessorKey: "low_price",
    header: "Low Price",
    cell: ({ row }) => {
      const lowPrice = (row.getValue("low_price") as number).toFixed(2)
      return <span>$ {lowPrice}</span>
    }
  },
  {
    accessorKey: "change_percentage",
    header: "Change (%)",
    cell: ({ row }) => (
      <span className={row.original.change_percentage > 0 ? "text-green-500" : "text-red-500"}>
        {row.original.change_percentage}%
      </span>
    )
  },
  {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
      const price = (row.getValue("price") as number).toFixed(2)
      return <span>$ {price}</span>
      }
  },
]

function NameCell({ row } : { row: any }) {
  const router = useRouter();
  
  const handleClick = () => {
    router.push(`/${row.original.symbol}`);
  }

  return (
    <div className="flex items-center space-x-2 cursor-pointer text-lg" onClick={handleClick}>
      <Image
        src={`https://img.logo.dev/ticker/${String(row.original.symbol)}?token=${String(api_key)}`}
        alt={row.original.symbol}
        width={35}
        height={35}
        className="rounded-full"
      />
      <span>{row.original.name}</span>
    </div>
  )
}
