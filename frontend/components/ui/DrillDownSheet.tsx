"use client";
import { useApi } from "@/lib/hooks/useApi";
import { fetchRiskPatients } from "@/lib/api";
import { fmtCurrency } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Props {
  open: boolean;
  onClose: () => void;
  filterLabel: string;
  filterKey: "encounter_class" | "age_group";
}

export function DrillDownSheet({ open, onClose, filterLabel, filterKey }: Props) {
  const { data, loading, error } = useApi(
    () => fetchRiskPatients({
      limit: 50,
      offset: 0,
      encounter_class: filterKey === "encounter_class" ? filterLabel : undefined,
      age_group: filterKey === "age_group" ? filterLabel : undefined,
      sort_by: "risk_score",
      order: "desc",
    }),
    [open, filterLabel, filterKey]
  );

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="capitalize">{filterLabel} — Top Risk Patients</SheetTitle>
          <SheetDescription>
            Showing up to 50 highest-risk patients in this group, sorted by risk score.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="p-6 space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          )}
          {error && (
            <div className="p-6 flex items-center gap-2 text-destructive">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
          {data && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs uppercase">Patient ID</TableHead>
                  <TableHead className="text-xs uppercase">Age Group</TableHead>
                  <TableHead className="text-xs uppercase">Encounters</TableHead>
                  <TableHead className="text-xs uppercase">Avg Cost</TableHead>
                  <TableHead className="text-xs uppercase">Risk</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.patients.map((p) => (
                  <TableRow key={p.patient_id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {p.patient_id.slice(0, 8)}…
                    </TableCell>
                    <TableCell className="text-sm">{p.age_group}</TableCell>
                    <TableCell className="text-sm">{p.total_encounters}</TableCell>
                    <TableCell className="text-sm">{fmtCurrency(p.avg_cost)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 bg-muted rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-red-500" style={{ width: `${p.risk_score * 100}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                          {(p.risk_score * 100).toFixed(0)}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {data && data.patients.length === 0 && (
            <div className="p-6 text-center text-muted-foreground text-sm">
              No patients found for this filter.
            </div>
          )}
        </div>

        {data && (
          <div className="px-6 py-3 border-t text-xs text-muted-foreground">
            {data.total} patients total in this group
            {data.total > 50 && ` · showing top 50`}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
