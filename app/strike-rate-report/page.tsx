"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, ChevronUp, RefreshCw, X, BarChart2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

// ─── Constants ─────────────────────────────────────────────────────────────────
const PLATFORM_OPTS = ["Facebook","Google","TikTok","Bing","Taboola","AppLovin","Amazon SC","Amazon Ads","Rumble"];
const FUNNEL_OPTS   = ["Emma","Youthful Brain","Visi","Emma Subs","Akka LCP","ProstaSoothe","KetoActivate","Nail Exodus","ReActivate","Akka SB","Metabolic Energizer","Fitspresso","KetoActivate (Dr Luiz)","Stem Cell"];
const PIPELINE_OPTS = ["LG","WWHZ","WWVT","LGVT","WW","2.14","NN","NA"];
const BREAKDOWN_OPTS= ["Ad Name","Core Video"];
const CAL_RANGE_OPTS= ["Today","Yesterday","Last 7 Days","Last 14 Days","Last 30 Days","Last 3 Months","This Month","Last Month","Custom"];
const LEFT_METRIC_OPTS  = ["Ads","Strike Rate %","Strikes"];
const RIGHT_METRIC_OPTS = ["Strikes","Strike Rate %","Ads"];

// ─── Types ─────────────────────────────────────────────────────────────────────
type CellKey = "blue" | "emma" | "green" | "orange" | "purple";
type TableLook = "striped" | "heatmap";
type WeekRow = {
  week: string;
  blue:   [number, number];
  emma:   [number, number];
  green:  [number, number];
  orange: [number, number];
  purple: [number, number];
};

// ─── Mock data ──────────────────────────────────────────────────────────────────
const WEEK_DATA: WeekRow[] = [
  { week: "2025-11-03", blue:[5,1],  emma:[2,0], green:[9,3],   orange:[0,0],  purple:[3,0] },
  { week: "2025-11-10", blue:[2,1],  emma:[1,0], green:[3,0],   orange:[1,0],  purple:[2,1] },
  { week: "2025-11-17", blue:[16,2], emma:[2,0], green:[15,0],  orange:[1,0],  purple:[3,1] },
  { week: "2025-11-24", blue:[1,0],  emma:[3,0], green:[12,0],  orange:[0,0],  purple:[2,1] },
  { week: "2025-12-01", blue:[7,1],  emma:[3,0], green:[12,1],  orange:[2,1],  purple:[4,0] },
  { week: "2025-12-08", blue:[9,1],  emma:[5,0], green:[9,0],   orange:[2,1],  purple:[6,0] },
  { week: "2025-12-15", blue:[9,0],  emma:[0,0], green:[13,3],  orange:[3,1],  purple:[4,0] },
  { week: "2025-12-22", blue:[8,1],  emma:[4,0], green:[2,0],   orange:[2,0],  purple:[1,0] },
  { week: "2025-12-29", blue:[4,0],  emma:[3,0], green:[1,0],   orange:[8,0],  purple:[1,0] },
  { week: "2026-01-05", blue:[4,0],  emma:[4,0], green:[5,0],   orange:[4,1],  purple:[3,0] },
  { week: "2026-01-12", blue:[9,0],  emma:[2,0], green:[8,0],   orange:[2,0],  purple:[5,0] },
  { week: "2026-01-19", blue:[6,0],  emma:[1,0], green:[11,0],  orange:[3,0],  purple:[2,0] },
  { week: "2026-01-26", blue:[1,0],  emma:[8,0], green:[14,2],  orange:[0,0],  purple:[2,1] },
  { week: "2026-02-02", blue:[8,0],  emma:[3,0], green:[15,1],  orange:[0,0],  purple:[3,0] },
  { week: "2026-02-09", blue:[10,0], emma:[5,1], green:[12,2],  orange:[0,0],  purple:[3,0] },
  { week: "2026-02-16", blue:[5,0],  emma:[1,0], green:[9,0],   orange:[10,0], purple:[5,0] },
  { week: "2026-02-23", blue:[6,0],  emma:[0,0], green:[18,0],  orange:[0,0],  purple:[2,0] },
];

// ─── Cell config ───────────────────────────────────────────────────────────────
const CELLS: { key: CellKey; label: string; bg: string; text: string }[] = [
  { key:"blue",   label:"BLUE CELL",   bg:"#dbeafe", text:"#1e40af" },
  { key:"emma",   label:"EMMA CELL",   bg:"#fce7f3", text:"#9d174d" },
  { key:"green",  label:"GREEN CELL",  bg:"#dcfce7", text:"#166534" },
  { key:"orange", label:"ORANGE CELL", bg:"#ffedd5", text:"#9a3412" },
  { key:"purple", label:"PURPLE CELL", bg:"#ede9fe", text:"#5b21b6" },
];

// ─── useDropdown ───────────────────────────────────────────────────────────────
function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  return { open, setOpen, ref };
}

// ─── FilterDropdown ────────────────────────────────────────────────────────────
function FilterDropdown({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
  const { open, setOpen, ref } = useDropdown();
  return (
    <div className="flex flex-col gap-0.5 min-w-[120px]">
      <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
      <div className="relative" ref={ref}>
        <div
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-1 bg-white border border-gray-300 rounded px-2 py-1.5 cursor-pointer hover:border-brand-brandBlue transition-colors"
        >
          <span className="flex-1 text-sm text-gray-700 truncate">{value || "Select..."}</span>
          {value && (
            <button onClick={e => { e.stopPropagation(); onChange(""); }} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
              <X className="h-3 w-3" />
            </button>
          )}
          {open ? <ChevronUp className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" /> : <ChevronDown className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />}
        </div>
        {open && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 py-1 min-w-full max-h-60 overflow-y-auto" style={{minWidth:160}}>
            {options.map(opt => (
              <button key={opt} onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-4 py-1.5 text-sm transition-colors ${value === opt ? "bg-brand-brandBlue text-white" : "text-gray-700 hover:bg-gray-50"}`}>
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SVG Chart ─────────────────────────────────────────────────────────────────
function StrikeChart({ data, leftMetric, rightMetric }: {
  data: WeekRow[]; leftMetric: string; rightMetric: string;
}) {
  const W = 900, H = 180;
  const padL = 48, padR = 48, padT = 8, padB = 8;
  const cW = W - padL - padR;
  const cH = H - padT - padB;

  const getVals = (metric: string) =>
    data.map(row => {
      const ads     = row.blue[0] + row.emma[0] + row.green[0] + row.orange[0] + row.purple[0];
      const strikes = row.blue[1] + row.emma[1] + row.green[1] + row.orange[1] + row.purple[1];
      if (metric === "Ads")           return ads;
      if (metric === "Strikes")       return strikes;
      if (metric === "Strike Rate %") return ads > 0 ? strikes / ads : 0;
      return 0;
    });

  const lVals = getVals(leftMetric);
  const rVals = getVals(rightMetric);
  const lMax  = Math.max(...lVals, 1);
  const rMax  = Math.max(...rVals, 1);

  const niceCeil = (n: number) => {
    if (n <= 1) return 1;
    const mag = Math.pow(10, Math.floor(Math.log10(n)));
    return Math.ceil(n / mag) * mag;
  };
  const lCeil = niceCeil(lMax);
  const rCeil = niceCeil(rMax);
  const ticks = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
  const xStep = cW / (data.length - 1);

  const toPath = (vals: number[], ceil: number) =>
    vals.map((v, i) => {
      const x = padL + i * xStep;
      const y = padT + cH - (v / ceil) * cH;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");

  const fmtTick = (t: number, ceil: number) => {
    const val = t * ceil;
    if (ceil <= 1) return val.toFixed(1);
    return Number.isInteger(val) ? String(val) : val.toFixed(1);
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 200 }}>
      {ticks.map(t => {
        const y = padT + cH - t * cH;
        return (
          <g key={t}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#e5e7eb" strokeWidth="0.5" />
            <text x={padL - 5} y={y + 3} textAnchor="end" fontSize="8" fill="#9ca3af">{fmtTick(t, lCeil)}</text>
            <text x={W - padR + 5} y={y + 3} textAnchor="start" fontSize="8" fill="#9ca3af">{fmtTick(t, rCeil)}</text>
          </g>
        );
      })}
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke="#d1d5db" strokeWidth="1" />
      <line x1={W - padR} y1={padT} x2={W - padR} y2={padT + cH} stroke="#d1d5db" strokeWidth="1" />
      <line x1={padL} y1={padT + cH} x2={W - padR} y2={padT + cH} stroke="#d1d5db" strokeWidth="1" />
      <text transform={`translate(11,${padT + cH / 2}) rotate(-90)`} textAnchor="middle" fontSize="9" fill="#6b7280">{leftMetric}</text>
      <text transform={`translate(${W - 11},${padT + cH / 2}) rotate(90)`} textAnchor="middle" fontSize="9" fill="#6b7280">{rightMetric}</text>
      <path d={toPath(lVals, lCeil)} fill="none" stroke="#1d4c93" strokeWidth="1.5" />
      <path d={toPath(rVals, rCeil)} fill="none" stroke="#89cde7" strokeWidth="1.5" strokeDasharray="4,2" />
    </svg>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────────
export default function StrikeRateReportPage() {
  const [platform,    setPlatform]    = useState("Facebook");
  const [funnel,      setFunnel]      = useState("Emma");
  const [pipeline,    setPipeline]    = useState("NN");
  const [dateRange,   setDateRange]   = useState("2025-11-01 to 2026-02-27");
  const [calRange,    setCalRange]    = useState("Last 3 Months");
  const [breakdown,   setBreakdown]   = useState("Core Video");
  const [leftMetric,  setLeftMetric]  = useState("Ads");
  const [rightMetric, setRightMetric] = useState("Strikes");
  const [preStrikes,  setPreStrikes]  = useState(false);
  const [tableLook,   setTableLook]   = useState<TableLook>("striped");
  const tlDrop = useDropdown();

  const fmtPct = (ads: number, strikes: number) =>
    ads === 0 ? "0.00%" : (strikes / ads * 100).toFixed(2) + "%";

  // Heatmap tint on % cells
  const heatStyle = (ads: number, strikes: number): React.CSSProperties => {
    if (tableLook !== "heatmap" || ads === 0) return {};
    const rate = (strikes / ads) * 100;
    if (rate < 5)  return { backgroundColor: "rgba(226,23,41,0.20)"  };  // red
    if (rate < 10) return { backgroundColor: "rgba(249,115,22,0.28)" };  // orange
    if (rate < 15) return { backgroundColor: "rgba(234,179,8,0.35)"  };  // yellow
    if (rate < 20) return { backgroundColor: "rgba(74,222,128,0.35)" };  // light green
    return                { backgroundColor: "rgba(22,163,74,0.35)"  };  // dark green
  };

  const rowTotals = useMemo(() =>
    WEEK_DATA.map(row => ({
      ads:     row.blue[0] + row.emma[0] + row.green[0] + row.orange[0] + row.purple[0],
      strikes: row.blue[1] + row.emma[1] + row.green[1] + row.orange[1] + row.purple[1],
    })), []);

  const colTotals = useMemo(() =>
    CELLS.reduce((acc, cell) => {
      acc[cell.key] = {
        ads:     WEEK_DATA.reduce((s, r) => s + r[cell.key][0], 0),
        strikes: WEEK_DATA.reduce((s, r) => s + r[cell.key][1], 0),
      };
      return acc;
    }, {} as Record<CellKey, { ads: number; strikes: number }>), []);

  const grandTotal = useMemo(() => ({
    ads:     rowTotals.reduce((s, t) => s + t.ads, 0),
    strikes: rowTotals.reduce((s, t) => s + t.strikes, 0),
  }), [rowTotals]);

  // Shared row stripe
  const rowBg = (idx: number) =>
    tableLook === "striped" && idx % 2 === 1 ? "bg-gray-50/70" : "bg-white";

  // Pill card shell
  const card = "rounded-xl overflow-hidden shadow-sm bg-white border border-gray-100 flex-shrink-0";

  // Sub-header cell
  const subHd = "px-3 py-1.5 text-[9px] font-semibold text-gray-400 uppercase tracking-wide text-center select-none";

  // Data cell base
  const dataCell = "flex items-center justify-center text-[11px]";

  const btnOutline = "flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-semibold border-brand-brandBlue text-brand-brandBlue hover:bg-brand-brandBlue hover:text-white transition-colors";

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-4">

        {/* ── Filter Card ── */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <div className="flex flex-wrap items-end gap-4">
            <FilterDropdown label="Platform"  value={platform}  options={PLATFORM_OPTS}  onChange={setPlatform}  />
            <FilterDropdown label="Funnel"    value={funnel}    options={FUNNEL_OPTS}    onChange={setFunnel}    />
            <FilterDropdown label="Pipeline"  value={pipeline}  options={PIPELINE_OPTS}  onChange={setPipeline}  />
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Date Range</span>
              <input
                type="text" value={dateRange} onChange={e => setDateRange(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-brandBlue bg-white w-52"
              />
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mt-2">Calendar Range</span>
              <div className="flex items-center gap-1.5">
                <select value={calRange} onChange={e => setCalRange(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-brandBlue bg-white flex-1">
                  {CAL_RANGE_OPTS.map(o => <option key={o}>{o}</option>)}
                </select>
                <span className="text-gray-400 text-xs">◊</span>
              </div>
            </div>
            <FilterDropdown label="Breakdown" value={breakdown} options={BREAKDOWN_OPTS} onChange={setBreakdown} />
            <div className="flex flex-col justify-end pb-0.5">
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-lightBlue hover:bg-brand-brandBlue text-white transition-colors">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Chart Card ── */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <StrikeChart data={WEEK_DATA} leftMetric={leftMetric} rightMetric={rightMetric} />
          <div className="flex items-center justify-center gap-16 mt-3 pt-3 border-t border-gray-100">
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-gray-500">Left Metric</span>
              <select value={leftMetric} onChange={e => setLeftMetric(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-brandBlue bg-white">
                {LEFT_METRIC_OPTS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-gray-500">Right Metric</span>
              <select value={rightMetric} onChange={e => setRightMetric(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-brandBlue bg-white">
                {RIGHT_METRIC_OPTS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* ── Pill Cards Section ── */}
        <div>

          {/* Floating action buttons — no card wrapper */}
          <div className="flex items-center justify-end gap-2 mb-3">
            <button
              onClick={() => setPreStrikes(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-semibold transition-colors ${
                preStrikes
                  ? "bg-brand-brandBlue border-brand-brandBlue text-white"
                  : "border-brand-brandBlue text-brand-brandBlue hover:bg-brand-brandBlue hover:text-white"
              }`}
            >
              PRE-STRIKES
            </button>

            <div className="relative" ref={tlDrop.ref}>
              <button onClick={() => tlDrop.setOpen(o => !o)} className={btnOutline}>
                TABLE LOOK <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {tlDrop.open && (
                <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1" style={{ minWidth: 130 }}>
                  {(["striped", "heatmap"] as const).map(look => (
                    <button key={look} onClick={() => { setTableLook(look); tlDrop.setOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-xs transition-colors ${tableLook === look ? "text-brand-brandBlue font-semibold bg-brand-brandBlue/5" : "text-gray-700 hover:bg-brand-lightGrey"}`}>
                      {look === "striped" ? "Striped" : "Heat Map"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Horizontal pill cards */}
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-2 items-start">

              {/* ── Week Start card ── */}
              <div className={card}>
                <div className="bg-brand-darkBlue px-4 py-2.5">
                  <span className="text-sm font-semibold text-white whitespace-nowrap">WEEK START</span>
                </div>
                {/* Spacer to match sub-header height */}
                <div className="bg-gray-50 border-b border-gray-200 py-1.5 px-3 text-[9px] text-transparent select-none">
                  &nbsp;
                </div>
                {/* Data rows */}
                {WEEK_DATA.map((row, idx) => (
                  <div
                    key={row.week}
                    className={`px-4 h-9 flex items-center border-b border-gray-100 text-[11px] font-medium text-gray-700 whitespace-nowrap ${rowBg(idx)}`}
                  >
                    {row.week}
                  </div>
                ))}
                {/* Footer */}
                <div className="px-4 h-9 flex items-center border-t-2 border-gray-300 bg-gray-50 text-[11px] font-bold text-gray-800 whitespace-nowrap">
                  TOTAL
                </div>
              </div>

              {/* ── Cell cards ── */}
              {CELLS.map(cell => {
                const ct = colTotals[cell.key];
                return (
                  <div key={cell.key} className={card}>
                    {/* Header */}
                    <div className="px-4 py-2.5" style={{ backgroundColor: cell.bg }}>
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-sm font-semibold whitespace-nowrap" style={{ color: cell.text }}>{cell.label}</span>
                        <BarChart2 className="h-3.5 w-3.5 opacity-40" style={{ color: cell.text }} />
                      </div>
                    </div>
                    {/* Sub-headers */}
                    <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
                      {["ADS", "STRIKES", "%"].map(sub => (
                        <div key={sub} className={subHd}>{sub} ↕</div>
                      ))}
                    </div>
                    {/* Data rows */}
                    {WEEK_DATA.map((row, idx) => {
                      const [ads, strikes] = row[cell.key];
                      return (
                        <div key={row.week} className={`grid grid-cols-3 h-9 border-b border-gray-100 ${rowBg(idx)}`}>
                          <div className={`${dataCell} text-gray-600`}>{ads}</div>
                          <div className={`${dataCell} text-gray-600`}>{strikes}</div>
                          <div className={`${dataCell} text-gray-600`} style={heatStyle(ads, strikes)}>
                            {fmtPct(ads, strikes)}
                          </div>
                        </div>
                      );
                    })}
                    {/* Footer */}
                    <div className="grid grid-cols-3 h-9 border-t-2 border-gray-300 bg-gray-50">
                      <div className={`${dataCell} font-bold text-gray-700`}>{ct.ads}</div>
                      <div className={`${dataCell} font-bold text-gray-700`}>{ct.strikes}</div>
                      <div className={`${dataCell} font-bold text-gray-700`}>{fmtPct(ct.ads, ct.strikes)}</div>
                    </div>
                  </div>
                );
              })}

              {/* ── Total card ── */}
              <div className={card}>
                <div className="bg-gray-900 px-4 py-2.5">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-sm font-semibold text-white whitespace-nowrap">TOTAL</span>
                    <BarChart2 className="h-3.5 w-3.5 text-white opacity-40" />
                  </div>
                </div>
                <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
                  {["ADS", "STRIKES", "%"].map(sub => (
                    <div key={sub} className={subHd}>{sub} ↕</div>
                  ))}
                </div>
                {WEEK_DATA.map((row, idx) => {
                  const { ads, strikes } = rowTotals[idx];
                  return (
                    <div key={row.week} className={`grid grid-cols-3 h-9 border-b border-gray-100 ${rowBg(idx)}`}>
                      <div className={`${dataCell} font-semibold text-gray-700`}>{ads}</div>
                      <div className={`${dataCell} font-semibold text-gray-700`}>{strikes}</div>
                      <div className={`${dataCell} font-semibold text-gray-700`} style={heatStyle(ads, strikes)}>
                        {fmtPct(ads, strikes)}
                      </div>
                    </div>
                  );
                })}
                <div className="grid grid-cols-3 h-9 border-t-2 border-gray-300 bg-gray-50">
                  <div className={`${dataCell} font-bold text-gray-800`}>{grandTotal.ads}</div>
                  <div className={`${dataCell} font-bold text-gray-800`}>{grandTotal.strikes}</div>
                  <div className={`${dataCell} font-bold text-gray-800`}>{fmtPct(grandTotal.ads, grandTotal.strikes)}</div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
