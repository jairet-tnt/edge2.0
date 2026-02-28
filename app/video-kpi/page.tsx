"use client";

import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, Play, RefreshCw, Search, X } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

// ─── Seeded deterministic random ──────────────────────────────────────────────
function sr(n: number) {
  const x = Math.sin(n + 42) * 10000;
  return x - Math.floor(x);
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface Row {
  id: number; adName: string;
  spend: number; impressions: number; views3s: number; thruPlays: number;
  linkClicks: number; purchases: number; revenue: number;
}

type SortKey =
  | "spend" | "impressions" | "views3s" | "thruPlays" | "linkClicks" | "purchases" | "revenue"
  | "hookRate" | "holdRate" | "ctr" | "cpc" | "cpm" | "cpa" | "roas";

// ─── Mock table data — 50 rows ────────────────────────────────────────────────
const AD_TYPES = ["Hook", "VSL", "UGC", "Testimonial", "Demo"];
const PRODUCTS = ["Youthful Brain", "Emma", "Prostaflow", "Vital BP", "Core"];

const ROWS: Row[] = Array.from({ length: 50 }, (_, i) => {
  const spend       = Math.round((sr(i)       * 2500 + 150)   * 100) / 100;
  const impressions = Math.round( sr(i + 100) * 600000 + 15000);
  const views3s     = Math.round( sr(i + 200) * impressions * 0.45 + 2000);
  const thruPlays   = Math.round( sr(i + 300) * views3s  * 0.55 + 200);
  const linkClicks  = Math.round( sr(i + 400) * impressions * 0.06 + 80);
  const purchases   = Math.round( sr(i + 500) * 250 + 8);
  const revenue     = Math.round(purchases * (sr(i + 600) * 90 + 40) * 100) / 100;
  return {
    id: i + 1,
    adName: `${PRODUCTS[i % 5]} · ${AD_TYPES[i % 5]} ${String(Math.floor(i / 5) + 1).padStart(2, "0")}`,
    spend, impressions, views3s, thruPlays, linkClicks, purchases, revenue,
  };
});

// ─── Ads used in retention / funnel charts ────────────────────────────────────
const VIDEO_ADS = [
  { id: 0, label: "Youthful Brain · Hook 01",     color: "#e21729" },
  { id: 1, label: "Emma · VSL 01",                color: "#1d4c93" },
  { id: 2, label: "Prostaflow · UGC 01",          color: "#22c55e" },
  { id: 3, label: "Vital BP · Testimonial 01",    color: "#f59e0b" },
];

// Second-by-second retention — 61 points (0–60 s). Y range shown: 60%–100%.
const RETENTION_DATA = VIDEO_ADS.map(({ id }) =>
  Array.from({ length: 61 }, (_, s) => {
    const rate = 0.008 + id * 0.003;
    const base = 100 * Math.exp(-rate * s);
    const noise = (sr(s * 11 + id * 53) - 0.5) * 2.5;
    return Math.max(60, Math.min(100, base + noise));
  })
);

// Completion funnel: % viewers at [25%, 50%, 75%, 95%, 100%] milestones.
const FUNNEL_DATA = VIDEO_ADS.map(({ id }) => {
  const n = (t: number) => (sr(id * 17 + t * 7) - 0.5) * 10;
  return [
    Math.min(98, 85 + n(1)),
    Math.min(88, 67 + n(2)),
    Math.min(70, 48 + n(3)),
    Math.min(54, 30 + n(4)),
    Math.min(44, 20 + n(5)),
  ];
});

// ─── Formatting helpers ───────────────────────────────────────────────────────
const fmt$   = (v: number) => "$" + v.toFixed(2);
const fmtK   = (v: number) => v >= 1000 ? (v / 1000).toFixed(1) + "k" : String(v);
const fmtPct = (v: number) => (v * 100).toFixed(2) + "%";
const fmtX   = (v: number) => v.toFixed(2) + "x";

function getDerived(r: Row) {
  return {
    hookRate: r.impressions > 0 ? r.views3s    / r.impressions       : 0,
    holdRate: r.views3s     > 0 ? r.thruPlays  / r.views3s           : 0,
    ctr:      r.impressions > 0 ? r.linkClicks / r.impressions        : 0,
    cpc:      r.linkClicks  > 0 ? r.spend      / r.linkClicks         : 0,
    cpm:      r.impressions > 0 ? (r.spend     / r.impressions) * 1000 : 0,
    cpa:      r.purchases   > 0 ? r.spend      / r.purchases          : 0,
    roas:     r.spend       > 0 ? r.revenue    / r.spend              : 0,
  };
}

// ─── Shared legend toggle bar ──────────────────────────────────────────────────
function AdToggleLegend({
  active, onToggle,
}: {
  active: Set<number>;
  onToggle: (id: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mr-1">Ads</span>
      {VIDEO_ADS.map((ad) => {
        const on = active.has(ad.id);
        return (
          <button
            key={ad.id}
            onClick={() => onToggle(ad.id)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
              on ? "text-white border-transparent" : "text-gray-400 border-gray-200 hover:border-gray-300"
            }`}
            style={on ? { backgroundColor: ad.color, borderColor: ad.color } : {}}
          >
            <span className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: on ? "white" : ad.color }} />
            {ad.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Filter Card 1 ─────────────────────────────────────────────────────────────
const CALENDAR_OPTS = ["Last 14 Days","Today","Yesterday","Last 7 Days","Last 30 Days","This Month","Last Month"];

function VideoKpiFilterControls() {
  const [account, setAccount] = useState("[H] ProtaFlo");
  const inp = "px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-brandBlue bg-white";
  const lbl = "text-[10px] font-semibold text-gray-500 uppercase tracking-wider";

  return (
    <div className="bg-white rounded-xl border border-gray-200 px-4 sm:px-6 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-start gap-3 lg:gap-x-6 lg:gap-y-4">

        {/* ACCOUNT */}
        <div className="flex flex-col gap-1">
          <span className={lbl}>Account</span>
          <div className="flex items-center gap-1 px-2 py-1.5 border border-gray-300 rounded bg-white w-full">
            <span className="text-sm text-gray-700 flex-1 truncate">{account}</span>
            <button onClick={() => setAccount("")} className="text-gray-400 hover:text-gray-600 p-0.5">
              <X className="h-3.5 w-3.5" />
            </button>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
          </div>
        </div>

        {/* FUNNEL */}
        <div className="flex flex-col gap-1">
          <span className={lbl}>Funnel</span>
          <select className={`${inp} w-full`}><option value="">...</option></select>
        </div>

        {/* PLATFORM */}
        <div className="flex flex-col gap-1">
          <span className={lbl}>Platform</span>
          <select className={`${inp} w-full`}><option value="">...</option></select>
        </div>

        {/* DATE RANGE */}
        <div className="flex flex-col gap-1">
          <span className={lbl}>Date Range</span>
          <input type="text" defaultValue="2026-02-14 to 2026-02-27" readOnly
            className={`${inp} w-full bg-brand-lightGrey cursor-default`} />
        </div>

        {/* CALENDAR RANGE */}
        <div className="flex flex-col gap-1">
          <span className={lbl}>Calendar Range</span>
          <select className={`${inp} w-full`}>
            {CALENDAR_OPTS.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>

        {/* CAMP. LAUNCH DATE */}
        <div className="flex flex-col gap-1">
          <span className={lbl}>Camp. Launch Date</span>
          <input type="text" readOnly
            className={`${inp} w-full bg-brand-lightGrey cursor-default`} />
        </div>

        {/* CAMP. LAUNCH RANGE */}
        <div className="flex flex-col gap-1">
          <span className={lbl}>Camp. Launch Range</span>
          <select className={`${inp} w-full`}>
            <option value="">...</option>
            {CALENDAR_OPTS.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>

        {/* Refresh */}
        <div className="flex items-end lg:ml-auto">
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-lightBlue hover:bg-brand-brandBlue text-white transition-colors"
            aria-label="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
}

// ─── Filter Card 2 ─────────────────────────────────────────────────────────────
function FilterRow() {
  const inp = "w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-brandBlue";
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap lg:items-end gap-2 lg:gap-3">
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Field</span>
        <input type="text" placeholder="..." className={inp} />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Comparison</span>
        <select className={inp}><option value="">...</option></select>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Value</span>
        <div className="relative">
          <input type="text" placeholder="Enter value" className={`${inp} pr-7`} />
          <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Filter Name</span>
        <select className={inp}><option value="">...</option></select>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Name</span>
        <div className="relative">
          <input type="text" placeholder="Enter name" className={`${inp} pr-7`} />
          <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
        </div>
      </div>
    </div>
  );
}

function VideoKpiFilterRows() {
  const btnOutline = "px-4 py-1.5 text-xs font-semibold rounded border border-brand-brandBlue text-brand-brandBlue hover:bg-brand-brandBlue hover:text-white transition-colors";
  const btnGray    = "px-4 py-1.5 text-xs font-semibold rounded border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors";
  return (
    <div className="bg-white rounded-xl border border-gray-200 px-6 py-4">
      <div className="flex items-start gap-6">
        <div className="flex-1 space-y-4">
          <FilterRow />
          <FilterRow />
        </div>
        <div className="flex flex-col gap-2 pt-5 flex-shrink-0">
          <button className={btnOutline}>APPLY FILTER</button>
          <button className={btnGray}>CLEAR FILTER</button>
        </div>
      </div>
    </div>
  );
}

// ─── Chart: Drop-off Rate by Second (0–60 s) ───────────────────────────────────
function RetentionChart() {
  const [active, setActive] = useState(new Set(VIDEO_ADS.map(a => a.id)));

  const toggle = (id: number) =>
    setActive(prev => {
      const next = new Set(prev);
      if (next.has(id)) { if (next.size > 1) next.delete(id); }
      else next.add(id);
      return next;
    });

  const W = 1000, H = 220;
  const PL = 52, PR = 16, PT = 14, PB = 28;
  const CW = W - PL - PR;
  const CH = H - PT - PB;
  const Y_MIN = 60, Y_MAX = 100, Y_RNG = Y_MAX - Y_MIN;
  const X_MAX = 60;

  const lY = (v: number) => PT + CH * (1 - (v - Y_MIN) / Y_RNG);
  const xP = (s: number) => PL + (s / X_MAX) * CW;

  const yTicks = [60, 70, 80, 90, 100];
  const xTicks = [0, 10, 20, 30, 40, 50, 60];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm font-semibold text-gray-700 mb-3">Drop-off Rate by Second</p>
      <AdToggleLegend active={active} onToggle={toggle} />

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{ height: 220 }}>
        {/* Horizontal grid lines */}
        {yTicks.map(v => (
          <line key={v} x1={PL} y1={lY(v)} x2={W - PR} y2={lY(v)}
            stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3 3" />
        ))}

        {/* Y-axis labels */}
        {yTicks.map(v => (
          <text key={v} x={PL - 6} y={lY(v) + 4}
            textAnchor="end" fontSize="11" fill="#6b7280">
            {v}%
          </text>
        ))}

        {/* X-axis labels */}
        {xTicks.map(s => (
          <text key={s} x={xP(s)} y={H - 6}
            textAnchor="middle" fontSize="10" fill="#9ca3af">
            {s}s
          </text>
        ))}

        {/* Axis lines */}
        <line x1={PL} y1={PT} x2={PL} y2={PT + CH} stroke="#d1d5db" strokeWidth="1" />
        <line x1={PL} y1={PT + CH} x2={W - PR} y2={PT + CH} stroke="#d1d5db" strokeWidth="1" />

        {/* Ad retention lines — every second plotted */}
        {VIDEO_ADS.filter(a => active.has(a.id)).map(ad => {
          const data = RETENTION_DATA[ad.id];
          const path = data
            .map((v, s) => `${s === 0 ? "M" : "L"} ${xP(s).toFixed(1)} ${lY(v).toFixed(1)}`)
            .join(" ");
          return (
            <g key={ad.id}>
              <path d={path} stroke={ad.color} strokeWidth="2" fill="none" />
              {/* Dots every 10 seconds */}
              {[0, 10, 20, 30, 40, 50, 60].map(s => (
                <circle key={s} cx={xP(s)} cy={lY(data[s])} r="3" fill={ad.color} />
              ))}
            </g>
          );
        })}
      </svg>

      <p className="text-[10px] text-gray-400 text-center mt-1">Seconds into video</p>
    </div>
  );
}

// ─── Chart: Video Percentage Remaining ────────────────────────────────────────
const FUNNEL_X_LABELS = ["25%", "50%", "75%", "95%", "100%"];

function FunnelChart() {
  const [active, setActive] = useState(new Set(VIDEO_ADS.map(a => a.id)));

  const toggle = (id: number) =>
    setActive(prev => {
      const next = new Set(prev);
      if (next.has(id)) { if (next.size > 1) next.delete(id); }
      else next.add(id);
      return next;
    });

  const W = 800, H = 220;
  const PL = 52, PR = 16, PT = 14, PB = 28;
  const CW = W - PL - PR;
  const CH = H - PT - PB;

  const lY = (v: number) => PT + CH * (1 - v / 100);
  const xP = (i: number) => PL + (i / 4) * CW;

  const yTicks = [0, 25, 50, 75, 100];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm font-semibold text-gray-700 mb-3">Video Percentage Remaining</p>
      <AdToggleLegend active={active} onToggle={toggle} />

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{ height: 220 }}>
        {yTicks.map(v => (
          <line key={v} x1={PL} y1={lY(v)} x2={W - PR} y2={lY(v)}
            stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3 3" />
        ))}
        {yTicks.map(v => (
          <text key={v} x={PL - 6} y={lY(v) + 4}
            textAnchor="end" fontSize="11" fill="#6b7280">
            {v}%
          </text>
        ))}
        {FUNNEL_X_LABELS.map((lbl, i) => (
          <text key={lbl} x={xP(i)} y={H - 6}
            textAnchor="middle" fontSize="11" fill="#9ca3af">
            {lbl}
          </text>
        ))}
        <line x1={PL} y1={PT} x2={PL} y2={PT + CH} stroke="#d1d5db" strokeWidth="1" />
        <line x1={PL} y1={PT + CH} x2={W - PR} y2={PT + CH} stroke="#d1d5db" strokeWidth="1" />
        {FUNNEL_X_LABELS.map((_, i) => (
          <line key={i} x1={xP(i)} y1={PT} x2={xP(i)} y2={PT + CH}
            stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2 2" />
        ))}
        {VIDEO_ADS.filter(a => active.has(a.id)).map(ad => {
          const data = FUNNEL_DATA[ad.id];
          const path = data
            .map((v, i) => `${i === 0 ? "M" : "L"} ${xP(i).toFixed(1)} ${lY(v).toFixed(1)}`)
            .join(" ");
          return (
            <g key={ad.id}>
              <path d={path} stroke={ad.color} strokeWidth="2" fill="none" strokeLinejoin="round" />
              {data.map((v, i) => (
                <circle key={i} cx={xP(i)} cy={lY(v)} r="4" fill={ad.color} />
              ))}
            </g>
          );
        })}
      </svg>

      <p className="text-[10px] text-gray-400 text-center mt-1">Video completion milestone</p>
    </div>
  );
}

// ─── Column definitions ───────────────────────────────────────────────────────
const COLS: {
  key: SortKey;
  label: string;
  fmt: (r: Row, d: ReturnType<typeof getDerived>) => string;
}[] = [
  { key: "spend",       label: "Spend",     fmt: (r)    => fmt$(r.spend) },
  { key: "impressions", label: "Impr.",      fmt: (r)    => fmtK(r.impressions) },
  { key: "views3s",     label: "3s Views",  fmt: (r)    => fmtK(r.views3s) },
  { key: "thruPlays",   label: "ThruPlays", fmt: (r)    => fmtK(r.thruPlays) },
  { key: "hookRate",    label: "Hook Rate", fmt: (_, d) => fmtPct(d.hookRate) },
  { key: "holdRate",    label: "Hold Rate", fmt: (_, d) => fmtPct(d.holdRate) },
  { key: "ctr",         label: "CTR",       fmt: (_, d) => fmtPct(d.ctr) },
  { key: "linkClicks",  label: "Clicks",    fmt: (r)    => fmtK(r.linkClicks) },
  { key: "cpc",         label: "CPC",       fmt: (_, d) => fmt$(d.cpc) },
  { key: "cpm",         label: "CPM",       fmt: (_, d) => fmt$(d.cpm) },
  { key: "purchases",   label: "Purchases", fmt: (r)    => String(r.purchases) },
  { key: "cpa",         label: "CPA",       fmt: (_, d) => fmt$(d.cpa) },
  { key: "roas",        label: "ROAS",      fmt: (_, d) => fmtX(d.roas) },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function VideoKpiPage() {
  const [sortKey, setSortKey] = useState<SortKey>("spend");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const sorted = useMemo(() => [...ROWS].sort((a, b) => {
    const da = getDerived(a), db = getDerived(b);
    const va: number = (sortKey in a ? (a as any)[sortKey] : (da as any)[sortKey]) ?? 0;
    const vb: number = (sortKey in b ? (b as any)[sortKey] : (db as any)[sortKey]) ?? 0;
    return sortDir === "asc" ? va - vb : vb - va;
  }), [sortKey, sortDir]);

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-4">

        {/* Filter controls */}
        <VideoKpiFilterControls />

        {/* Advanced filter rows */}
        <VideoKpiFilterRows />

        {/* Drop-off Rate chart (second-by-second: 0–60 s) */}
        <RetentionChart />

        {/* Video Percentage Remaining chart */}
        <FunnelChart />

        {/* Data table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table style={{ borderCollapse: "collapse", tableLayout: "auto", width: "100%" }}>
              <thead>
                <tr className="bg-brand-brandBlue">
                  <th className="px-3 py-2.5 text-[10px] font-semibold text-white uppercase tracking-wide text-center border-r border-white/10 w-8">#</th>
                  <th className="px-3 py-2.5 text-[10px] font-semibold text-white uppercase tracking-wide text-center border-r border-white/10 w-10">
                    <Play className="h-3 w-3 mx-auto" />
                  </th>
                  <th className="px-3 py-2.5 text-[10px] font-semibold text-white uppercase tracking-wide text-left border-r border-white/10"
                    style={{ minWidth: 200 }}>
                    Ad Name
                  </th>
                  {COLS.map(col => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className="px-3 py-2.5 text-[10px] font-semibold text-white uppercase tracking-wide text-right whitespace-nowrap cursor-pointer hover:bg-white/10 border-r border-white/10 last:border-r-0 select-none"
                    >
                      {col.label}
                      {sortKey === col.key
                        ? sortDir === "asc"
                          ? <ChevronUp   className="h-3 w-3 inline-block ml-0.5" />
                          : <ChevronDown className="h-3 w-3 inline-block ml-0.5" />
                        : <ChevronDown className="h-3 w-3 inline-block ml-0.5 opacity-20" />}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((row, idx) => {
                  const d = getDerived(row);
                  return (
                    <tr
                      key={row.id}
                      className={`border-b border-gray-100 transition-colors hover:bg-brand-brandBlue/5 ${
                        idx % 2 === 1 ? "bg-brand-lightGrey/40" : "bg-white"
                      }`}
                    >
                      <td className="px-3 py-2 text-[11px] text-gray-400 text-center border-r border-gray-100">
                        {idx + 1}
                      </td>
                      <td className="px-2 py-1.5 border-r border-gray-100">
                        <div className="w-8 h-8 rounded bg-brand-darkBlue/10 flex items-center justify-center mx-auto">
                          <Play className="h-3 w-3 text-brand-brandBlue" />
                        </div>
                      </td>
                      <td className="px-3 py-2 text-[11px] text-gray-700 font-medium text-left border-r border-gray-100 whitespace-nowrap">
                        {row.adName}
                      </td>
                      {COLS.map(col => (
                        <td
                          key={col.key}
                          className="px-3 py-2 text-[11px] text-gray-600 text-right border-r border-gray-100 last:border-r-0 whitespace-nowrap"
                        >
                          {col.fmt(row, d)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
