"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VitalsChartProps {
    title: string;
    data: any[];
    dataKeys: { key: string; name: string; color: string }[];
}

export function VitalsChart({ title, data, dataKeys }: VitalsChartProps) {
    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="pl-2 flex-1 min-h-[300px]">
                <div className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis
                                dataKey="time"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--background))",
                                    border: "1px solid hsl(var(--border))",
                                }}
                                labelStyle={{ color: "hsl(var(--foreground))" }}
                            />
                            <Legend />
                            {dataKeys.map((item) => (
                                <Line
                                    key={item.key}
                                    type="monotone"
                                    dataKey={item.key}
                                    stroke={item.color}
                                    name={item.name}
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 4 }}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
