"use client";

import { useState, useMemo } from "react";
import { RefreshCw } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

// ─── Constants ────────────────────────────────────────────────────────────────

const DAY_LABELS = ["1 Sunday", "2 Monday", "3 Tuesday", "4 Wednesday", "5 Thursday", "6 Friday", "7 Saturday"];

const ACCOUNTS = [
  "[D] Emma 12",
  "Account 1 (Cal)",
  "Account 2 (Cal)",
  "Account 3",
  "NeuroGenica",
  "Ancestral Supplements",
  "Paw Origins",
  "Simple Blood Sugar",
  "AB Amino",
  "Vision Hero",
];

const CALENDAR_RANGES = ["Yesterday", "Last 7 Days", "Last 14 Days", "Last 30 Days", "Last Month", "Custom"];

// ─── Mock Data (spend[day][hour], roas[day][hour] as %) ───────────────────────

const spendData: number[][] = [
  // Sunday
  [174.52,113.39,87.90,108.57,189.00,171.79,629.19,2239.35,3356.15,3719.14,3660.09,3190.58,2762.76,2492.33,2403.62,1703.76,1789.54,1013.00,689.73,736.19,723.65,822.96,566.56,390.84],
  // Monday
  [374.79,184.90,165.67,146.93,220.18,332.43,280.13,1928.74,1861.30,2081.58,2146.64,1865.07,1870.58,1781.43,1963.98,1142.48,993.63,828.29,584.29,567.82,555.38,454.24,359.58,196.90],
  // Tuesday
  [178.01,127.64,114.24,133.40,160.56,300.23,1468.02,2062.89,2557.99,2404.05,2464.95,2035.59,1724.50,1725.98,1917.50,1566.18,697.35,633.23,775.68,373.50,429.65,352.74,289.87,243.56],
  // Wednesday
  [371.51,196.62,376.96,299.48,95.87,161.34,1468.02,1820.09,2508.08,2840.09,2820.88,2198.26,1892.49,1889.28,1723.64,1031.22,924.44,936.77,676.48,676.45,630.19,629.93,429.07,262.45],
  // Thursday
  [198.17,141.59,111.58,110.38,145.50,254.72,1223.50,2285.86,2938.37,3212.42,3985.53,2738.74,2570.09,1986.93,1801.87,1160.78,959.06,812.26,595.52,602.49,515.48,431.61,290.38,249.56],
  // Friday
  [225.89,169.61,125.03,107.79,140.44,250.39,806.87,1644.56,2392.06,2605.45,2322.56,2076.17,1735.88,1502.76,1395.12,866.23,785.44,683.95,378.39,381.29,314.24,292.36,198.91,149.32],
  // Saturday
  [316.40,203.57,155.30,139.78,170.18,265.32,592.42,1659.06,3021.69,4315.68,4246.49,3509.54,3002.33,2650.67,2417.43,1269.28,879.58,700.38,449.62,468.02,457.76,452.57,527.62,392.39],
];

const roasData: number[][] = [
  // Sunday
  [1103,447,0,188,268,212,57,90,78,257,259,322,510,396,271,298,332,293,467,111,370,287,330,660],
  // Monday
  [336,473,271,0,0,90,0,147,152,302,201,387,259,329,267,403,491,434,379,498,178,127,172,18],
  // Tuesday
  [136,519,1343,0,48,143,0,177,208,363,281,316,227,148,312,445,639,278,279,298,674,127,87,195],
  // Wednesday
  [0,312,18,0,1116,58,39,150,199,282,343,256,405,212,262,239,357,317,192,177,255,113,374,336],
  // Thursday
  [0,373,0,375,0,0,8,135,95,268,390,334,274,297,209,280,71,352,395,292,447,74,397,537],
  // Friday
  [86,288,0,0,0,0,0,27,221,115,302,314,398,281,142,263,109,289,1064,639,199,82,445,322],
  // Saturday
  [204,182,61,119,0,0,0,62,163,195,209,276,359,306,303,634,665,192,0,960,488,155,628,396],
];

// CPA derived: assume AOV = $150; CPA = AOV * 100 / ROAS (when ROAS > 0)
const cpaData: number[][] = roasData.map((dayR) =>
  dayR.map((roas) =>
    roas > 0 ? Math.round((150 * 100) / roas * 100) / 100 : 0
  )
);

// ─── Colour helper ────────────────────────────────────────────────────────────

function heatRgb(ratio: number): string {
  // 0 → red, 0.5 → yellow, 1 → green
  const r = ratio <= 0.5 ? 255 : Math.round((1 - (ratio - 0.5) * 2) * 255);
  const g = ratio <= 0.5 ? Math.round(ratio * 2 * 210) : 210;
  return `rgb(${r},${g},0)`;
}

// ─── Bar-within-cell component ────────────────────────────────────────────────

function Cell({
  val,
  globalMax,
  invert = false,
  label,
  bold = false,
}: {
  val: number;
  globalMax: number;
  invert?: boolean;
  label: string;
  bold?: boolean;
}) {
  const ratio = globalMax > 0 ? Math.min(val / globalMax, 1) : 0;
  const barColor = ratio > 0 ? heatRgb(invert ? 1 - ratio : ratio) : "transparent";

  return (
    <td
      className="relative border border-gray-200 whitespace-nowrap"
      style={{ minWidth: 84 }}
    >
      {ratio > 0 && (
        <div
          className="absolute left-0 top-0 bottom-0 opacity-60"
          style={{ width: `${ratio * 100}%`, backgroundColor: barColor }}
        />
      )}
      <span
        className={`relative z-10 px-2 py-1.5 block text-right text-xs ${bold ? "font-bold text-gray-800" : "font-medium text-gray-700"}`}
      >
        {label}
      </span>
    </td>
  );
}

// ─── Formatting ───────────────────────────────────────────────────────────────

function fmtSpend(n: number) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtMetric(n: number, field: "roas" | "cpa") {
  if (field === "roas") return n.toFixed(2) + "%";
  return n > 0 ? "$" + n.toFixed(2) : "$0.00";
}

// ─── Chart component (SVG dual-axis) ─────────────────────────────────────────

function HourlyChart({ hourlySpend, hourlyMetric, metricLabel }: {
  hourlySpend: number[];
  hourlyMetric: number[];
  metricLabel: string;
}) {
  const W = 880, H = 240, ML = 68, MR = 58, MT = 20, MB = 38;
  const plotW = W - ML - MR;
  const plotH = H - MT - MB;

  const maxSpend = Math.max(...hourlySpend, 1);
  const maxMetric = Math.max(...hourlyMetric.filter(v => v > 0), 1);

  const spendStep = Math.ceil(maxSpend / 6 / 200) * 200;
  const spendTicks = Array.from({ length: 7 }, (_, i) => i * spendStep).filter(v => v <= maxSpend * 1.1);
  const metricStep = Math.ceil(maxMetric / 5 / 0.5) * 0.5;
  const metricTicks = Array.from({ length: 6 }, (_, i) => parseFloat((i * metricStep).toFixed(1)));

  const xOf = (h: number) => ML + (h + 0.5) * (plotW / 24);
  const ySpend = (v: number) => MT + plotH * (1 - v / (spendTicks[spendTicks.length - 1] || 1));
  const yMetric = (v: number) => MT + plotH * (1 - v / (metricTicks[metricTicks.length - 1] || 1));

  const barW = (plotW / 24) * 0.65;
  const linePts = hourlyMetric.map((v, h) => `${xOf(h)},${yMetric(v)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H + 16}`} className="w-full" style={{ minHeight: 260 }}>
      {spendTicks.map(v => (
        <line key={v} x1={ML} y1={ySpend(v)} x2={W - MR} y2={ySpend(v)} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 3" />
      ))}
      {hourlySpend.map((v, h) => {
        const barH = plotH * (v / (spendTicks[spendTicks.length - 1] || 1));
        return (
          <rect key={h} x={xOf(h) - barW / 2} y={MT + plotH - barH} width={barW} height={barH} fill="#60a5fa" rx="2" />
        );
      })}
      <polyline points={linePts} fill="none" stroke="#f87171" strokeWidth="2" />
      {hourlyMetric.map((v, h) => (
        <circle key={h} cx={xOf(h)} cy={yMetric(v)} r="3.5" fill="white" stroke="#f87171" strokeWidth="1.5" />
      ))}
      {Array.from({ length: 24 }, (_, h) => (
        <text key={h} x={xOf(h)} y={H + 12} textAnchor="middle" fontSize="9" fill="#9ca3af">{h}</text>
      ))}
      {spendTicks.map(v => (
        <text key={v} x={ML - 6} y={ySpend(v) + 4} textAnchor="end" fontSize="9" fill="#9ca3af">
          {v >= 1000 ? `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k` : v}
        </text>
      ))}
      {metricTicks.map(v => (
        <text key={v} x={W - MR + 6} y={yMetric(v) + 4} textAnchor="start" fontSize="9" fill="#9ca3af">
          {v.toFixed(1)}
        </text>
      ))}
      <line x1={ML} y1={MT} x2={ML} y2={MT + plotH} stroke="#d1d5db" strokeWidth="1" />
      <line x1={W - MR} y1={MT} x2={W - MR} y2={MT + plotH} stroke="#d1d5db" strokeWidth="1" />
      <line x1={ML} y1={MT + plotH} x2={W - MR} y2={MT + plotH} stroke="#d1d5db" strokeWidth="1" />
      <line x1={W / 2 - 70} y1={8} x2={W / 2 - 50} y2={8} stroke="#f87171" strokeWidth="2" strokeDasharray="4 3" />
      <circle cx={W / 2 - 60} cy={8} r="3" fill="white" stroke="#f87171" strokeWidth="1.5" />
      <text x={W / 2 - 44} y={12} fontSize="10" fill="#6b7280">{metricLabel}</text>
      <rect x={W / 2 + 10} y={2} width={14} height={10} fill="#60a5fa" rx="1" />
      <text x={W / 2 + 28} y={12} fontSize="10" fill="#6b7280">Spend</text>
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HourlyReportPage() {
  const [calRange, setCalRange] = useState("Last 14 Days");
  const [account, setAccount] = useState("[D] Emma 12");
  const [showField, setShowField] = useState<"roas" | "cpa">("roas");
  const [dateRange] = useState("14-02-2026 to 27-02-2026");

  const metricData = showField === "roas" ? roasData : cpaData;
  const invertMetric = showField === "cpa";

  // Grand totals per hour (across all days)
  const gtSpendByHour = useMemo(() =>
    Array.from({ length: 24 }, (_, h) => spendData.reduce((s, d) => s + d[h], 0)),
    []
  );
  const gtMetricByHour = useMemo(() =>
    Array.from({ length: 24 }, (_, h) => {
      const totalSpend = spendData.reduce((s, d) => s + d[h], 0);
      if (totalSpend === 0) return 0;
      if (showField === "roas") {
        const totalRev = spendData.reduce((s, d, i) => s + d[h] * roasData[i][h] / 100, 0);
        return (totalRev / totalSpend) * 100;
      } else {
        const totalPurch = spendData.reduce((s, d, i) => {
          const r = roasData[i][h];
          return s + (r > 0 ? d[h] * r / 100 / 150 : 0);
        }, 0);
        return totalPurch > 0 ? totalSpend / totalPurch : 0;
      }
    }),
    [showField]
  );

  // Grand totals per day (across all hours)
  const gtSpendByDay = useMemo(() =>
    spendData.map(d => d.reduce((s, v) => s + v, 0)),
    []
  );
  const gtMetricByDay = useMemo(() =>
    spendData.map((d, i) => {
      const totalSpend = d.reduce((s, v) => s + v, 0);
      if (totalSpend === 0) return 0;
      if (showField === "roas") {
        const totalRev = d.reduce((s, v, h) => s + v * roasData[i][h] / 100, 0);
        return (totalRev / totalSpend) * 100;
      } else {
        const totalPurch = d.reduce((s, v, h) => {
          const r = roasData[i][h];
          return s + (r > 0 ? v * r / 100 / 150 : 0);
        }, 0);
        return totalPurch > 0 ? totalSpend / totalPurch : 0;
      }
    }),
    [showField]
  );

  // Overall grand total
  const overallSpend = gtSpendByDay.reduce((s, v) => s + v, 0);
  const overallMetric = useMemo(() => {
    if (overallSpend === 0) return 0;
    if (showField === "roas") {
      const totalRev = spendData.reduce((s, d, i) =>
        s + d.reduce((ss, v, h) => ss + v * roasData[i][h] / 100, 0), 0);
      return (totalRev / overallSpend) * 100;
    } else {
      const totalPurch = spendData.reduce((s, d, i) =>
        s + d.reduce((ss, v, h) => {
          const r = roasData[i][h];
          return ss + (r > 0 ? v * r / 100 / 150 : 0);
        }, 0), 0);
      return totalPurch > 0 ? overallSpend / totalPurch : 0;
    }
  }, [showField]);

  // Global maxes for bar scaling (includes grand total cells)
  const spendMax = useMemo(() => Math.max(
    ...spendData.flat(),
    ...gtSpendByHour,
    ...gtSpendByDay,
    overallSpend
  ), [gtSpendByHour, gtSpendByDay, overallSpend]);

  const metricMax = useMemo(() => Math.max(
    ...metricData.flat().filter(v => v > 0),
    ...gtMetricByHour.filter(v => v > 0),
    ...gtMetricByDay.filter(v => v > 0),
    overallMetric > 0 ? overallMetric : 0,
    1
  ), [metricData, gtMetricByHour, gtMetricByDay, overallMetric]);

  const thStyle = "px-2 py-1.5 text-center text-[10px] font-semibold text-gray-600 uppercase tracking-wide border border-gray-200 bg-gray-50 whitespace-nowrap";

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-4">

        {/* ── Filters ── */}
        <div className="bg-white rounded border border-gray-200 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-end gap-3 lg:gap-4">
            <div className="flex flex-col gap-1">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date Range</div>
              <input
                type="text"
                defaultValue={dateRange}
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-brandBlue"
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Calendar Range</div>
              <select
                value={calRange}
                onChange={e => setCalRange(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-brandBlue"
              >
                {CALENDAR_RANGES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</div>
              <select
                value={account}
                onChange={e => setAccount(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-brandBlue"
              >
                {ACCOUNTS.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Show Field</div>
              <select
                value={showField}
                onChange={e => setShowField(e.target.value as "roas" | "cpa")}
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-brandBlue"
              >
                <option value="roas">roas</option>
                <option value="cpa">cpa</option>
              </select>
            </div>
            <button className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-brand-lightBlue hover:bg-brand-brandBlue text-white transition-colors lg:ml-auto">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── Heatmap table ── */}
        <div className="bg-white rounded border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="text-xs border-collapse w-full" style={{ minWidth: 1100 }}>
              <thead>
                {/* Day header row */}
                <tr>
                  <th className={`${thStyle} w-10`} rowSpan={2}>HOD</th>
                  {DAY_LABELS.map(d => (
                    <th key={d} className={thStyle} colSpan={2}>{d}</th>
                  ))}
                  <th className={thStyle} colSpan={2}>Grand Total</th>
                </tr>
                {/* Sub-column header row */}
                <tr>
                  {Array.from({ length: 8 }, (_, i) => (
                    <>
                      <th key={`s${i}`} className={thStyle}>Spend</th>
                      <th key={`m${i}`} className={thStyle}>{showField.toUpperCase()}</th>
                    </>
                  ))}
                </tr>
              </thead>

              <tbody>
                {Array.from({ length: 24 }, (_, h) => {
                  const gtS = gtSpendByHour[h];
                  const gtM = gtMetricByHour[h];
                  return (
                    <tr key={h} className="hover:brightness-95 transition-all">
                      <td className="px-2 py-1.5 text-center text-xs font-semibold text-gray-700 border border-gray-200 bg-gray-50">{h}</td>
                      {spendData.map((daySpend, d) => {
                        const s = daySpend[h];
                        const m = metricData[d][h];
                        return (
                          <>
                            <Cell key={`s${d}`} val={s} globalMax={spendMax} label={fmtSpend(s)} />
                            <Cell key={`m${d}`} val={m} globalMax={metricMax} invert={invertMetric} label={fmtMetric(m, showField)} />
                          </>
                        );
                      })}
                      <Cell val={gtS} globalMax={spendMax} label={fmtSpend(gtS)} />
                      <Cell val={gtM} globalMax={metricMax} invert={invertMetric} label={fmtMetric(gtM, showField)} />
                    </tr>
                  );
                })}

                {/* Grand Total row */}
                <tr className="border-t-2 border-gray-400">
                  <td className="px-2 py-2 text-xs font-bold text-gray-800 border border-gray-200 bg-gray-50 whitespace-nowrap">Grand Total</td>
                  {gtSpendByDay.map((s, d) => {
                    const m = gtMetricByDay[d];
                    return (
                      <>
                        <Cell key={`gs${d}`} val={s} globalMax={spendMax} label={fmtSpend(s)} bold />
                        <Cell key={`gm${d}`} val={m} globalMax={metricMax} invert={invertMetric} label={fmtMetric(m, showField)} bold />
                      </>
                    );
                  })}
                  <Cell val={overallSpend} globalMax={spendMax} label={fmtSpend(overallSpend)} bold />
                  <Cell val={overallMetric} globalMax={metricMax} invert={invertMetric} label={fmtMetric(overallMetric, showField)} bold />
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Blended chart ── */}
        <div className="bg-white rounded border border-gray-200 p-4">
          <HourlyChart
            hourlySpend={gtSpendByHour}
            hourlyMetric={gtMetricByHour.map(v => showField === "roas" ? v / 100 : v)}
            metricLabel={showField.toUpperCase()}
          />
        </div>

      </div>
    </DashboardLayout>
  );
}
