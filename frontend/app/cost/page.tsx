"use client";
import { useState } from "react";
import { useApi } from "@/lib/hooks/useApi";
import { fetchCost } from "@/lib/api";
import { TopBar } from "@/components/layout/TopBar";
import { CostDistributionChart } from "@/components/charts/CostDistributionChart";
import { BreakdownBarChart } from "@/components/charts/BreakdownBarChart";
import { ExportButton } from "@/components/ui/ExportButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { fmtCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

type GroupBy = "encounter_class" | "payer" | "procedure";

export default function CostPage() {
  const [groupBy, setGroupBy] = useState<GroupBy>("encounter_class");

  const { data, loading, error } = useApi(
    () => fetchCost({ group_by: groupBy }),
    [groupBy]
  );

  const breakdownMean = (data?.breakdown ?? []).map((b) => ({ label: b.label, mean: b.mean }));

  return (
    <>
      <TopBar title="Cost Analysis" subtitle="Claim costs by encounter class, payer, and top procedures" />
      <div className="p-6 space-y-6">
        {data && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Mean Cost",      value: fmtCurrency(data.summary.mean) },
              { label: "Median Cost",    value: fmtCurrency(data.summary.median) },
              { label: "95th Percentile",value: fmtCurrency(data.summary.p95) },
              { label: "Total Revenue",  value: fmtCurrency(data.summary.total, 0) },
            ].map(({ label, value }) => (
              <Card key={label}>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">{label}</p>
                  <p className="text-xl font-bold text-foreground">{value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-muted-foreground">Group by:</span>
          {(["encounter_class", "payer", "procedure"] as GroupBy[]).map((g) => (
            <Button
              key={g}
              variant={groupBy === g ? "default" : "outline"}
              size="sm"
              onClick={() => setGroupBy(g)}
              className="capitalize"
            >
              {g.replace("_", " ")}
            </Button>
          ))}
          <div className="ml-auto">
            <ExportButton endpoint="/api/cost-analysis" filename="cost_analysis" params={{ group_by: groupBy }} />
          </div>
        </div>

        {loading ? <LoadingSpinner /> : error ? <ErrorMessage message={error} /> : data && (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <CostDistributionChart data={data.distribution_buckets} />
              <BreakdownBarChart
                data={breakdownMean}
                dataKey="mean"
                title={`Avg Cost by ${groupBy.replace("_", " ")}`}
                formatter={(v) => fmtCurrency(v)}
                color="#f59e0b"
              />
            </div>

            <Card>
              <CardHeader className="pb-0">
                <CardTitle className="text-sm font-semibold">Top 15 Expensive Procedures</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {["Procedure", "Avg Cost", "Median Cost", "Total Cost", "Volume"].map((h) => (
                        <TableHead key={h} className="text-xs uppercase">{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.top_procedures.map((p, i) => (
                      <TableRow key={i}>
                        <TableCell className="max-w-xs truncate text-sm">{p.name}</TableCell>
                        <TableCell className="font-semibold text-amber-600">{fmtCurrency(p.avg_cost)}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{fmtCurrency(p.median_cost)}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{fmtCurrency(p.total_cost)}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{p.count.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </>
  );
}
