'use client'
import { columns } from "./columns";
import { useUser } from "@/components/UserProvider";
import { DataTable } from "@/components/data-table";
import { useEffect, useState } from "react";
import quote from "@/functions/quote";

export default function PortfolioTable() {
  const { portfolioData } = useUser() || {};
  const [tableData, setTableData] = useState<{ uid: string, name: string, symbol: string, change_percentage: number, price: number, shares: number, total_value?: number}[]>([]);

  useEffect(() => {
    const fetchQuoteData = async () => {
      if (portfolioData) {
        const symbolList = portfolioData.map((company) => company.symbol);
        const quoteDataArray = [];
  
        for (const symbol of symbolList) {
          try {
            const quoteData = await quote(symbol);
            quoteDataArray.push(quoteData);
          } catch (error) {
            console.error(`Error fetching quote for ${symbol}:`, error);
          }
        }
  
        const filteredQuoteData = quoteDataArray.map(({ c, dp }: { c: number; dp: number }) => ({
          price: c,
          change_percentage: dp,
        }));
  
        const combinedData = portfolioData.map((company, index) => ({
          ...company,
          ...filteredQuoteData[index],
          total_value: company.shares * filteredQuoteData[index].price,
        }));

        setTableData(combinedData);
      }
    };
  
    fetchQuoteData();
  }, [portfolioData]);


  return (
    <DataTable columns={columns} data={tableData} />
  );
}