"use client";
import { useState } from "react";
import type { RiskPatient } from "@/lib/types";
import { fmtCurrency } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardFooter } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  patients: RiskPatient[];
  total: number;
  onPageChange: (offset: number) => void;
  offset: number;
  limit: number;
  sortBy: string;
  order: "asc" | "desc";
  onSort: (col: string) => void;
}

const CLASS_COLORS: Record<string, string> = {
  inpatient:  "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  emergency:  "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  urgentcare: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  outpatient: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  ambulatory: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  wellness:   "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
};

const CONTRIBUTION_LABELS: Record<string, string> = {
  readmission_count: "Readmission history",
  total_encounters:  "High utilisation",
  no_insurance:      "No insurance",
  avg_cost:          "High cost",
  age_factor:        "Age risk",
};

function SortHeader({ col, label, sortBy, order, onSort }: {
  col: string; label: string; sortBy: string; order: "asc" | "desc"; onSort: (c: string) => void;
}) {
  const active = sortBy === col;
  const Icon = active ? (order === "desc" ? ArrowDown : ArrowUp) : ArrowUpDown;
  return (
    <button
      className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide hover:text-foreground transition-colors"
      onClick={() => onSort(col)}
    >
      {label}
      <Icon className={`w-3 h-3 ${active ? "text-primary" : "text-muted-foreground"}`} />
    </button>
  );
}

function ContributionsRow({ contributions }: { contributions: Record<string, number> }) {
  const entries = Object.entries(contributions)
    .filter(([, v]) => v > 0.05)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  if (!entries.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {entries.map(([key, val]) => (
        <TooltipProvider key={key}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1">
                <div className="w-16 bg-muted rounded-full h-1">
                  <div className="h-1 rounded-full bg-amber-500" style={{ width: `${Math.min(val * 100, 100)}%` }} />
                </div>
                <span className="text-xs text-muted-foreground">{CONTRIBUTION_LABELS[key] ?? key}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {(val * 100).toFixed(0)}% contribution to risk
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}

export function RiskPatientsTable({ patients, total, onPageChange, offset, limit, sortBy, order, onSort }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8" />
              <TableHead className="text-xs uppercase tracking-wide">Patient ID</TableHead>
              <TableHead className="text-xs uppercase tracking-wide">Age Group</TableHead>
              <TableHead className="text-xs uppercase tracking-wide">Class</TableHead>
              <TableHead>
                <SortHeader col="total_encounters" label="Encounters" sortBy={sortBy} order={order} onSort={onSort} />
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wide">Readmissions</TableHead>
              <TableHead>
                <SortHeader col="avg_cost" label="Avg Cost" sortBy={sortBy} order={order} onSort={onSort} />
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wide">Insured</TableHead>
              <TableHead>
                <SortHeader col="risk_score" label="Risk Score" sortBy={sortBy} order={order} onSort={onSort} />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((p) => {
              const isExpanded = expanded.has(p.patient_id);
              const hasContributions = p.contributions && Object.keys(p.contributions).length > 0;
              return (
                <>
                  <TableRow key={p.patient_id} className={isExpanded ? "border-b-0" : ""}>
                    <TableCell className="p-1 pl-3">
                      {hasContributions && (
                        <Button
                          variant="ghost" size="icon"
                          className="w-6 h-6"
                          onClick={() => toggleExpand(p.patient_id)}
                        >
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{p.patient_id.slice(0, 8)}…</TableCell>
                    <TableCell className="text-sm">{p.age_group}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={CLASS_COLORS[p.encounter_class] ?? ""}>
                        {p.encounter_class}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-medium">{p.total_encounters}</TableCell>
                    <TableCell className="text-sm">{p.readmission_count}</TableCell>
                    <TableCell className="text-sm">{fmtCurrency(p.avg_cost)}</TableCell>
                    <TableCell>
                      <Badge variant={p.insurance_covered ? "default" : "destructive"}>
                        {p.insurance_covered ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-muted rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-red-500" style={{ width: `${p.risk_score * 100}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                          {(p.risk_score * 100).toFixed(0)}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                  {isExpanded && hasContributions && (
                    <TableRow key={`${p.patient_id}-exp`} className="bg-muted/30 hover:bg-muted/30">
                      <TableCell colSpan={9} className="px-6 py-2">
                        <p className="text-xs font-medium text-muted-foreground mb-1.5">Risk factor contributions</p>
                        <ContributionsRow contributions={p.contributions!} />
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <CardFooter className="px-4 py-3 border-t flex items-center justify-between text-sm text-muted-foreground">
        <span>{total} patients · Page {currentPage} of {totalPages}</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onPageChange(Math.max(0, offset - limit))} disabled={offset === 0}>
            <ChevronLeft className="w-4 h-4" /> Prev
          </Button>
          <Button variant="outline" size="sm" onClick={() => onPageChange(offset + limit)} disabled={offset + limit >= total}>
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
