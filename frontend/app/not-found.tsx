import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 text-center p-6">
      <FileQuestion className="w-16 h-16 text-muted-foreground" />
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
        <p className="text-lg text-muted-foreground">Page not found</p>
      </div>
      <Button asChild>
        <Link href="/">Return to Overview</Link>
      </Button>
    </div>
  );
}
