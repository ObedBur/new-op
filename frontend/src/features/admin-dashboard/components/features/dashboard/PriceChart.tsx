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
            color: "#10b981",
        },
        sucre: {
            label: t.dashboard.charts.sugar,
            color: "#f97316",
        },
    } satisfies ChartConfig;

    return (
        <Card className="flex flex-col border border-slate-200/80 shadow-xs bg-white rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 p-6 border-b border-slate-100">
                <div className="space-y-1">
                    <CardTitle className="text-base font-black text-slate-900 tracking-tight">
                        {t.dashboard.charts.price_evolution}
                    </CardTitle>
                    <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                        Données hebdomadaires - Afrique
                    </CardDescription>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="size-2.5 rounded-full bg-emerald-600" />
                        <span className="text-xs font-bold text-slate-600">{t.dashboard.charts.rice}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="size-2.5 rounded-full bg-orange-500" />
                        <span className="text-xs font-bold text-slate-600">{t.dashboard.charts.sugar}</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-6">
                <ChartContainer config={chartConfig} className="h-64 w-full aspect-auto">
                    <BarChart
                        data={CHART_DATA}
                        margin={{
                            top: 10,
                            right: 10,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-slate-100" />
                        <XAxis
                            dataKey="week"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            className="text-[11px] font-bold text-slate-400"
                        />
                        <YAxis 
                            tickLine={false} 
                            axisLine={false} 
                            className="text-[11px] font-bold text-slate-400"
                        />
                        <ChartTooltip
                            cursor={{ fill: "rgba(0,0,0,0.04)" }}
                            content={<ChartTooltipContent hideIndicator />}
                        />
                        <Bar
                            dataKey="riz"
                            fill="#10b981"
                            radius={[6, 6, 0, 0]}
                            barSize={24}
                            animationDuration={1500}
                        />
                        <Bar
                            dataKey="sucre"
                            fill="#f97316"
                            radius={[6, 6, 0, 0]}
                            barSize={24}
                            animationDuration={1500}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default PriceChart;
