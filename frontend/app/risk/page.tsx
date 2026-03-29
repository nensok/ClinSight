"use client";
import { useState } from "react";
import { useApi } from "@/lib/hooks/useApi";
import { fetchRiskPatients } from "@/lib/api";
import { TopBar } from "@/components/layout/TopBar";
import { RiskPatientsTable } from "@/components/charts/RiskPatientsTable";
import { ExportButton } from "@/components/ui/ExportButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const AGE_GROUPS = ["Pediatric", "Young Adult", "Middle Age", "Senior", "Elderly"];
const ENC_CLASSES = ["ambulatory", "outpatient", "urgentcare", "emergency", "wellness", "inpatient"];

export default function RiskPage() {
  const [offset, setOffset] = useState(0);
  const [ageGroup, setAgeGroup] = useState("");
  const [encounterClass, setEncounterClass] = useState("");
  const [minRisk, setMinRisk] = useState(0);
  const [sortBy, setSortBy] = useState("risk_score");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const LIMIT = 25;

  const { data, loading, error } = useApi(
    () => fetchRiskPatients({
      limit: LIMIT,
      offset,
      min_risk: minRisk,
      age_group: ageGroup || undefined,
      encounter_class: encounterClass || undefined,
      sort_by: sortBy,
      order,
    }),
    [offset, ageGroup, encounterClass, minRisk, sortBy, order]
  );

  function handleSort(col: string) {
    if (col === sortBy) {
      setOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortBy(col);
      setOrder("desc");
    }
    setOffset(0);
  }

  function resetOffset() {
    setOffset(0);
  }

  return (
    <>
      <TopBar title="Risk Patients" subtitle="Top 200 patients by predicted readmission risk score" />
      <div className="p-6 space-y-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground whitespace-nowrap">Age Group</Label>
                <Select value={ageGroup || "all"} onValueChange={(v) => { setAgeGroup(v === "all" ? "" : v); resetOffset(); }}>
                  <SelectTrigger className="w-36 h-8 text-sm">
                    <SelectValue placeholder="All ages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All ages</SelectItem>
                    {AGE_GROUPS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground whitespace-nowrap">Encounter Class</Label>
                <Select value={encounterClass || "all"} onValueChange={(v) => { setEncounterClass(v === "all" ? "" : v); resetOffset(); }}>
                  <SelectTrigger className="w-36 h-8 text-sm">
                    <SelectValue placeholder="All classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All classes</SelectItem>
                    {ENC_CLASSES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3">
                <Label className="text-xs text-muted-foreground whitespace-nowrap">
                  Min Risk: {(minRisk * 100).toFixed(0)}%
                </Label>
                <Slider
                  min={0} max={1} step={0.05}
                  value={[minRisk]}
                  onValueChange={([v]) => { setMinRisk(v); resetOffset(); }}
                  className="w-28"
                />
              </div>

              <div className="ml-auto">
                <ExportButton endpoint="/api/risk-patients" filename="risk_patients" params={{ min_risk: minRisk, limit: 200 }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {loading ? <LoadingSpinner /> : error ? <ErrorMessage message={error} /> : data && (
          <RiskPatientsTable
            patients={data.patients}
            total={data.total}
            offset={offset}
            limit={LIMIT}
            onPageChange={setOffset}
            sortBy={sortBy}
            order={order}
            onSort={handleSort}
          />
        )}
      </div>
    </>
  );
}
