"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, HeartPulse, DollarSign, Clock, Shield, ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { href: "/",           label: "Overview",       icon: LayoutDashboard },
  { href: "/admissions", label: "Admissions",     icon: HeartPulse },
  { href: "/cost",       label: "Cost Analysis",  icon: DollarSign },
  { href: "/los",        label: "Length of Stay", icon: Clock },
  { href: "/insurance",  label: "Insurance",      icon: Shield },
  { href: "/risk",       label: "Risk Patients",  icon: ShieldAlert },
];

export function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
