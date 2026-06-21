// 
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { CHART_DATA } from '@/constants/data.constants';
import { useAdminTranslation } from '@/features/admin-dashboard/hooks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { 
    ChartConfig, 
    ChartContainer, 
    ChartTooltip, 
    ChartTooltipContent 
} from "@/components/ui/chart";

const PriceChart: React.FC = () => {
    const { t } = useAdminTranslation();

    const chartConfig = {
        riz: {
            label: t.dashboard.charts.rice,
            color: "var(--chart-1)",
        },
        sucre: {
            label: t.dashboard.charts.sugar,
            color: "var(--chart-2)",
        },
    } satisfies ChartConfig;

    return (
        <Card className="min-h-[400px] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                <div className="space-y-1">
                    <CardTitle className="text-base font-black text-(--deep-blue) tracking-tight">
                        {t.dashboard.charts.price_evolution}
                    </CardTitle>
                    <CardDescription className="text-[10px] uppercase font-bold tracking-widest opacity-60">
                        Données hebdomadaires - Afrique
                    </CardDescription>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="size-2.5 rounded-sm bg-(--chart-1)" />
                        <span className="text-xs font-bold text-muted-foreground">{t.dashboard.charts.rice}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="size-2.5 rounded-sm bg-(--chart-2)" />
                        <span className="text-xs font-bold text-muted-foreground">{t.dashboard.charts.sugar}</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 pb-4">
                <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
                    <BarChart
                        data={CHART_DATA}
                        margin={{
                            top: 10,
                            right: 10,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/30" />
                        <XAxis
                            dataKey="week"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            className="text-[11px] font-bold text-muted-foreground"
                        />
                        <YAxis 
                            tickLine={false} 
                            axisLine={false} 
                            className="text-[11px] font-bold text-muted-foreground"
                        />
                        <ChartTooltip
                            cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                            content={<ChartTooltipContent hideIndicator />}
                        />
                        <Bar
                            dataKey="riz"
                            fill="var(--color-riz)"
                            radius={[4, 4, 0, 0]}
                            barSize={32}
                            animationDuration={1500}
                        />
                        <Bar
                            dataKey="sucre"
                            fill="var(--color-sucre)"
                            radius={[4, 4, 0, 0]}
                            barSize={32}
                            animationDuration={1500}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default PriceChart;


