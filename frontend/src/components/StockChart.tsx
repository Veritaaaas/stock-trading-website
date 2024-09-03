'use client'
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StockChart({ data, timeFrame }) {
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
                margin={{
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                }}
            >
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3dfb95" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="rgba(70, 190, 158, 0.08)" stopOpacity={1} />
                    </linearGradient>
                </defs>
                <XAxis 
                    dataKey="time" 
                    tickFormatter={(tick) => format(new Date(tick), 'MMM dd')} 
                    interval={interval} 
                    padding={{ left: 20, right: 20 }} 
                />
                <YAxis padding={{ top: 20, bottom: 20 }} />
                <CartesianGrid strokeDasharray="3 3" fillOpacity={0.3} />
                <Tooltip />
                <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#0DD66A"
                    fillOpacity={1}
                    fill="url(#colorUv)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}