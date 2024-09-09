'use client'
import { useUser } from "@/components/UserProvider";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import quote from "@/functions/quote";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { useEffect, useState } from "react";

type BookmarkData = {
  uid: string;
  name: string;
  symbol: string;
  change: number;
  high_price: number;
  low_price: number;
  change_percentage: number;
  price: number;
};

export default function Bookmark() {
  const { bookmarkData } = useUser() || {};
  const [data, setData] = useState<BookmarkData[]>([]);

  useEffect(() => {
    const fetchQuoteData = async () => {
      if (bookmarkData) {
        const symbolList = bookmarkData.map((company) => company.symbol);
        const quoteDataArray = [];

        for (const symbol of symbolList) {
          try {
            const quoteData = await quote(symbol);
            quoteDataArray.push(quoteData);
          } catch (error) {
            console.error(`Error fetching quote for ${symbol}:`, error);
          }
        }

        const filteredQuoteData = quoteDataArray.map(({ c, d, h, l, dp }: { c: number; d: number; h: number; l: number; dp: number }) => ({
          price: c,
          change: d,
          high_price: h,
          low_price: l,
          change_percentage: dp,
        }));

        const combinedData = bookmarkData.map((company, index) => ({
          ...company,
          ...filteredQuoteData[index],
        }));

        setData(combinedData);
      }
    };

    fetchQuoteData();
  }, [bookmarkData]);

  return (
    <Card className="mt-8 mx-4">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Bookmarks</CardTitle>
        <CardDescription className="text-sm text">View your bookmarked companies</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
}