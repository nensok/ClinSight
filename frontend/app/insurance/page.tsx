"use client";
import { useState } from "react";
import { useApi } from "@/lib/hooks/useApi";
import { fetchInsurance } from "@/lib/api";
import { TopBar } from "@/components/layout/TopBar";
import { InsuranceCoverageChart } from "@/components/charts/InsuranceCoverageChart";
import { BreakdownBarChart } from "@/components/charts/BreakdownBarChart";
import { ExportButton } from "@/components/ui/ExportButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { fmtCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type GroupBy = "payer" | "encounter_class";

export default function InsurancePage() {
  const [groupBy, setGroupBy] = useState<GroupBy>("payer");

  const { data, loading, error } = useApi(
    () => fetchInsurance({ group_by: groupBy }),
    [groupBy]
  );

  const coveragePctData = (data?.breakdown ?? []).map((b) => ({
    label: b.label,
    coverage_pct: +(b.coverage_pct ?? 0).toFixed(1),
  }));

  const oopData = (data?.breakdown ?? [])
    .filter((b) => (b.avg_out_of_pocket ?? 0) > 0)
    .map((b) => ({
      label: b.label,
      avg_out_of_pocket: +(b.avg_out_of_pocket ?? 0).toFixed(0),
    }));

  return (
    <>
      <TopBar title="Insurance Insights" subtitle="Coverage rates, payer breakdown, and out-of-pocket costs" />
      <div className="p-6 space-y-6">
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Covered Encounters</p>
                <p className="text-2xl font-bold text-primary">{data.overall.covered.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">{data.overall.coverage_pct.toFixed(1)}% of total</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">No Insurance</p>
                <p className="text-2xl font-bold text-destructive">{data.overall.uncovered.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">{(100 - data.overall.coverage_pct).toFixed(1)}% of total</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Overall Coverage Rate</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{data.overall.coverage_pct.toFixed(1)}%</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Group by:</span>
          {(["payer", "encounter_class"] as GroupBy[]).map((g) => (
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
            <ExportButton endpoint="/api/insurance-coverage" filename="insurance" params={{ group_by: groupBy }} />
          </div>
        </div>

        {loading ? <LoadingSpinner /> : error ? <ErrorMessage message={error} /> : data && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <InsuranceCoverageChart overall={data.overall} />
            <BreakdownBarChart
              data={coveragePctData}
              dataKey="coverage_pct"
              title={`Coverage Rate (%) by ${groupBy.replace("_", " ")}`}
              suffix="%"
              color="#8b5cf6"
            />
            {oopData.length > 0 && (
              <BreakdownBarChart
                data={oopData}
                dataKey="avg_out_of_pocket"
                title="Avg Out-of-Pocket Cost"
                formatter={(v) => fmtCurrency(v)}
                color="#ef4444"
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}
