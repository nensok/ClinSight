"use client";
import { useState } from "react";
import { Menu, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { NavContent } from "./NavContent";

export function MobileMenuButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
      >
        <Menu className="w-5 h-5" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-60 p-0 flex flex-col">
          <SheetHeader className="px-5 py-5">
            <SheetTitle asChild>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-foreground leading-none">Clin</p>
                  <p className="text-sm font-bold text-primary leading-none">Sight</p>
                </div>
              </div>
            </SheetTitle>
            <p className="text-xs text-muted-foreground text-left">Patient Intelligence</p>
          </SheetHeader>
          <Separator />
          <NavContent onNavigate={() => setOpen(false)} />
          <Separator />
          <div className="px-5 py-3.5">
            <p className="text-xs text-muted-foreground">hospital_db · 27,891 encounters</p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
