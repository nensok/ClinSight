"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  HeartPulse,
  DollarSign,
  Clock,
  Shield,
  ShieldAlert,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const NAV = [
  { href: "/",           label: "Overview",       icon: LayoutDashboard },
  { href: "/admissions", label: "Admissions",     icon: HeartPulse },
  { href: "/cost",       label: "Cost Analysis",  icon: DollarSign },
  { href: "/los",        label: "Length of Stay", icon: Clock },
  { href: "/insurance",  label: "Insurance",      icon: Shield },
  { href: "/risk",       label: "Risk Patients",  icon: ShieldAlert },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-full w-60 bg-card border-r border-border flex flex-col z-30">
      {/* Brand */}
      <div className="px-5 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Building2 className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground leading-none">Clin</p>
            <p className="text-sm font-bold text-primary leading-none">Sight</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2.5">Patient Intelligence</p>
      </div>

      <Separator />

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
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

      <Separator />

      {/* Footer */}
      <div className="px-5 py-3.5">
        <p className="text-xs text-muted-foreground">hospital_db · 27,891 encounters</p>
      </div>
    </aside>
  );
}
