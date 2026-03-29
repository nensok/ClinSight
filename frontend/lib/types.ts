// ─── KPI Summary ────────────────────────────────────────────────────────────
export interface KpiSummary {
  total_patients: number;
  total_encounters: number;
  total_procedures: number;
  avg_los_hours: number;
  median_los_hours: number;
  avg_los_days_inpatient: number;
  avg_cost: number;
  median_cost: number;
  total_revenue: number;
  total_payer_coverage: number;
  readmission_rate_30d: number;
  insurance_coverage_rate: number;
  avg_out_of_pocket: number;
  date_range: { start: string; end: string };
}

// ─── Admissions Trend ───────────────────────────────────────────────────────
export interface AdmissionsPeriod {
  date?: string;
  week?: string;
  month?: string;
  admissions: number;
  readmissions: number;
  readmission_rate: number;
}

export interface AdmissionsTrendResponse {
  granularity: "daily" | "weekly" | "monthly";
  data: AdmissionsPeriod[];
  meta: { total_admissions: number; date_range: { start: string; end: string } };
}

// ─── LOS Metrics ─────────────────────────────────────────────────────────────
export interface LOSSummary {
  mean: number;
  median: number;
  p25: number;
  p75: number;
  p95: number;
  std: number;
}

export interface LOSBreakdown extends LOSSummary {
  label: string;
  count: number;
}

export interface LOSDistBucket {
  los_range: string;
  count: number;
}

export interface LOSMetricsResponse {
  group_by: string;
  overall_hours: LOSSummary;
  inpatient_days: LOSSummary;
  breakdown: LOSBreakdown[];
  distribution: LOSDistBucket[];
}

// ─── Cost Analysis ───────────────────────────────────────────────────────────
export interface CostSummary {
  mean: number;
  median: number;
  p95: number;
  total: number;
}

export interface CostBreakdown {
  label: string;
  mean: number;
  median: number;
  total: number;
  count: number;
}

export interface TopProcedure {
  code: string;
  name: string;
  avg_cost: number;
  median_cost: number;
  total_cost: number;
  count: number;
}

export interface CostDistBucket {
  range: string;
  count: number;
  pct: number;
}

export interface CostAnalysisResponse {
  group_by: string;
  summary: CostSummary;
  breakdown: CostBreakdown[];
  top_procedures: TopProcedure[];
  distribution_buckets: CostDistBucket[];
}

// ─── Insurance Coverage ──────────────────────────────────────────────────────
export interface InsuranceOverall {
  covered: number;
  uncovered: number;
  coverage_pct: number;
}

export interface InsuranceBreakdown {
  label: string;
  count: number;
  covered: number;
  coverage_pct: number;
  avg_cost: number;
  avg_out_of_pocket?: number;
  avg_coverage_ratio?: number;
}

export interface InsuranceCoverageResponse {
  group_by: string;
  overall: InsuranceOverall;
  breakdown: InsuranceBreakdown[];
}

// ─── Risk Patients ────────────────────────────────────────────────────────────
export interface RiskPatient {
  patient_id: string;
  age: number;
  age_group: string;
  encounter_class: string;
  total_encounters: number;
  readmission_count: number;
  avg_cost: number;
  insurance_covered: boolean;
  risk_score: number;
  reason: string;
}

export interface RiskPatientsResponse {
  total: number;
  offset: number;
  limit: number;
  patients: RiskPatient[];
}
