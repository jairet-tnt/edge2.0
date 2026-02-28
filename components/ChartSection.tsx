"use client";

import { useState } from "react";

const METRICS = [
  "Spend", "Impressions", "Clicks", "CPM", "CPC",
  "CTR", "Purchases", "CPA", "CVR", "ROAS", "AOV",
];

// 14-day mock data: Feb 14 – 27 2026
const DATES = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(2026, 1, 14 + i);
  return `2026-02-${String(d.getDate()).padStart(2, "0")}`;
});

const METRIC_DATA: Record<string, number[]> = {
  Spend:       [7500,7600,9400,7700,7800,7600,8100,7200,7900,9800,8300,8100,7900,8000],
  Impressions: [350000,360000,420000,355000,368000,352000,380000,340000,372000,450000,395000,385000,378000,380000],
  Clicks:      [4000,4100,5000,4050,4200,4000,4400,3900,4300,5200,4600,4500,4400,4500],
  CPM:         [21.4,21.1,22.4,21.7,21.2,21.6,21.3,21.2,21.2,21.8,21.0,21.0,20.9,21.1],
  CPC:         [1.88,1.85,1.88,1.90,1.86,1.90,1.84,1.85,1.84,1.88,1.80,1.80,1.80,1.78],
  CTR:         [1.14,1.14,1.19,1.14,1.14,1.14,1.16,1.15,1.16,1.16,1.16,1.17,1.16,1.18],
  Purchases:   [35,36,42,36,37,35,38,33,37,44,40,38,37,38],
  CPA:         [214,211,224,214,211,217,213,218,214,223,208,213,214,211],
  CVR:         [0.88,0.88,0.84,0.89,0.88,0.88,0.86,0.85,0.86,0.85,0.87,0.84,0.84,0.84],
  ROAS:        [1.65,1.60,2.00,1.58,1.62,1.57,1.72,1.45,1.77,2.25,1.88,1.85,1.78,1.80],
  AOV:         [186,185,192,184,182,190,188,188,186,194,186,189,190,188],
};

function fmtTick(v: number, m: string): string {
  if (m === "Spend")   return v >= 1000 ? `${(v / 1000).toFixed(1)}K` : String(Math.round(v));
  if (m === "ROAS")    return v.toFixed(2);
  if (m === "CTR" || m === "CVR") return v.toFixed(2);
  if (["CPM", "CPC", "CPA", "AOV"].includes(m)) return `$${v.toFixed(2)}`;
  return v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(Math.round(v));
}

const LEFT_COLOR  = "#4f46e5"; // indigo  — metric left line
const RIGHT_COLOR = "#0891b2"; // cyan    — metric right line

function DualAxisChart({ lm, rm }: { lm: string; rm: string }) {
  const ld = METRIC_DATA[lm] ?? METRIC_DATA.Spend;
  const rd = METRIC_DATA[rm] ?? METRIC_DATA.Spend;

  const W = 1100, H = 220;
  const PL = 64, PR = 64, PT = 14, PB = 28;
  const CW = W - PL - PR;
  const CH = H - PT - PB;
  const n  = DATES.length;

  const pad = (arr: number[]) => {
    const lo = Math.min(...arr), hi = Math.max(...arr);
    const r = (hi - lo) || 1;
    return { lo: lo - r * 0.12, hi: hi + r * 0.12 };
  };
  const { lo: lLo, hi: lHi } = pad(ld);
  const { lo: rLo, hi: rHi } = pad(rd);

  const lY = (v: number) => PT + CH * (1 - (v - lLo) / (lHi - lLo));
  const rY = (v: number) => PT + CH * (1 - (v - rLo) / (rHi - rLo));
  const xP = (i: number) => PL + (i / (n - 1)) * CW;

  const mkPath = (data: number[], yFn: (v: number) => number) =>
    data
      .map((v, i) => `${i === 0 ? "M" : "L"} ${xP(i).toFixed(1)} ${yFn(v).toFixed(1)}`)
      .join(" ");

  const ticks = (lo: number, hi: number) =>
    Array.from({ length: 5 }, (_, i) => lo + (i / 4) * (hi - lo));
  const lTicks = ticks(lLo, lHi);
  const rTicks = ticks(rLo, rHi);

  return (
    <div>
      {/* Legend */}
      <div className="flex items-center gap-6 mb-2 text-xs text-gray-600" style={{ paddingLeft: PL }}>
        <span className="flex items-center gap-2">
          <span className="inline-block w-5 h-[2px] rounded" style={{ backgroundColor: LEFT_COLOR }} />
          CBO_Scaling2Ic_US-NDP 1/9/26 — {lm}
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block w-5 h-[2px] rounded" style={{ backgroundColor: RIGHT_COLOR }} />
          CBO_Scaling2Ic_US-NDP 1/9/26 — {rm}
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{ height: 220 }}>
        {/* Grid lines */}
        {lTicks.map((v, i) => (
          <line key={i} x1={PL} y1={lY(v)} x2={W - PR} y2={lY(v)}
            stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3 3" />
        ))}

        {/* Left Y-axis labels */}
        {lTicks.map((v, i) => (
          <text key={i} x={PL - 6} y={lY(v) + 4}
            textAnchor="end" fontSize="11" fill="#6b7280">
            {fmtTick(v, lm)}
          </text>
        ))}

        {/* Right Y-axis labels */}
        {rTicks.map((v, i) => (
          <text key={i} x={W - PR + 6} y={rY(v) + 4}
            textAnchor="start" fontSize="11" fill="#6b7280">
            {fmtTick(v, rm)}
          </text>
        ))}

        {/* X-axis date labels */}
        {DATES.map((d, i) => (
          <text key={i} x={xP(i)} y={H - 5}
            textAnchor="middle" fontSize="10" fill="#9ca3af">
            {d}
          </text>
        ))}

        {/* Axis border lines */}
        <line x1={PL} y1={PT} x2={PL} y2={PT + CH} stroke="#d1d5db" strokeWidth="1" />
        <line x1={W - PR} y1={PT} x2={W - PR} y2={PT + CH} stroke="#d1d5db" strokeWidth="1" />

        {/* Data lines */}
        <path d={mkPath(ld, lY)} stroke={LEFT_COLOR}  strokeWidth="2" fill="none" />
        <path d={mkPath(rd, rY)} stroke={RIGHT_COLOR} strokeWidth="2" fill="none" />

        {/* Data dots */}
        {ld.map((v, i) => (
          <circle key={i} cx={xP(i)} cy={lY(v)} r="3" fill={LEFT_COLOR} />
        ))}
        {rd.map((v, i) => (
          <circle key={i} cx={xP(i)} cy={rY(v)} r="3" fill={RIGHT_COLOR} />
        ))}
      </svg>
    </div>
  );
}

const sel =
  "px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-brandBlue min-w-[130px]";

export default function ChartSection() {
  const [lm, setLm] = useState("Spend");
  const [rm, setRm] = useState("Spend");

  return (
    <div className="bg-white rounded-xl border border-gray-200 px-6 py-5">
      <DualAxisChart lm={lm} rm={rm} />

      {/* Metric selectors */}
      <div className="flex gap-8 mt-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
            Metric Left
          </span>
          <select value={lm} onChange={(e) => setLm(e.target.value)} className={sel}>
            {METRICS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
            Metric Right
          </span>
          <select value={rm} onChange={(e) => setRm(e.target.value)} className={sel}>
            {METRICS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
