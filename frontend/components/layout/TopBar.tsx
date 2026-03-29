import { ThemeToggle } from "./ThemeToggle";
import { Separator } from "@/components/ui/separator";

interface Props {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: Props) {
  return (
    <>
      <header className="sticky top-0 z-20 bg-background/90 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <ThemeToggle />
      </header>
      <Separator />
    </>
  );
}
