"use client";
import type { RiskPatient } from "@/lib/types";
import { fmtCurrency } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface Props {
  patients: RiskPatient[];
  total: number;
  onPageChange: (offset: number) => void;
  offset: number;
  limit: number;
}

const CLASS_COLORS: Record<string, string> = {
  inpatient:   "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  emergency:   "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  urgentcare:  "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  outpatient:  "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  ambulatory:  "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  wellness:    "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
};

export function RiskPatientsTable({ patients, total, onPageChange, offset, limit }: Props) {
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {["Patient ID", "Age Group", "Encounter Class", "Encounters", "Readmissions", "Avg Cost", "Insured", "Risk Score"].map((h) => (
                <TableHead key={h} className="text-xs font-semibold uppercase tracking-wide">{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((p) => (
              <TableRow key={p.patient_id}>
                <TableCell className="font-mono text-xs text-muted-foreground">{p.patient_id.slice(0, 8)}…</TableCell>
                <TableCell className="text-sm">{p.age_group}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={CLASS_COLORS[p.encounter_class] ?? ""}
                  >
                    {p.encounter_class}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{p.total_encounters}</TableCell>
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
                      <div
                        className="h-1.5 rounded-full bg-red-500"
                        style={{ width: `${p.risk_score * 100}%` }}
                      />
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
      </div>
      <CardFooter className="px-4 py-3 border-t flex items-center justify-between text-sm text-muted-foreground">
        <span>{total} patients · Page {currentPage} of {totalPages}</span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(0, offset - limit))}
            disabled={offset === 0}
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(offset + limit)}
            disabled={offset + limit >= total}
          >
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
