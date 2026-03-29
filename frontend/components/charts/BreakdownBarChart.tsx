"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes";
import { CHART_COLORS } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Item { label: string; [key: string]: unknown }

interface Props {
  data: Item[];
  dataKey: string;
  title: string;
  unit?: string;
  suffix?: string;
  horizontal?: boolean;
  color?: string;
  formatter?: (v: number) => string;
}

export function BreakdownBarChart({ data, dataKey, title, unit = "", suffix, horizontal = true, color = CHART_COLORS[0], formatter }: Props) {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  const grid = dark ? "hsl(217.2 32.6% 22%)" : "hsl(214.3 31.8% 91.4%)";
  const text = dark ? "hsl(215 20.2% 65.1%)"  : "hsl(215.4 16.3% 46.9%)";
  const bg   = dark ? "hsl(222.2 47.4% 11%)"  : "hsl(0 0% 100%)";
  const fg   = dark ? "hsl(210 40% 98%)"       : "hsl(222.2 84% 4.9%)";

  const effectiveUnit = suffix ?? unit;
  const fmt = formatter ?? ((v: number) => `${v.toLocaleString("en-US")}${effectiveUnit}`);
  const sorted = [...data].sort((a, b) => (a[dataKey] as number) - (b[dataKey] as number));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tooltipFmt = (v: any) => [fmt(Number(v)), dataKey];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const labelFmt = (v: any) => fmt(Number(v));

  if (horizontal) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={Math.max(200, sorted.length * 36)}>
            <BarChart data={sorted} layout="vertical" margin={{ top: 5, right: 60, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: text }} tickFormatter={labelFmt} />
              <YAxis type="category" dataKey="label" tick={{ fontSize: 11, fill: text }} width={130} />
              <Tooltip
                contentStyle={{ background: bg, border: `1px solid ${grid}`, borderRadius: 8, color: fg }}
                formatter={tooltipFmt}
              />
              <Bar dataKey={dataKey} fill={color} radius={[0,3,3,0]}
                label={{ position: "right", fontSize: 11, fill: text, formatter: labelFmt }} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: text }} angle={-30} textAnchor="end" />
            <YAxis tick={{ fontSize: 11, fill: text }} tickFormatter={labelFmt} />
            <Tooltip
              contentStyle={{ background: bg, border: `1px solid ${grid}`, borderRadius: 8, color: fg }}
              formatter={tooltipFmt}
            />
            <Bar dataKey={dataKey} fill={color} radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
