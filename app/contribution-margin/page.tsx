"use client";

import { useState, useMemo } from "react";
import { Calendar, Download } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

// ─── Column widths ─────────────────────────────────────────────────────────────
// These must stay consistent across all section tables for column alignment.

const LEFT_WIDTHS  = [130, 58, 88, 88, 88, 66, 76, 100];  // 8 cols = 694 px
const BENCH_WIDTHS = [88, 88, 76, 100, 68];                // 5 cols = 420 px
const TOTAL_LEFT   = LEFT_WIDTHS.reduce((a, b) => a + b, 0);

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTION_DEFS = [
  {
    key: "fe", label: "Front End", isFE: true,
    rows: [
      { id: "fe-0", defaultName: "Product 1" },
      { id: "fe-1", defaultName: "Product 2" },
      { id: "fe-2", defaultName: "Product 3" },
    ],
  },
  {
    key: "u1", label: "Upsell 1", isFE: false,
    rows: [
      { id: "u1-0", defaultName: "Up1 Product 1" },
      { id: "u1-1", defaultName: "Up1 Product 2" },
      { id: "u1-2", defaultName: "Up1 Product 3" },
    ],
  },
  {
    key: "u2", label: "Upsell 2", isFE: false,
    rows: [
      { id: "u2-0", defaultName: "Up2 Product 1" },
      { id: "u2-1", defaultName: "Up2 Product 2" },
      { id: "u2-2", defaultName: "Up2 Product 3" },
    ],
  },
  {
    key: "u3", label: "Upsell 3", isFE: false,
    rows: [
      { id: "u3-0", defaultName: "Up3 Product 1" },
      { id: "u3-1", defaultName: "Up3 Product 2" },
      { id: "u3-2", defaultName: "Up3 Product 3" },
    ],
  },
];

const BENCHMARK_OPTIONS = ["Youthful Brain", "Emma", "Prostaflow", "Vital BP"];

interface RowInput {
  name: string; units: string; totalPrice: string;
  ofViews: string; orders: string;
  bTotalPrice: string; bTakeRate: string;
}

function makeRow(d: string): RowInput {
  return { name: d, units: "", totalPrice: "", ofViews: "", orders: "", bTotalPrice: "", bTakeRate: "" };
}

function initState() {
  const s: Record<string, RowInput> = {};
  SECTION_DEFS.forEach(sec => sec.rows.forEach(r => { s[r.id] = makeRow(r.defaultName); }));
  return s;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const n   = (s: string) => parseFloat(s) || 0;
const pct = (v: number) => isFinite(v) && v !== 0 ? v.toFixed(2) + "%" : "";
const $   = (v: number) => v > 0 ? "$" + v.toFixed(2) : "";
const f2  = (v: number) => v > 0 ? v.toFixed(2) : "";

// ─── Cell primitives ──────────────────────────────────────────────────────────

/** White editable cell — red inset ring when empty */
function WI({
  value, onChange, align = "right",
}: { value: string; onChange: (v: string) => void; align?: "left" | "right" }) {
  const empty = !value.trim();
  return (
    <td className="p-0 bg-white border-r border-gray-100 last:border-r-0"
      style={{ boxShadow: empty ? "inset 0 0 0 2px #e21729" : "none" }}>
      <input
        type="text" value={value} onChange={e => onChange(e.target.value)}
        className={`w-full px-2 py-2.5 text-[11px] text-gray-700 placeholder-gray-300
          bg-transparent focus:outline-none focus:bg-blue-50/40
          ${align === "right" ? "text-right" : "text-left"}`}
      />
    </td>
  );
}

/** Light-grey calculated cell */
function GC({ value, bold = false }: { value: string; bold?: boolean }) {
  return (
    <td className={`px-2 py-2.5 text-right text-[11px] bg-brand-lightGrey border-r border-gray-200 last:border-r-0
      ${bold ? "font-semibold text-gray-800" : "text-gray-500"}`}>
      {value}
    </td>
  );
}

/** Light-blue benchmark editable cell — red inset ring when empty */
function BI({
  value, onChange, align = "right",
}: { value: string; onChange: (v: string) => void; align?: "left" | "right" }) {
  const empty = !value.trim();
  return (
    <td className="p-0 bg-brand-lightBlue/25 border-r border-brand-lightBlue/30 last:border-r-0"
      style={{ boxShadow: empty ? "inset 0 0 0 2px #e21729" : "none" }}>
      <input
        type="text" value={value} onChange={e => onChange(e.target.value)}
        className={`w-full px-2 py-2.5 text-[11px] text-gray-700 placeholder-gray-400
          bg-transparent focus:outline-none focus:bg-brand-lightBlue/20
          ${align === "right" ? "text-right" : "text-left"}`}
      />
    </td>
  );
}

/** Light-blue benchmark calculated cell */
function BC({ value, bold = false }: { value: string; bold?: boolean }) {
  return (
    <td className={`px-2 py-2.5 text-right text-[11px] bg-brand-lightBlue/15 border-r border-brand-lightBlue/25 last:border-r-0
      ${bold ? "font-semibold text-gray-800" : "text-gray-600"}`}>
      {value}
    </td>
  );
}

// ─── Colgroup — shared by every table ─────────────────────────────────────────

function Cols({ showBenchmark }: { showBenchmark: boolean }) {
  return (
    <colgroup>
      {LEFT_WIDTHS.map((w, i)  => <col key={i}       style={{ width: w }} />)}
      {showBenchmark && BENCH_WIDTHS.map((w, i) => <col key={"b" + i} style={{ width: w }} />)}
    </colgroup>
  );
}

// ─── DateInput — native calendar picker ───────────────────────────────────────

function DateInput({ label }: { label: string }) {
  const [val, setVal] = useState("");
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700 w-28 flex-shrink-0">{label}</span>
      <input
        type="date"
        value={val}
        onChange={e => setVal(e.target.value)}
        className="w-36 border border-gray-300 rounded px-2.5 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-brandBlue"
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContributionMarginPage() {
  const [rows, setRows]           = useState<Record<string, RowInput>>(initState);
  const [showBenchmark, setShowBenchmark] = useState(true);
  const [benchmarkClient, setBenchmarkClient] = useState("");
  const [showTutorial, setShowTutorial] = useState(false);

  const update = (id: string, field: keyof RowInput, value: string) =>
    setRows(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));

  // FE total orders is the denominator for all take-rate calcs
  const feTotalOrders = useMemo(() =>
    SECTION_DEFS.find(s => s.key === "fe")!.rows
      .reduce((sum, r) => sum + n(rows[r.id].orders), 0),
    [rows]
  );

  const computed = useMemo(() => {
    const m: Record<string, { takeRate: number; aovCm: number; ppu: number; bPpu: number; bAovCm: number }> = {};
    SECTION_DEFS.forEach(sec => sec.rows.forEach(rd => {
      const r    = rows[rd.id];
      const units = n(r.units), tp = n(r.totalPrice), orders = n(r.orders);
      const bTp   = n(r.bTotalPrice), bTr = n(r.bTakeRate);
      const takeRate = feTotalOrders > 0 ? orders / feTotalOrders : 0;
      m[rd.id] = {
        takeRate,
        aovCm:  tp * takeRate,
        ppu:    units > 0 ? tp / units : 0,
        bPpu:   units > 0 ? bTp / units : 0,
        bAovCm: bTp * (bTr / 100),
      };
    }));
    return m;
  }, [rows, feTotalOrders]);

  const sections = useMemo(() =>
    SECTION_DEFS.map(sec => {
      const sOrders  = sec.rows.reduce((s, r) => s + n(rows[r.id].orders), 0);
      const sAovCm   = sec.rows.reduce((s, r) => s + computed[r.id].aovCm, 0);
      const sBAovCm  = sec.rows.reduce((s, r) => s + computed[r.id].bAovCm, 0);
      const sTR      = feTotalOrders > 0 ? sOrders / feTotalOrders : 0;
      const bTRSum   = sec.rows.reduce((s, r) => s + n(rows[r.id].bTakeRate), 0);
      const pctDif   = sAovCm > 0 ? ((sAovCm - sBAovCm) / sAovCm) * 100 : 0;
      return { ...sec, sOrders, sAovCm, sBAovCm, sTR, bTRSum, pctDif };
    }),
    [rows, feTotalOrders, computed]
  );

  // Table style: full-width when benchmark on, fixed when off
  const tStyle: React.CSSProperties = showBenchmark
    ? { width: "100%", tableLayout: "fixed", borderCollapse: "collapse" }
    : { width: TOTAL_LEFT, tableLayout: "fixed", borderCollapse: "collapse" };

  // Column header text styles
  const THL = "px-2 py-2 text-[10px] font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap text-center border-r border-gray-200 last:border-r-0 bg-brand-lightGrey";
  const THR = "px-2 py-2 text-[10px] font-semibold text-brand-darkBlue uppercase tracking-wide whitespace-nowrap text-center border-r border-brand-lightBlue/30 last:border-r-0 bg-brand-lightBlue/25";

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-4">

        {/* ── Settings / inputs card ── */}
        <div className="bg-white rounded border border-gray-200 p-5">
          <div className="flex flex-wrap items-start gap-8">

            {/* Date / URL / Checkout Visits — reduced-width fields */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 print-area">
              <DateInput label="Beginning Date" />
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 w-28 flex-shrink-0">URL</span>
                <input type="text" placeholder="Enter your URL"
                  className="w-36 border border-gray-300 rounded px-2.5 py-1.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-brandBlue" />
              </div>
              <DateInput label="Todays Date" />
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 w-28 flex-shrink-0">Checkout Visits</span>
                <input type="text" placeholder="0"
                  className="w-36 border border-gray-300 rounded px-2.5 py-1.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-brandBlue" />
              </div>
            </div>

            {/* Controls — left-aligned, Download PDF sits to the right of the two benchmark items */}
            <div className="no-print flex items-start gap-8">

              {/* Left stack: Benchmark toggle + client dropdown */}
              <div className="flex flex-col gap-3">
                {/* Benchmark toggle */}
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-medium text-gray-700">Benchmark</span>
                  <button role="switch" aria-checked={showBenchmark}
                    onClick={() => setShowBenchmark(v => !v)}
                    className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none
                      ${showBenchmark ? "bg-brand-brandBlue" : "bg-gray-300"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow
                      transition-transform duration-200 ${showBenchmark ? "translate-x-5" : ""}`} />
                  </button>
                </div>

                {/* Benchmark client — label above dropdown */}
                {showBenchmark && (
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-700">Benchmark client</span>
                    <select value={benchmarkClient} onChange={e => setBenchmarkClient(e.target.value)}
                      className="border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-brandBlue w-44">
                      <option value="">Select client…</option>
                      {BENCHMARK_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                )}
              </div>

              {/* Download PDF + Tutorial — sits to the right */}
              <div className="flex flex-col items-start gap-2 self-start mt-0.5">
                <button onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 rounded bg-brand-brandBlue text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                  <Download className="h-4 w-4" />
                  Download as PDF
                </button>
                <div className="flex flex-col items-start gap-1">
                  <span className="text-xs text-gray-500">Need help using this tool?</span>
                  <button
                    onClick={() => setShowTutorial(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-brand-accentRed text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                  >
                    Watch tutorial
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Table area ── */}
        {/*
          When benchmark ON:  all tables are width:100%, stretch to fill.
          When benchmark OFF: all tables are width:TOTAL_LEFT, sit at natural size.
          overflow-x-auto handles narrow screens in either case.
        */}
        <div className="overflow-x-auto pb-2">
          <div className="space-y-3" style={showBenchmark ? undefined : { width: TOTAL_LEFT }}>

            {/* ── Column header card ── */}
            <div className="rounded overflow-hidden">
              <table style={tStyle}>
                <Cols showBenchmark={showBenchmark} />
                <thead>
                  {/* "Benchmark" label spans the right 5 cols */}
                  <tr>
                    <th colSpan={8} className="bg-brand-lightGrey py-1 border-b border-gray-200" />
                    {showBenchmark && (
                      <th colSpan={5}
                        className="bg-brand-lightBlue/25 text-brand-darkBlue text-center py-1.5 text-[11px] font-bold uppercase tracking-widest border-b border-brand-lightBlue/30">
                        Benchmark
                        {benchmarkClient && (
                          <span className="ml-2 font-normal normal-case text-[10px] text-brand-darkBlue/60">
                            — {benchmarkClient}
                          </span>
                        )}
                      </th>
                    )}
                  </tr>
                  {/* Column names */}
                  <tr>
                    <th className={`${THL} text-left`}>Product Name</th>
                    <th className={THL}>Units</th>
                    <th className={THL}>Total Price</th>
                    <th className={THL}>Price / Unit</th>
                    <th className={THL}>OF Views (Opt.)</th>
                    <th className={THL}>Orders</th>
                    <th className={THL}>Take Rate</th>
                    <th className={THL}>AOV / Cont. Margin</th>
                    {showBenchmark && <>
                      <th className={THR}>Total Price</th>
                      <th className={THR}>Price / Unit</th>
                      <th className={THR}>Take Rate</th>
                      <th className={THR}>AOV / Cont. Margin</th>
                      <th className={THR}>% Dif.</th>
                    </>}
                  </tr>
                </thead>
              </table>
            </div>

            {/* ── Section cards ── */}
            {sections.map(sec => (
              <div key={sec.key} className="rounded overflow-hidden bg-white border border-gray-200">
                <table style={tStyle}>
                  <Cols showBenchmark={showBenchmark} />
                  <tbody>

                    {/* Section header row — royal blue left, light blue right */}
                    <tr>
                      <td colSpan={8} className="bg-brand-brandBlue px-4 py-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-white">{sec.label}</span>
                          <div className="flex items-center gap-5 text-[11px] text-white/65">
                            {sec.sOrders > 0 && (
                              <span>Orders: <strong className="text-white font-semibold">{sec.sOrders}</strong></span>
                            )}
                            {!sec.isFE && sec.sTR > 0 && (
                              <span>Take Rate: <strong className="text-white font-semibold">{pct(sec.sTR * 100)}</strong></span>
                            )}
                            {sec.sAovCm > 0 && (
                              <span>AOV/CM: <strong className="text-white font-semibold">{$(sec.sAovCm)}</strong></span>
                            )}
                          </div>
                        </div>
                      </td>
                      {showBenchmark && (
                        <td colSpan={5} className="bg-brand-lightBlue px-4 py-2.5">
                          <div className="flex items-center justify-end gap-5 text-[11px] text-brand-darkBlue/70">
                            {sec.sBAovCm > 0 && (
                              <span>B. AOV/CM: <strong className="text-brand-darkBlue font-semibold">{$(sec.sBAovCm)}</strong></span>
                            )}
                            {sec.sAovCm > 0 && sec.sBAovCm > 0 && (
                              <span>% Dif: <strong className="text-brand-darkBlue font-semibold">{pct(sec.pctDif)}</strong></span>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>

                    {/* Product rows */}
                    {sec.rows.map((rd, ri) => {
                      const r = rows[rd.id];
                      const c = computed[rd.id];
                      return (
                        <tr key={rd.id}
                          className={ri < sec.rows.length - 1 ? "border-b border-gray-100" : ""}>
                          <WI value={r.name}       onChange={v => update(rd.id, "name",       v)} align="left" />
                          <WI value={r.units}      onChange={v => update(rd.id, "units",      v)} />
                          <WI value={r.totalPrice} onChange={v => update(rd.id, "totalPrice", v)} />
                          <GC value={f2(c.ppu)} />
                          <WI value={r.ofViews}    onChange={v => update(rd.id, "ofViews",    v)} />
                          <WI value={r.orders}     onChange={v => update(rd.id, "orders",     v)} />
                          <GC value={c.takeRate > 0 ? pct(c.takeRate * 100) : ""} />
                          <GC value={$(c.aovCm)} bold />
                          {showBenchmark && <>
                            <BI value={r.bTotalPrice} onChange={v => update(rd.id, "bTotalPrice", v)} />
                            <BC value={f2(c.bPpu)} />
                            <BI value={r.bTakeRate}   onChange={v => update(rd.id, "bTakeRate",   v)} />
                            <BC value={$(c.bAovCm)} bold />
                            <BC value={c.aovCm > 0 && c.bAovCm > 0
                              ? pct(((c.aovCm - c.bAovCm) / c.aovCm) * 100) : ""} />
                          </>}
                        </tr>
                      );
                    })}

                  </tbody>
                </table>
              </div>
            ))}

          </div>
        </div>

      </div>

      {/* ── Tutorial modal ── */}
      {showTutorial && (
        <div
          className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60"
          onClick={() => setShowTutorial(false)}
        >
          <div
            className="relative w-full max-w-3xl mx-4 bg-black rounded overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowTutorial(false)}
              className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              aria-label="Close tutorial"
            >
              ✕
            </button>
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src="https://www.loom.com/embed/abf7f7004b024beba9de0eea2d121890"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                style={{ border: "none" }}
              />
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
