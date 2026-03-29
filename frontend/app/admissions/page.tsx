"use client";
import { useState } from "react";
import { useApi } from "@/lib/hooks/useApi";
import { fetchAdmissions } from "@/lib/api";
import { TopBar } from "@/components/layout/TopBar";
import { AdmissionsTrendChart } from "@/components/charts/AdmissionsTrendChart";
import { ExportButton } from "@/components/ui/ExportButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Granularity = "daily" | "weekly" | "monthly";

export default function AdmissionsPage() {
  const [granularity, setGranularity] = useState<Granularity>("monthly");

  const { data, loading, error } = useApi(
    () => fetchAdmissions({ granularity }),
    [granularity]
  );

  return (
    <>
      <TopBar title="Admissions & Readmissions" subtitle="Encounter volume and 30-day readmission trends" />
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Granularity:</span>
          {(["daily", "weekly", "monthly"] as Granularity[]).map((g) => (
            <Button
              key={g}
              variant={granularity === g ? "default" : "outline"}
              size="sm"
              onClick={() => setGranularity(g)}
              className="capitalize"
            >
              {g}
            </Button>
          ))}
          <div className="ml-auto">
            <ExportButton endpoint="/api/admissions-trend" filename="admissions" params={{ granularity }} />
          </div>
        </div>

        {loading ? <LoadingSpinner /> : error ? <ErrorMessage message={error} /> : data && (
          <>
            <AdmissionsTrendChart data={data.data} granularity={granularity} />
            <Card>
              <CardContent className="px-5 py-4">
                <p className="text-sm font-semibold text-foreground mb-1">Summary</p>
                <p className="text-xs text-muted-foreground">
                  Total encounters: <strong>{data.meta.total_admissions.toLocaleString()}</strong>
                  <Separator orientation="vertical" className="inline-block mx-2 h-3" />
                  Date range: <strong>{data.meta.date_range.start}</strong> → <strong>{data.meta.date_range.end}</strong>
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </>
  );
}
