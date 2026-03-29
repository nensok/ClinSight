import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Sidebar } from "@/components/layout/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hospital Analytics Dashboard",
  description: "Patient intelligence powered by real hospital data.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1 ml-60 min-w-0 bg-muted/30">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
