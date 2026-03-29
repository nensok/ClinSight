import type {
  KpiSummary,
  AdmissionsTrendResponse,
  LOSMetricsResponse,
  CostAnalysisResponse,
  InsuranceCoverageResponse,
  RiskPatientsResponse,
} from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function get<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const url = new URL(`${BASE}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    });
  }
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? "API error");
  }
  return res.json();
}

export const fetchKpi = (): Promise<KpiSummary> =>
  get("/api/kpi-summary");

export const fetchAdmissions = (
  params: { granularity?: string; start_date?: string; end_date?: string; encounter_class?: string } = {}
): Promise<AdmissionsTrendResponse> => get("/api/admissions-trend", params);

export const fetchLOS = (
  params: { group_by?: string; encounter_class?: string } = {}
): Promise<LOSMetricsResponse> => get("/api/los-metrics", params);

export const fetchCost = (
  params: { group_by?: string; encounter_class?: string; payer?: string; top_n?: number } = {}
): Promise<CostAnalysisResponse> => get("/api/cost-analysis", params);

export const fetchInsurance = (
  params: { group_by?: string } = {}
): Promise<InsuranceCoverageResponse> => get("/api/insurance-coverage", params);

export const fetchRiskPatients = (
  params: {
    limit?: number;
    offset?: number;
    min_risk?: number;
    encounter_class?: string;
    age_group?: string;
    sort_by?: string;
    order?: string;
  } = {}
): Promise<RiskPatientsResponse> => get("/api/risk-patients", params);
