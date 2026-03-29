"use client";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useTheme } from "next-themes";
import type { InsuranceOverall } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props { overall: InsuranceOverall }

export function InsuranceCoverageChart({ overall }: Props) {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  const bg   = dark ? "hsl(222.2 47.4% 11%)"  : "hsl(0 0% 100%)";
  const grid = dark ? "hsl(217.2 32.6% 22%)"  : "hsl(214.3 31.8% 91.4%)";
  const fg   = dark ? "hsl(210 40% 98%)"       : "hsl(222.2 84% 4.9%)";
  const text = dark ? "hsl(215 20.2% 65.1%)"   : "hsl(215.4 16.3% 46.9%)";

  const data = [
    { name: "Covered",      value: overall.covered },
    { name: "No Insurance", value: overall.uncovered },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">
          Insurance Coverage ({overall.coverage_pct.toFixed(1)}% covered)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%"
              innerRadius={60} outerRadius={90} paddingAngle={4}>
              <Cell fill="#3b82f6" />
              <Cell fill="#ef4444" />
            </Pie>
            <Tooltip
              contentStyle={{ background: bg, border: `1px solid ${grid}`, borderRadius: 8, color: fg }}
              formatter={(v: unknown) => Number(v).toLocaleString()}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: text }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
