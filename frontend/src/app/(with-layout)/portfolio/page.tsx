'use client'
import { BarChart3Icon, DollarSignIcon, LineChartIcon, PieChartIcon } from "lucide-react";
import StatCard from "@/components/StatCard";
import StockPieChart from "@/components/PieChart";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { useState, useEffect } from 'react';
import { useUser } from "@/components/UserProvider";
import quote from "@/functions/quote";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

interface tableData {
  uid: string;
  name: string;
  symbol: string;
  change_percentage: number;
  price: number;
  shares: number;
  total_value?: number;
}

export default function Portfolio() {

  const { portfolioData, userData } = useUser() || {};
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [numShares, setNumShares] = useState(0);
  const [tableData, setTableData] = useState<tableData[]>([]);
  const [avgChangePercentage, setAvgChangePercentage] = useState(0);

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

        const totalValue = combinedData.reduce((acc, company) => acc + (company.total_value || 0), 0);
        setPortfolioValue(totalValue);

        const totalChangePercentage = combinedData.reduce((acc, company) => acc + (company.change_percentage || 0), 0);
        const avgChange = totalChangePercentage / combinedData.length;
        setAvgChangePercentage(avgChange);

        const totalShares = combinedData.reduce((acc, company) => acc + company.shares, 0);
        setNumShares(totalShares);
      }
    };
  
    fetchQuoteData();
  }, [portfolioData]);

  const statCardsData = [
    {
      title: "Total Portfolio Value",
      icon: <DollarSignIcon className="w-4 h-4 text-muted-foreground" />,
      value: `$ ${portfolioValue.toFixed(2)}`,
      description: "Total value of your portfolio",
    },
    {
      title: "Today's Gain/Loss Percentage",
      icon: <LineChartIcon className="w-4 h-4 text-muted-foreground" />,
      value: `${avgChangePercentage.toFixed(2)}%`,
      description: "Today's average change",
      valueClassName: avgChangePercentage >= 0 ? "text-green-600" : "text-red-600",
    },
    {
      title: "Number of Shares Owned",
      icon: <BarChart3Icon className="w-4 h-4 text-muted-foreground" />,
      value: `${numShares}`,
      description: `Across ${new Set(portfolioData?.map((company) => company.symbol)).size} companies`,
    },
    {
      title: "Cash Balance",
      icon: <PieChartIcon className="w-4 h-4 text-muted-foreground" />,
      value: `$ ${userData?.cash?.toFixed(2) || 0}`,
      description: "Available for trading",
    },
  ];

  return (
    <div className="p-4">
      <div className="md:flex md:gap-4">
        <div className="md:w-[70%] w-full">
          <div className="grid gap-4 grid-cols-2">
            {statCardsData.map((card, index) => (
              <StatCard
                key={index}
                title={card.title}
                icon={card.icon}
                value={card.value}
                description={card.description}
                valueClassName={card.valueClassName}
              />
            ))}
          </div>
        </div>
        <div className="w-[30%] hidden md:block">
          <Card className="w-full h-full">
            <CardHeader className="pb-0 max-h-fit">
              <CardTitle className="text-md font-bold text-center">Portfolio Distribution</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pt-2 pb-0">
              <div className="w-full h-[220px]">
                <StockPieChart portfolioData={portfolioData || []} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="font-sans font-bold text-lg">Current Holdings</CardTitle>
          <CardDescription>Your currently owned stocks</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={tableData} />
        </CardContent>
      </Card>
    </div>
  );
}