"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";

export default function CapsterBarChart({
    data = [],
    monthLabel = "This Month",
    title = "Total Reservasi"
}) {

    const chartConfig = {
        total: {
            label: <span>{title}</span>,
            color: "bg-gradient-to-r from-[#00D79E] to-[#0BD0D4]",
        },
        label: {
            color: "bg-gradient-to-r from-[#00D79E] to-[#0BD0D4]",
        },
    } satisfies ChartConfig;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{monthLabel}</CardTitle>
            </CardHeader>

            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={data}
                        layout="vertical"
                        margin={{ right: 16 }}
                    >
                        <defs>
                            <linearGradient id="capsterGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#00D79E" />
                                <stop offset="100%" stopColor="#0BD0D4" />
                            </linearGradient>
                        </defs>

                        <CartesianGrid horizontal={false} />

                        <YAxis
                            dataKey="name"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />

                        <XAxis dataKey="total" type="number" hide />

                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />

                        <Bar
                            dataKey="total"
                            layout="vertical"
                            fill="url(#capsterGradient)"
                            radius={6}
                        >
                            <LabelList
                                dataKey="total"
                                position="right"
                                offset={8}
                                className="fill-black"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
