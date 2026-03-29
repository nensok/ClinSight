"use client";
import { useState } from "react";
import { useApi } from "@/lib/hooks/useApi";
import { fetchLOS } from "@/lib/api";
import { TopBar } from "@/components/layout/TopBar";
import { LOSDistributionChart } from "@/components/charts/LOSDistributionChart";
import { BreakdownBarChart } from "@/components/charts/BreakdownBarChart";
import { ExportButton } from "@/components/ui/ExportButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type GroupBy = "encounter_class" | "reason" | "overall";

export default function LOSPage() {
  const [groupBy, setGroupBy] = useState<GroupBy>("encounter_class");

  const { data, loading, error } = useApi(
    () => fetchLOS({ group_by: groupBy }),
    [groupBy]
  );

  const breakdownData = (data?.breakdown ?? []).map((b) => ({
    label: b.label,
    mean_hours: +(b.mean ?? 0).toFixed(1),
    median_hours: +(b.median ?? 0).toFixed(1),
  }));

  return (
    <>
      <TopBar title="Length of Stay" subtitle="LOS in hours (all classes) and days (inpatient only)" />
      <div className="p-6 space-y-6">
        {data && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Avg LOS (all)",       value: `${data.overall_hours.mean.toFixed(1)}h` },
              { label: "Median LOS (all)",     value: `${data.overall_hours.median.toFixed(1)}h` },
              { label: "Avg LOS (inpatient)",  value: `${data.inpatient_days.mean.toFixed(1)}d` },
              { label: "P95 LOS (inpatient)",  value: `${data.inpatient_days.p95.toFixed(1)}d` },
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
          {(["encounter_class", "reason", "overall"] as GroupBy[]).map((g) => (
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
            <ExportButton endpoint="/api/los-metrics" filename="los_metrics" params={{ group_by: groupBy }} />
          </div>
        </div>

        {loading ? <LoadingSpinner /> : error ? <ErrorMessage message={error} /> : data && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <LOSDistributionChart data={data.distribution} />
            {breakdownData.length > 0 && (
              <BreakdownBarChart
                data={breakdownData}
                dataKey="mean_hours"
                title={`Avg LOS (hours) by ${groupBy.replace("_", " ")}`}
                suffix="h"
                color="#10b981"
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}
