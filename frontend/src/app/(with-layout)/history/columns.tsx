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
export type History = {
  uid: string
  name: string
  symbol: string
  shares: number
  price: number
  timestamp: Timestamp
  type: string
}

const api_key = process.env.NEXT_PUBLIC_LOGO_API_KEY;

export const columns: ColumnDef<History>[] = [
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
        accessorKey: "shares",
        header: "Shares",
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
        const price = (row.getValue("price") as number).toFixed(2)
        return <span>$ {price}</span>
        }
    },
    {
        accessorKey: "timestamp",
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
        cell: ({ row }) => {
        const date = format(row.original.timestamp.toDate(), 'MM/dd/yyyy');
        return <span>{date}</span>
        }
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
        return <span>{row.original.type}</span>
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
