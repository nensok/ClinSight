"use client";
import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  subtitle?: string;
  color?: "blue" | "green" | "yellow" | "red" | "purple";
  icon?: LucideIcon;
  changePct?: number;      // year-over-year % change, positive = up
  changeLabel?: string;    // e.g. "vs prior year"
  higherIsBetter?: boolean; // determines red/green direction
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

function ChangeIndicator({ changePct, higherIsBetter = true, label }: {
  changePct: number; higherIsBetter?: boolean; label?: string;
}) {
  const isGood = higherIsBetter ? changePct >= 0 : changePct <= 0;
  const abs = Math.abs(changePct);
  const Icon = abs < 0.5 ? Minus : changePct > 0 ? TrendingUp : TrendingDown;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            "flex items-center gap-0.5 text-xs font-medium cursor-default",
            isGood ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          )}>
            <Icon className="w-3 h-3" />
            <span>{abs < 0.1 ? "~0" : `${abs.toFixed(1)}%`}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          {changePct >= 0 ? "+" : ""}{changePct.toFixed(1)}% {label ?? "vs prior year"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function KpiCard({
  title, value, prefix = "", suffix = "", decimals = 0,
  subtitle, color = "blue", icon: Icon,
  changePct, changeLabel, higherIsBetter = true,
}: Props) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          {Icon && (
            <span className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", COLOR_MAP[color])}>
              <Icon className="w-4 h-4" />
            </span>
          )}
        </div>
        <p className="text-3xl font-bold text-foreground">
          <AnimatedNumber target={value} prefix={prefix} suffix={suffix} decimals={decimals} />
        </p>
        <div className="flex items-center justify-between gap-2">
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          {changePct !== undefined && (
            <ChangeIndicator changePct={changePct} higherIsBetter={higherIsBetter} label={changeLabel} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
