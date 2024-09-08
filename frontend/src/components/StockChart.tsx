'use client'
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StockChart({ data, timeFrame='1day' } : { data: any, timeFrame: string }) {
    const [interval, setInterval] = useState(365);

    useEffect(() => {
        if (timeFrame === '1day') {
            setInterval(365);
        } else if (timeFrame === '1week') {
            setInterval(52);
        } else if (timeFrame === '1month') {
            setInterval(12);
        }
    }, [timeFrame]);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={data}
                margin={{ right: 20,
                        left: 20,
                }}
            >
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3dfb95" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="rgba(70, 190, 158, 0.08)" stopOpacity={1} />
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis 
                    dataKey="time" 
                    tickFormatter={(tick) => format(new Date(tick), 'MMM')} 
                    interval={interval} 
                    padding={{ left: 20}} 
                />
                <Tooltip />
                <Area
                    dataKey="value"
                    stroke="#0DD66A"
                    fillOpacity={1}
                    fill="url(#colorUv)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}