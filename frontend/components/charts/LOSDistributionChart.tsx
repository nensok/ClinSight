"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme } from "next-themes";
import type { LOSDistBucket } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props { data: LOSDistBucket[] }

export function LOSDistributionChart({ data }: Props) {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  const grid = dark ? "hsl(217.2 32.6% 22%)" : "hsl(214.3 31.8% 91.4%)";
  const text = dark ? "hsl(215 20.2% 65.1%)"  : "hsl(215.4 16.3% 46.9%)";
  const bg   = dark ? "hsl(222.2 47.4% 11%)"  : "hsl(0 0% 100%)";
  const fg   = dark ? "hsl(210 40% 98%)"       : "hsl(222.2 84% 4.9%)";

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">LOS Distribution (all encounters)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} />
            <XAxis dataKey="los_range" tick={{ fontSize: 10, fill: text }} angle={-30} textAnchor="end" />
            <YAxis tick={{ fontSize: 11, fill: text }} />
            <Tooltip
              contentStyle={{ background: bg, border: `1px solid ${grid}`, borderRadius: 8, color: fg }}
              formatter={(v: unknown) => [Number(v).toLocaleString(), "Encounters"]}
            />
            <Bar dataKey="count" fill="#10b981" name="Encounters" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
