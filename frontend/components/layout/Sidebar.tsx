"use client";
import { Building2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { NavContent } from "./NavContent";

export function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-full w-60 bg-card border-r border-border flex-col z-30 hidden md:flex">
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
      <NavContent />
      <Separator />

      <div className="px-5 py-3.5">
        <p className="text-xs text-muted-foreground">hospital_db · 27,891 encounters</p>
      </div>
    </aside>
  );
}
