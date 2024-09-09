import { BarChart3Icon, DollarSignIcon, LineChartIcon, PieChartIcon } from "lucide-react";
import StatCard from "@/components/StatCard";
import StockPieChart from "@/components/PieChart";
import PortfolioTable from "./PortfolioTable";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

export default function Portfolio() {

  const statCardsData = [
    {
      title: "Total Portfolio Value",
      icon: <DollarSignIcon className="w-4 h-4 text-muted-foreground" />,
      value: "$124,750.50",
      description: "+2.5% from last month",
    },
    {
      title: "Today's Gain/Loss",
      icon: <LineChartIcon className="w-4 h-4 text-muted-foreground" />,
      value: "+$1,250.75",
      description: "+1.01% today",
      valueClassName: "text-green-600",
    },
    {
      title: "Open Positions",
      icon: <BarChart3Icon className="w-4 h-4 text-muted-foreground" />,
      value: "15",
      description: "Across 12 companies",
    },
    {
      title: "Cash Balance",
      icon: <PieChartIcon className="w-4 h-4 text-muted-foreground" />,
      value: "$15,242.30",
      description: "Available for trading",
    },
  ];

  return (
    <div className="p-4">
      <div className="flex gap-4">
        <div className="w-[70%]">
          <div className="grid gap-4 md:grid-cols-2 h-[250px]">
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
        <div className="w-[30%]">
          <Card className="w-full h-full">
            <CardHeader className="pb-0 max-h-fit">
              <CardTitle className="text-md font-bold text-center">Portfolio Distribution</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pt-2 pb-0">
              <div className="w-full h-[190px]">
                <StockPieChart />
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
        <CardContent><PortfolioTable/></CardContent>
      </Card>
    </div>
  );
}