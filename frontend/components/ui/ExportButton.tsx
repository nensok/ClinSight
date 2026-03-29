"use client";
import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Props {
  endpoint: string;
  filename?: string;
  params?: Record<string, string | number | undefined>;
}

function jsonToCsv(data: unknown[]): string {
  if (!data.length) return "";
  const keys = Object.keys(data[0] as object);
  const rows = data.map((row) =>
    keys.map((k) => {
      const v = (row as Record<string, unknown>)[k];
      const s = v === null || v === undefined ? "" : String(v);
      return s.includes(",") || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
    }).join(",")
  );
  return [keys.join(","), ...rows].join("\n");
}

export function ExportButton({ endpoint, filename = "export", params }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
      const url = new URL(`${base}${endpoint}`);
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined) url.searchParams.set(k, String(v));
        });
      }
      url.searchParams.set("limit", "200");
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const rows = Array.isArray(json) ? json : json.data ?? json.patients ?? json.breakdown ?? [json];
      if (!rows.length) {
        toast.warning("No data to export");
        return;
      }
      const csv = jsonToCsv(rows);
      const blob = new Blob([csv], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      const dateStr = new Date().toISOString().slice(0, 10);
      link.download = `${filename}_${dateStr}.csv`;
      link.click();
      toast.success(`Exported ${rows.length} rows to ${filename}_${dateStr}.csv`);
    } catch (err) {
      toast.error(`Export failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={loading}>
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      Export CSV
    </Button>
  );
}
