'use client'
import { useEffect, useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { useUser } from "@/components/UserProvider";

// Function to get CSS variable values
const getCSSVariable = (variable: string) => {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, payload }: {
  cx: number,
  cy: number,
  midAngle: number,
  innerRadius: number,
  outerRadius: number,
  payload: any
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontSize: '12px', fontWeight: 'bold', fontFamily: 'inherit' }}
    >
      {payload.name}
    </text>
  );
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload }: { active: boolean, payload: any[] }) => {
  if (active && payload && payload.length) {
    const { name, value, fill } = payload[0];

    return (
      <div className="bg-white text-black p-2 rounded-md shadow-md flex justify-between items-center w-28 text-md">
        <p className="font-bold">{name}</p>
        <p className="text-sm">{value}</p>
      </div>
    );
  }

  return null;
};

interface PortfolioData {
  uid: string;
  symbol: string;
  name: string;
  shares: number;
}

export default function StockPieChart({portfolioData} : {portfolioData: PortfolioData[]}) {

  const [colors, setColors] = useState<string[]>([]);
  const [pieChartData, setPieChartData] = useState<{ name: string; value: number; }[]>([]);

  useEffect(() => {
    // Extract CSS variables and set them as colors
    const chartColors = [
      `hsl(${getCSSVariable('--chart-1')})`,
      `hsl(${getCSSVariable('--chart-2')})`,
      `hsl(${getCSSVariable('--chart-3')})`,
      `hsl(${getCSSVariable('--chart-4')})`,
      `hsl(${getCSSVariable('--chart-5')})`,
    ];
    setColors(chartColors);
    console.log(chartColors);
  }, []);

  useEffect(() => {
    if (portfolioData) {
      const sortedData = [...portfolioData].sort((a, b) => b.shares - a.shares);

      const top4Companies = sortedData.slice(0, 4);
      const othersTotal = sortedData.slice(4).reduce((acc, company) => acc + company.shares, 0);
      
      const data = top4Companies.map((company) => ({
        name: company.symbol,
        value: company.shares,
      }));
      
      data.push({ name: 'Others', value: othersTotal });
      setPieChartData(data);
    }
  }, [portfolioData]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={300} height={300}>
        <Pie
          data={pieChartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={95}
          labelLine={false}
          label={renderCustomizedLabel}
        >
          {pieChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip active={true} payload={[]} />} />
      </PieChart>
    </ResponsiveContainer>
  );
}