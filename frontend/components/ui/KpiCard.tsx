"use client";
import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  subtitle?: string;
  color?: "blue" | "green" | "yellow" | "red" | "purple";
  icon?: LucideIcon;
}

const COLOR_MAP = {
  blue:   "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
  green:  "bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400",
  yellow: "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400",
  red:    "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400",
  purple: "bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400",
};

function AnimatedNumber({ target, prefix = "", suffix = "", decimals = 0 }: {
  target: number; prefix?: string; suffix?: string; decimals?: number;
}) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 1200;
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(eased * target);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target]);

  const formatted = decimals > 0
    ? display.toFixed(decimals)
    : Math.round(display).toLocaleString("en-US");

  return <>{`${prefix}${formatted}${suffix}`}</>;
}

export function KpiCard({ title, value, prefix = "", suffix = "", decimals = 0, subtitle, color = "blue", icon: Icon }: Props) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          {Icon && (
            <span className={cn("w-9 h-9 rounded-lg flex items-center justify-center", COLOR_MAP[color])}>
              <Icon className="w-4 h-4" />
            </span>
          )}
        </div>
        <p className="text-3xl font-bold text-foreground">
          <AnimatedNumber target={value} prefix={prefix} suffix={suffix} decimals={decimals} />
        </p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}
