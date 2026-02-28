"use client";

import { RefreshCw } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

// --- Shared table components ---

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded border border-gray-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-brand-brandBlue text-center uppercase tracking-wide">
          {title}
        </h3>
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap border-b border-gray-200 bg-brand-lightGrey">
      {children}
    </th>
  );
}

function Td({
  children,
  highlight,
  right,
}: {
  children: React.ReactNode;
  highlight?: boolean;
  right?: boolean;
}) {
  return (
    <td
      className={`px-4 py-2.5 text-sm border-b border-gray-100 ${
        highlight ? "text-brand-brandBlue font-semibold" : "text-gray-700"
      } ${right ? "text-right" : ""}`}
    >
      {children}
    </td>
  );
}

// --- Ad Metric Overview data ---
const adMetricRows = [
  { name: "SPEND",         accTotal: "$91.6K",    accUS: "$88.7K",    benchmark: "$126.4K",  pct: "-29.80%" },
  { name: "CPM",           accTotal: "$36.5",     accUS: "$37.2",     benchmark: "$28.4",    pct: "30.99%"  },
  { name: "IMPRESSIONS",   accTotal: "2,510,200", accUS: "2,386,127", benchmark: "4,452,825", pct: "-46.41%" },
  { name: "CLICKS",        accTotal: "83,088",    accUS: "79,903",    benchmark: "124,637",  pct: "-35.89%" },
  { name: "CTR (%)",       accTotal: "3%",        accUS: "3%",        benchmark: "3%",       pct: "19.64%"  },
  { name: "PURCHASES",     accTotal: "625",       accUS: "614",       benchmark: "1,070",    pct: "-42.62%" },
  { name: "CPA",           accTotal: "$146.5",    accUS: "$144.5",    benchmark: "$118.1",   pct: "22.33%"  },
  { name: "CVR",           accTotal: "0.75%",     accUS: "0.77%",     benchmark: "0.86%",    pct: "-10.50%" },
  { name: "AOV",           accTotal: "191.75",    accUS: "192.04",    benchmark: "190.92",   pct: "0.59%"   },
  { name: "REVENUE",       accTotal: "$119.8K",   accUS: "$117.9K",   benchmark: "$204.3K",  pct: "-42.28%" },
  { name: "ROAS",          accTotal: "1.31",      accUS: "1.33",      benchmark: "1.62",     pct: "-17.77%" },
  { name: "Allowable CPC", accTotal: "$144.24",   accUS: "$147.57",   benchmark: "$163.9",   pct: "-9.97%"  },
];

// --- Funnel Performance data ---
const funnelRows = [
  { name: "Impressions",        impConv: "2,510,200", metricName: "% of US traffic", cvr: "0.97%",  bench: "0.00%", diff: "0.00%" },
  { name: "Clicks",             impConv: "83,088",    metricName: "CTR",              cvr: "0.03%",  bench: "0.00%", diff: "0.00%" },
  { name: "Landing Page",       impConv: "0",         metricName: "LP to Click Df.",  cvr: "0.00%",  bench: "0.00%", diff: "0.00%" },
  { name: "Plays (Estimated)",  impConv: "0",         metricName: "Play rate",        cvr: "0.00%",  bench: "0.00%", diff: "0.00%" },
  { name: "OPV",                impConv: "0",         metricName: "Click to checkout",cvr: "0.00%",  bench: "0.00%", diff: "0.00%" },
  { name: "Purchases",          impConv: "625",       metricName: "Checkout CVR",     cvr: "0.00%",  bench: "0.00%", diff: "0.00%" },
];

// --- CPC Calculator data ---
const cpcCalcRows = [
  { metric1: "AOV",   val1: "191.75", metric2: "aCPC (ROAS)",    val2: "$0.90" },
  { metric1: "CVR",   val1: "75%",    metric2: "aCPC (simROAS)", val2: "$0.00" },
  { metric1: "tROAS", val1: "160%",   metric2: "aCPC (CPA)",     val2: "$0.00" },
  { metric1: "tCPA",  val1: "",       metric2: "simROAS",        val2: "0"     },
];

// --- CTA Analysis data ---
const ctaRows = [
  { name: "Reveal time",              yourFunnel: "0",     benchmark: "0",     diff: "" },
  { name: "% Viewers from Time Zero", yourFunnel: "0.00%", benchmark: "0.00%", diff: "0.00%" },
  { name: "Reveal time users",        yourFunnel: "0",     benchmark: "0",     diff: "0.00%" },
  { name: "OPV",                      yourFunnel: "0",     benchmark: "0",     diff: "0.00%" },
  { name: "% Reveal Time CTR",        yourFunnel: "0.00%", benchmark: "0.00%", diff: "0.00%" },
  { name: "% Reveal Time CVR",        yourFunnel: "0.00%", benchmark: "0.00%", diff: "0.00%" },
];

// --- VSL Performance data ---
const vslRows = [
  { name: "(0 seconds)", yourFunnel: "100.00%", benchmark: "",      diff: "" },
  { name: "30s",         yourFunnel: "0.00%",   benchmark: "0.00%", diff: "0.00%" },
  { name: "60s",         yourFunnel: "0.00%",   benchmark: "0.00%", diff: "0.00%" },
  { name: "2m",          yourFunnel: "0.00%",   benchmark: "0.00%", diff: "0.00%" },
  { name: "5m",          yourFunnel: "0.00%",   benchmark: "0.00%", diff: "0.00%" },
  { name: "10m",         yourFunnel: "0.00%",   benchmark: "0.00%", diff: "0.00%" },
  { name: "20m",         yourFunnel: "0.00%",   benchmark: "0.00%", diff: "0.00%" },
  { name: "30m",         yourFunnel: "0.00%",   benchmark: "0.00%", diff: "0.00%" },
  { name: "40m",         yourFunnel: "0.00%",   benchmark: "0.00%", diff: "0.00%" },
];

export default function FunnelAnalysisPage() {
  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Filters */}
        <div className="bg-white rounded border border-gray-200 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-end gap-3 lg:gap-4">
            <div className="flex flex-col gap-1">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</div>
              <select className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-brandBlue">
                <option>[D] Emma 12</option>
                <option>All Accounts</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Platform</div>
              <select className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-brandBlue">
                <option>Facebook</option>
                <option>Google</option>
                <option>TikTok</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date Range</div>
              <input
                type="text"
                defaultValue="2026-02-20 to 2026-02-26"
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-brandBlue"
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Calendar Range</div>
              <select className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-brandBlue">
                <option>Last 7 Days</option>
                <option>Last Month</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <button className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-brand-lightBlue hover:bg-brand-brandBlue text-white transition-colors">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Top row: Ad Metric Overview + Funnel Performance / CPC Calculator */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Ad Metric Overview */}
          <SectionCard title="Ad Metric Overview — [Platform]">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <Th>Name</Th>
                  <Th>Account Total</Th>
                  <Th>Account US Only</Th>
                  <Th>Benchmark US</Th>
                  <Th>Percentage</Th>
                </tr>
              </thead>
              <tbody>
                {adMetricRows.map((row) => {
                  const neg = row.pct.startsWith("-");
                  return (
                    <tr key={row.name} className="hover:bg-brand-lightGrey transition-colors">
                      <Td>{row.name}</Td>
                      <Td right>{row.accTotal}</Td>
                      <Td right>{row.accUS}</Td>
                      <Td right highlight>{row.benchmark}</Td>
                      <td
                        className={`px-4 py-2.5 text-sm text-right border-b border-gray-100 font-medium ${
                          neg ? "text-brand-accentRed" : "text-green-600"
                        }`}
                      >
                        {row.pct}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </SectionCard>

          {/* Right column: Funnel Performance + CPC Calculator */}
          <div className="space-y-6">
            {/* Funnel Performance */}
            <SectionCard title="Funnel Performance">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <Th>Name</Th>
                    <Th>Impressions / Conversions</Th>
                    <Th>Metric Name</Th>
                    <Th>Conversion Rate</Th>
                    <Th>Benchmark</Th>
                    <Th>% Difference to Benchmark</Th>
                  </tr>
                </thead>
                <tbody>
                  {funnelRows.map((row) => (
                    <tr key={row.name} className="hover:bg-brand-lightGrey transition-colors">
                      <Td>{row.name}</Td>
                      <Td right>{row.impConv}</Td>
                      <Td>{row.metricName}</Td>
                      <Td right>{row.cvr}</Td>
                      <Td right>{row.bench}</Td>
                      <Td right>{row.diff}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </SectionCard>

            {/* Allowable CPC Calculator */}
            <SectionCard title="Allowable CPC calculator">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <Th>Metric</Th>
                    <Th>Calculated Value</Th>
                    <Th>Metric</Th>
                    <Th>Calculated Value</Th>
                  </tr>
                </thead>
                <tbody>
                  {cpcCalcRows.map((row) => (
                    <tr key={row.metric1} className="hover:bg-brand-lightGrey transition-colors">
                      <Td>{row.metric1}</Td>
                      <Td right>{row.val1}</Td>
                      <Td>{row.metric2}</Td>
                      <Td right>{row.val2}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </SectionCard>
          </div>
        </div>

        {/* Bottom row: CTA Analysis + VSL Performance */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* CTA Analysis */}
          <SectionCard title="CTA Analysis">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <Th>Name</Th>
                  <Th>Your Funnel</Th>
                  <Th>Benchmark</Th>
                  <Th>% Difference to Benchmark</Th>
                </tr>
              </thead>
              <tbody>
                {ctaRows.map((row) => (
                  <tr key={row.name} className="hover:bg-brand-lightGrey transition-colors">
                    <Td>{row.name}</Td>
                    <Td right>{row.yourFunnel}</Td>
                    <Td right>{row.benchmark}</Td>
                    <Td right>{row.diff}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>

          {/* VSL Performance */}
          <SectionCard title="VSL Performance">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <Th>Name</Th>
                  <Th>Your Funnel</Th>
                  <Th>Benchmark</Th>
                  <Th>% Difference to Benchmark</Th>
                </tr>
              </thead>
              <tbody>
                {vslRows.map((row) => (
                  <tr key={row.name} className="hover:bg-brand-lightGrey transition-colors">
                    <Td>{row.name}</Td>
                    <Td right>{row.yourFunnel}</Td>
                    <Td right>{row.benchmark}</Td>
                    <Td right>{row.diff}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
