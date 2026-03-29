"use client";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { useApi } from "@/lib/hooks/useApi";
import { fetchAdmissions } from "@/lib/api";
import { TopBar } from "@/components/layout/TopBar";
import { AdmissionsTrendChart } from "@/components/charts/AdmissionsTrendChart";
import { ExportButton } from "@/components/ui/ExportButton";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Granularity = "daily" | "weekly" | "monthly";

export default function AdmissionsPage() {
  const [granularity, setGranularity] = useState<Granularity>("monthly");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const startDate = dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined;
  const endDate   = dateRange?.to   ? format(dateRange.to,   "yyyy-MM-dd") : undefined;

  const { data, loading, error } = useApi(
    () => fetchAdmissions({ granularity, start_date: startDate, end_date: endDate }),
    [granularity, startDate, endDate]
  );

  return (
    <>
      <TopBar title="Admissions & Readmissions" subtitle="Encounter volume and 30-day readmission trends" />
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-muted-foreground">Granularity:</span>
          {(["daily", "weekly", "monthly"] as Granularity[]).map((g) => (
            <Button key={g} variant={granularity === g ? "default" : "outline"} size="sm"
              onClick={() => setGranularity(g)} className="capitalize">{g}</Button>
          ))}
          <Separator orientation="vertical" className="h-6" />
          <DateRangePicker date={dateRange} onDateChange={setDateRange} />
          <div className="ml-auto">
            <ExportButton endpoint="/api/admissions-trend" filename="admissions"
              params={{ granularity, start_date: startDate, end_date: endDate }} />
          </div>
        </div>

        {loading ? <LoadingSpinner /> : error ? <ErrorMessage message={error} /> : data && (
          <>
            <AdmissionsTrendChart data={data.data} granularity={granularity} />
            <Card>
              <CardContent className="px-5 py-4">
                <p className="text-sm font-semibold text-foreground mb-1">Summary</p>
                <p className="text-xs text-muted-foreground">
                  Showing <strong>{data.data.length}</strong> {granularity} periods ·
                  Total encounters: <strong>{data.meta.total_admissions.toLocaleString()}</strong>
                  {dateRange?.from && <span> · Filtered: <strong>{startDate}</strong> → <strong>{endDate ?? "present"}</strong></span>}
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </>
  );
}
