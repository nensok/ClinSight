"use client";
import { useApi } from "@/lib/hooks/useApi";
import { fetchKpi, fetchAdmissions, fetchLOS, fetchCost, fetchInsurance } from "@/lib/api";
import { TopBar } from "@/components/layout/TopBar";
import { KpiCard } from "@/components/ui/KpiCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { AdmissionsTrendChart } from "@/components/charts/AdmissionsTrendChart";
import { InsuranceCoverageChart } from "@/components/charts/InsuranceCoverageChart";
import { LOSDistributionChart } from "@/components/charts/LOSDistributionChart";
import { CostDistributionChart } from "@/components/charts/CostDistributionChart";
import { Users, Clock, DollarSign, RefreshCw, Shield } from "lucide-react";

export default function OverviewPage() {
  const kpi       = useApi(() => fetchKpi());
  const admissions = useApi(() => fetchAdmissions({ granularity: "monthly" }));
  const los       = useApi(() => fetchLOS());
  const cost      = useApi(() => fetchCost());
  const insurance = useApi(() => fetchInsurance());

  return (
    <>
      <TopBar
        title="Overview Dashboard"
        subtitle={kpi.data ? `${kpi.data.date_range.start} → ${kpi.data.date_range.end}` : undefined}
      />
      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        {kpi.loading ? <LoadingSpinner label="Loading KPIs..." /> : kpi.error ? <ErrorMessage message={kpi.error} /> : kpi.data && (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            <KpiCard title="Total Patients" value={kpi.data.total_patients} icon={Users} color="blue"
              subtitle={`${kpi.data.total_encounters.toLocaleString()} encounters`} />
            <KpiCard title="Avg LOS" value={kpi.data.avg_los_hours} suffix="h" decimals={1} icon={Clock} color="green"
              subtitle={`Inpatient: ${kpi.data.avg_los_days_inpatient.toFixed(1)} days`} />
            <KpiCard title="Avg Cost" value={kpi.data.avg_cost} prefix="$" decimals={0} icon={DollarSign} color="yellow"
              subtitle={`Median: $${kpi.data.median_cost.toFixed(0)}`} />
            <KpiCard title="Readmission Rate" value={kpi.data.readmission_rate_30d * 100} suffix="%" decimals={1} icon={RefreshCw} color="red"
              subtitle="30-day readmission" />
            <KpiCard title="Insurance Coverage" value={kpi.data.insurance_coverage_rate * 100} suffix="%" decimals={1} icon={Shield} color="purple"
              subtitle={`Avg OOP: $${kpi.data.avg_out_of_pocket.toFixed(0)}`} />
          </div>
        )}

        {/* Row 1 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2">
            {admissions.loading ? <LoadingSpinner /> : admissions.error ? <ErrorMessage message={admissions.error} /> : admissions.data && (
              <AdmissionsTrendChart data={admissions.data.data} granularity="monthly" />
            )}
          </div>
          <div>
            {insurance.loading ? <LoadingSpinner /> : insurance.error ? <ErrorMessage message={insurance.error} /> : insurance.data && (
              <InsuranceCoverageChart overall={insurance.data.overall} />
            )}
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div>
            {los.loading ? <LoadingSpinner /> : los.error ? <ErrorMessage message={los.error} /> : los.data && (
              <LOSDistributionChart data={los.data.distribution} />
            )}
          </div>
          <div>
            {cost.loading ? <LoadingSpinner /> : cost.error ? <ErrorMessage message={cost.error} /> : cost.data && (
              <CostDistributionChart data={cost.data.distribution_buckets} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
