"use client";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes";
import type { AdmissionsPeriod } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  data: AdmissionsPeriod[];
  granularity: "daily" | "weekly" | "monthly";
}

export function AdmissionsTrendChart({ data, granularity }: Props) {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  const grid  = dark ? "hsl(217.2 32.6% 22%)" : "hsl(214.3 31.8% 91.4%)";
  const text  = dark ? "hsl(215 20.2% 65.1%)"  : "hsl(215.4 16.3% 46.9%)";
  const bg    = dark ? "hsl(222.2 47.4% 11%)"  : "hsl(0 0% 100%)";
  const fg    = dark ? "hsl(210 40% 98%)"       : "hsl(222.2 84% 4.9%)";

  const periodKey = granularity === "daily" ? "date" : granularity === "weekly" ? "week" : "month";
  const formatted = data.map((d) => ({
    period: String(d[periodKey as keyof AdmissionsPeriod] ?? ""),
    admissions: d.admissions,
    readmissions: d.readmissions,
    rate: +(d.readmission_rate * 100).toFixed(1),
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Admissions &amp; Readmissions Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={formatted} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} />
            <XAxis dataKey="period" tick={{ fontSize: 11, fill: text }} interval="preserveStartEnd" />
            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: text }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: text }} unit="%" />
            <Tooltip
              contentStyle={{ background: bg, border: `1px solid ${grid}`, borderRadius: 8, color: fg }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(val: any, name: any) => [
                name === "rate" ? `${Number(val)}%` : Number(val).toLocaleString(),
                name === "rate" ? "Readmission Rate" : String(name),
              ]}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: text }} />
            <Bar yAxisId="left" dataKey="admissions"  fill="#3b82f6" radius={[3,3,0,0]} name="Admissions" />
            <Bar yAxisId="left" dataKey="readmissions" fill="#f59e0b" radius={[3,3,0,0]} name="Readmissions" />
            <Line yAxisId="right" type="monotone" dataKey="rate" stroke="#ef4444" dot={false} strokeWidth={2} name="rate" />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
