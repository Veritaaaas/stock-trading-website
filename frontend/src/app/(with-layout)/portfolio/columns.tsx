"use client"

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { toast } from "sonner";
import { useUser } from "@/components/UserProvider";
import { db } from "@/firebase/config";
import { collection, getDocs, query, where, doc, runTransaction, Timestamp } from 'firebase/firestore';
import { ArrowUpDown } from "lucide-react"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

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

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Portfolio = {
    uid: string
    name: string
    symbol: string
    change_percentage: number
    price: number
    shares: number
    total_value?: number | undefined
}

const api_key = process.env.NEXT_PUBLIC_LOGO_API_KEY;

export const columns: ColumnDef<Portfolio>[] = [
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
  {
    accessorKey: "shares",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Shares
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "total_value",
    header: "Total Value",
    cell: ({ row }) => {
      const totalValue = (row.getValue("total_value") as number).toFixed(2)
      return <span>$ {totalValue}</span>
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <SellCell row={row} />
  }
]

function NameCell({ row } : { row: any }) {
  const router = useRouter();
  
  const handleClick = () => {
    router.push(`/${row.original.symbol}`);
  }

  return (
    <div className="flex items-center space-x-2 cursor-pointer" onClick={handleClick}>
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

function SellCell({ row } : { row: any }) {
  const uid = row.original.uid;
  const [numShares, setNumShares] = useState<number>(0);
  const { userData } = useUser() || {};

  const handleSell = async () => {
    if (isNaN(numShares) || numShares <= 0) {
      toast.error("Number of shares must be a positive number");
      return false;
    }
  
    if (numShares > row.original.shares) {
      toast.error("You do not have enough shares to sell");
      return false;
    }
  
    const userPortfolioRef = collection(db, 'portfolio');
    const userDocRef = doc(db, 'users', uid);
    const userHistoryRef = collection(db, 'history');
  
    try {
      const q = query(userPortfolioRef, where('uid', '==', userData?.uid), where('symbol', '==', row.original.symbol));
      const querySnapshot = await getDocs(q);
  
      await runTransaction(db, async (transaction) => {
        if (querySnapshot.empty) {
          throw new Error("You do not own any shares of this stock");
        }
  
        const userDoc = querySnapshot.docs[0];
        const docRef = userDoc.ref;
        const currentShares = userDoc.data().shares;
  
        if (currentShares < numShares) {
          throw new Error("You do not have enough shares to sell");
        }
  
        // Update the number of shares in the user's portfolio
        transaction.update(docRef, {
          shares: currentShares - numShares
        });
  
        // Add a transaction to the user's history
        transaction.set(doc(userHistoryRef), {
          uid: uid,
          symbol: row.original.symbol,
          name: row.original.name,
          shares: numShares,
          price: row.original.price,
          type: 'Sell',
          timestamp: Timestamp.now()
        });
  
        // Update the user's cash balance
        transaction.update(userDocRef, {
          cash: (userData?.cash || 0) + (numShares * row.original.price)
        });
      });
  
      toast.success("Shares sold successfully");
      return true;
    } catch (error) {
      console.error("Error in handleSell:", error);
      toast.error((error as Error).message || "An error occurred while processing the sale");
      return false;
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          <span className="font-sans font-extrabold">Sell</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-64">
        <AlertDialogTitle>Sell {row.original.name}</AlertDialogTitle>
        <AlertDialogDescription>
          How many shares of {row.original.name} would you like to sell?
          <Input type="number" min='0' value={numShares} onChange={(e) => setNumShares(Number(e.target.value))} className="mt-2"/>
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSell}>Sell</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}