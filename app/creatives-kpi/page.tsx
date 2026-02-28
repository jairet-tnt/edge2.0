"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  ChevronDown, ChevronUp, X, Plus, Trash2, RefreshCw,
  Upload, Save, TableProperties,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

// ─── Seeded random ─────────────────────────────────────────────────────────────
function sr(n: number) { return Math.abs(Math.sin(n + 17) * 10000) % 1; }

// ─── Types ────────────────────────────────────────────────────────────────────
type TableLook = "striped" | "heatmap";
type SortDir   = "asc" | "desc";

interface SearchCondition { id: number; field: string; operator: string; value: string; caseSens: boolean; }
interface SearchBlock     { id: number; conditions: SearchCondition[]; }

interface AdRow {
  id: number; adName: string; campaignName: string; adsetName: string;
  spokesperson: string; week: string; month: string; adType: string;
  platform: string; client: string; funnel: string;
  spend: number; impressions: number; clicks: number;
  purchases: number; revenue: number; views3s: number; thruPlays: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const SEARCH_FIELDS   = ["Campaign Name","Ad Name","Adset Name","Spend","Impressions","Clicks","CTR","ROAS","CPA","CPM"];
const SEARCH_OPS      = ["Contains","Does not contain","Equals","Greater than","Less than"];
const FILTER_FIELDS   = ["Spend","Impressions","CPM","Clicks","CPC","CTR (%)","Purchases","CPA","ROAS"];
const FILTER_OPS      = ["More than","Less than","Equals","≥","≤"];
const FILTER_LEVELS   = ["lvl-1x","lvl-2x","lvl-3x"];
const CAL_RANGES      = ["Today","Yesterday","Last 3 Days","Last 7 Days","Last 14 Days","Last 30 Days","This Month","Last Month","Custom"];
const PLATFORM_OPTS   = ["","All","Facebook","Instagram","TikTok","YouTube","Snapchat"];
const BD_LEVEL_OPTS   = ["","None","Age","Gender","Country","Region","Platform","Device","Publisher Platform"];
const PRODUCTS        = ["Youthful Brain","Emma","Prostaflow","Vital BP","Core Shield"];
const SPOKESPERSONS   = ["Sarah J.","Mike T.","Emma L.","John D.","Anna R."];
const AD_TYPES_RAW    = ["UGC","VSL","Hook","Testimonial","Demo","Static"];
const PLATFORMS_LIST  = ["Facebook","Instagram","TikTok"];
const AD_TYPES_FULL   = ["Long Form","Short Form","Static","Carousel"];
const WEEKS           = ["2025-W01","2025-W02","2025-W03","2025-W04","2025-W05"];
const MONTHS_LIST     = ["Jan 2025","Feb 2025","Mar 2025"];

// Breakdown checkbox columns (matching screenshots exactly)
const BD_COL1 = ["Ad name","Campaign name","Adset name","Editors","Producers","Writers","Coordinator","Testing Element","Hook Description","ClickBait","Description","List","Placement / Platform","Pipeline","Core Video Name","Format","Spokesperson","Body Writer"];
const BD_COL2 = ["Hook Writer","Variation Writer","Variation Type","Creative Producer","Video Editor","Aspect Ratio","Senior Reviewing Writer","Click Bait Editor","Editing Team Lead","Variation Description","Duration","Marketing Stage","PT Copy ID","HL ID","Image ID (Static)","Cell"];
const BD_COL3 = ["Client","Funnel","Platform","Account","Day","Week","Month","Ad Type","Post Text Length","Landing Page URL","Lookalike Expansion","Custom Audience Expansion","Adv+ Targeting","Learning Stage","CBO","Bid Strategy"];

// Custom field checkbox columns (matching screenshots exactly)
const CF_COL1 = ["3sV EngR.","10sV EngR.","CP3sV","CP10sV","CPOPV","OPVCVR","CVR","AoV","Revenue","EPC","Total profit","ROAS Target","3s %"];
const CF_COL2 = ["25%","50%","75%","95%","100%","CP15s","CP30s","60s Retention%","Avg View Time","Strike Rate","Strike Rate Eligible","Strike","Hook"];
const CF_COL3 = ["Asset Link","CB Asset Link","CB Asset Link (No Banner)","Headline Text","Hook Post Text Copy","Post Text","Script Document Link","Accounts","Clients","Funnels","See More Rate"];

// ─── Mock data — 30 rows ──────────────────────────────────────────────────────
const MOCK_DATA: AdRow[] = Array.from({ length: 30 }, (_, i) => {
  const spend       = Math.round((sr(i)       * 3000 + 200)   * 100) / 100;
  const impressions = Math.round( sr(i + 50)  * 800000 + 20000);
  const clicks      = Math.round( sr(i + 100) * impressions * 0.07 + 100);
  const purchases   = Math.round( sr(i + 150) * 300 + 5);
  const revenue     = Math.round(purchases * (sr(i + 200) * 100 + 50) * 100) / 100;
  const views3s     = Math.round( sr(i + 250) * impressions * 0.45 + 2000);
  const thruPlays   = Math.round( sr(i + 300) * views3s * 0.5 + 200);
  return {
    id: i + 1,
    adName:       `${PRODUCTS[i % 5]} · ${AD_TYPES_RAW[i % 6]} ${String(i + 1).padStart(2,"0")}`,
    campaignName: `Campaign — ${PRODUCTS[i % 5]}`,
    adsetName:    `Adset ${i % 4 + 1}`,
    spokesperson:  SPOKESPERSONS[i % 5],
    week:          WEEKS[i % 5],
    month:         MONTHS_LIST[i % 3],
    adType:        AD_TYPES_FULL[i % 4],
    platform:      PLATFORMS_LIST[i % 3],
    client:        PRODUCTS[i % 5],
    funnel:       `Funnel ${i % 3 + 1}`,
    spend, impressions, clicks, purchases, revenue, views3s, thruPlays,
  };
});

// ─── Derived metrics ──────────────────────────────────────────────────────────
function derive(r: AdRow) {
  return {
    cpm:  r.impressions > 0 ? (r.spend / r.impressions) * 1000 : 0,
    cpc:  r.clicks      > 0 ?  r.spend / r.clicks             : 0,
    ctr:  r.impressions > 0 ?  r.clicks / r.impressions        : 0,
    cpa:  r.purchases   > 0 ?  r.spend / r.purchases           : 0,
    roas: r.spend       > 0 ?  r.revenue / r.spend             : 0,
    cvr:  r.clicks      > 0 ?  r.purchases / r.clicks          : 0,
    aov:  r.purchases   > 0 ?  r.revenue / r.purchases         : 0,
    epc:  r.clicks      > 0 ?  r.revenue / r.clicks            : 0,
    v3pct:r.impressions > 0 ?  r.views3s / r.impressions       : 0,
    hookR:r.impressions > 0 ?  r.views3s / r.impressions       : 0,
    holdR:r.views3s     > 0 ?  r.thruPlays / r.views3s         : 0,
  };
}

// ─── Formatting ───────────────────────────────────────────────────────────────
const fmt$ = (v: number) => "$" + v.toFixed(2);
const fmtK = (v: number) => v >= 1000 ? (v / 1000).toFixed(1) + "k" : String(v);
const fmtPct = (v: number) => (v * 100).toFixed(2) + "%";
const fmtX  = (v: number) => v.toFixed(2) + "x";

// ─── Heatmap color ────────────────────────────────────────────────────────────
function heatColor(ratio: number, invert = false): string {
  const r = invert ? 1 - ratio : ratio;
  if (r < 0.5) {
    const t = r * 2;
    return `rgba(${Math.round(220 + 35 * t)},${Math.round(50 + 175 * t)},50,0.35)`;
  }
  const t = (r - 0.5) * 2;
  return `rgba(${Math.round(255 - 205 * t)},${Math.round(225 - 25 * t)},50,0.35)`;
}

// ─── useDropdown hook ─────────────────────────────────────────────────────────
function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  return { open, setOpen, ref };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CollapsibleSection({ title, open, onToggle, children }: {
  title: string; open: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-5 py-3.5 cursor-pointer select-none"
        onClick={onToggle}>
        <span className="text-sm font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </div>
      {open && <div className="border-t border-gray-100 px-5 py-4">{children}</div>}
    </div>
  );
}

function CheckboxColumn({ items, selected, onToggle }: {
  items: string[]; selected: Set<string>; onToggle: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {items.map(item => (
        <label key={item} className="flex items-start gap-2 cursor-pointer group">
          <input type="checkbox" checked={selected.has(item)} onChange={() => onToggle(item)}
            className="mt-0.5 w-3.5 h-3.5 rounded border-gray-300 accent-brand-brandBlue flex-shrink-0" />
          <span className="text-[12px] text-gray-700 group-hover:text-gray-900 leading-tight">{item}</span>
        </label>
      ))}
    </div>
  );
}

function Sel({ value, options, onChange, placeholder = "", className = "" }: {
  value: string; options: string[]; onChange: (v: string) => void; placeholder?: string; className?: string;
}) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className={`border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-brandBlue bg-white w-full ${className}`}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.filter(o => o !== "").map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CreativesKpiPage() {
  // Filter state
  const [account,       setAccount]       = useState("");
  const [funnel,        setFunnel]         = useState("");
  const [platform,      setPlatform]       = useState("");
  const [dateRange,     setDateRange]      = useState("2026-02-21 to 2026-02-28");
  const [calRange,      setCalRange]       = useState("Last 7 Days");
  const [breakdown,     setBreakdown]      = useState("");
  const [cell,          setCell]           = useState("");
  const [client,        setClient]         = useState("");
  const [startDate,     setStartDate]      = useState("");
  const [startDateRange,setStartDateRange] = useState("");
  const [breakdown2,    setBreakdown2]     = useState("");
  const [breakdown3,    setBreakdown3]     = useState("");
  const [firstTime,     setFirstTime]      = useState(false);

  // Section open state
  const [secSF,  setSecSF]  = useState(true);
  const [secAS,  setSecAS]  = useState(true);
  const [secTF,  setSecTF]  = useState(true);
  const [secSR,  setSecSR]  = useState(true);

  // Advanced search
  const nextId = useRef(10);
  const [blocks, setBlocks] = useState<SearchBlock[]>([{
    id: 1,
    conditions: [{ id: 2, field: "Campaign Name", operator: "Contains", value: "", caseSens: false }],
  }]);

  const addBlock = () => {
    const bid = nextId.current++, cid = nextId.current++;
    setBlocks(prev => [...prev, { id: bid, conditions: [{ id: cid, field: "Campaign Name", operator: "Contains", value: "", caseSens: false }] }]);
  };
  const addNested = (bid: number) => {
    const cid = nextId.current++;
    setBlocks(prev => prev.map(b => b.id === bid ? { ...b, conditions: [...b.conditions, { id: cid, field: "Campaign Name", operator: "Contains", value: "", caseSens: false }] } : b));
  };
  const deleteBlock = (bid: number) => setBlocks(prev => prev.filter(b => b.id !== bid));
  const updateCond = (bid: number, cid: number, key: string, val: string | boolean) =>
    setBlocks(prev => prev.map(b => b.id === bid ? { ...b, conditions: b.conditions.map(c => c.id === cid ? { ...c, [key]: val } : c) } : b));

  // Table filter
  const [tfField,    setTfField]    = useState("Spend");
  const [tfOp,       setTfOp]       = useState("More than");
  const [tfVal,      setTfVal]      = useState("");
  const [tfLevels,   setTfLevels]   = useState(new Set(["lvl-1x","lvl-2x","lvl-3x"]));
  const toggleLevel  = (l: string)  => setTfLevels(prev => { const n = new Set(prev); n.has(l) ? n.delete(l) : n.add(l); return n; });

  // Strike rate
  const [spendLimit,   setSpendLimit]   = useState("");
  const [eligibleOnly, setEligibleOnly] = useState(false);

  // Table controls
  const [customFields, setCustomFields] = useState<Set<string>>(new Set());
  const [breakdownCols,setBreakdownCols]= useState<Set<string>>(new Set(["Ad name"]));
  const [tableLook,    setTableLook]    = useState<TableLook>("striped");
  const [sortKey,      setSortKey]      = useState("spend");
  const [sortDir,      setSortDir]      = useState<SortDir>("desc");
  const [saveProfile,  setSaveProfile]  = useState("default");

  const toggleCF = (f: string) => setCustomFields(prev => { const n = new Set(prev); n.has(f) ? n.delete(f) : n.add(f); return n; });
  const toggleBD = (f: string) => setBreakdownCols(prev => { const n = new Set(prev); n.has(f) ? n.delete(f) : n.add(f); return n; });

  // Dropdowns
  const cfDrop   = useDropdown();
  const bdDrop   = useDropdown();
  const slDrop   = useDropdown();
  const tlDrop   = useDropdown();

  // Sorted data
  const sortedData = useMemo(() => [...MOCK_DATA].sort((a, b) => {
    const da = derive(a), db = derive(b);
    const map = (r: AdRow, d: ReturnType<typeof derive>): Record<string, number> => ({
      spend: r.spend, impressions: r.impressions, clicks: r.clicks,
      purchases: r.purchases, revenue: r.revenue,
      cpm: d.cpm, cpc: d.cpc, ctr: d.ctr, cpa: d.cpa, roas: d.roas,
    });
    const va = map(a, da)[sortKey] ?? 0, vb = map(b, db)[sortKey] ?? 0;
    return sortDir === "asc" ? va - vb : vb - va;
  }), [sortKey, sortDir]);

  // Column min/max for heatmap
  const colMM = useMemo(() => {
    const keys = ["spend","impressions","cpm","clicks","cpc","ctr","purchases","cpa","roas"];
    const r: Record<string, { min: number; max: number }> = {};
    keys.forEach(k => {
      const vals = MOCK_DATA.map(row => {
        const d = derive(row);
        return ({ spend: row.spend, impressions: row.impressions, clicks: row.clicks, purchases: row.purchases, cpm: d.cpm, cpc: d.cpc, ctr: d.ctr, cpa: d.cpa, roas: d.roas } as Record<string,number>)[k] ?? 0;
      });
      r[k] = { min: Math.min(...vals), max: Math.max(...vals) };
    });
    return r;
  }, []);

  const handleSort = (key: string) => {
    if (key === sortKey) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  // Totals
  const totals = useMemo(() => {
    let spend = 0, impressions = 0, clicks = 0, purchases = 0, revenue = 0;
    MOCK_DATA.forEach(r => { spend += r.spend; impressions += r.impressions; clicks += r.clicks; purchases += r.purchases; revenue += r.revenue; });
    const d = derive({ id:0, adName:"", campaignName:"", adsetName:"", spokesperson:"", week:"", month:"", adType:"", platform:"", client:"", funnel:"", spend, impressions, clicks, purchases, revenue, views3s:0, thruPlays:0 });
    return { spend, impressions, clicks, purchases, revenue, ...d };
  }, []);

  // Base metric columns
  const BASE_COLS = [
    { key:"spend",       label:"SPEND",   fmt:(r:AdRow,d:ReturnType<typeof derive>)=>fmt$(r.spend),    invert:false },
    { key:"impressions", label:"IMPR.",    fmt:(r:AdRow,_d:ReturnType<typeof derive>)=>fmtK(r.impressions), invert:false },
    { key:"cpm",         label:"CPM",     fmt:(_r:AdRow,d:ReturnType<typeof derive>)=>fmt$(d.cpm),    invert:true  },
    { key:"clicks",      label:"CLICKS",  fmt:(r:AdRow,_d:ReturnType<typeof derive>)=>fmtK(r.clicks), invert:false },
    { key:"cpc",         label:"CPC",     fmt:(_r:AdRow,d:ReturnType<typeof derive>)=>fmt$(d.cpc),    invert:true  },
    { key:"ctr",         label:"CTR (%)", fmt:(_r:AdRow,d:ReturnType<typeof derive>)=>fmtPct(d.ctr),  invert:false },
    { key:"purchases",   label:"PURCH.",  fmt:(r:AdRow,_d:ReturnType<typeof derive>)=>String(r.purchases), invert:false },
    { key:"cpa",         label:"CPA",     fmt:(_r:AdRow,d:ReturnType<typeof derive>)=>fmt$(d.cpa),    invert:true  },
    { key:"roas",        label:"ROAS",    fmt:(_r:AdRow,d:ReturnType<typeof derive>)=>fmtX(d.roas),   invert:false },
  ];

  // Custom field columns
  const CF_COLS = [...customFields].map(cf => ({
    key: cf, label: cf.toUpperCase(),
    fmt: (r: AdRow, d: ReturnType<typeof derive>) => {
      const m: Record<string,string> = {
        "CVR": fmtPct(d.cvr), "AoV": fmt$(d.aov), "Revenue": fmt$(r.revenue),
        "EPC": fmt$(d.epc), "3sV EngR.": fmtPct(d.hookR), "10sV EngR.": fmtPct(d.holdR * 0.8),
        "ROAS Target": "2.50x", "3s %": fmtPct(d.v3pct),
        "Total profit": fmt$(r.revenue - r.spend),
        "Strike Rate": (sr(r.id * 7) * 100).toFixed(1) + "%",
        "Hook": (sr(r.id * 13) * 100).toFixed(1) + "%",
      };
      return m[cf] ?? "—";
    },
  }));

  // Extra breakdown columns (besides Ad name)
  const extraBD = [...breakdownCols].filter(b => b !== "Ad name");
  const getBDVal = (r: AdRow, bd: string) => ({
    "Spokesperson":r.spokesperson,"Week":r.week,"Month":r.month,"Ad Type":r.adType,
    "Platform":r.platform,"Client":r.client,"Campaign name":r.campaignName,
    "Adset name":r.adsetName,"Funnel":r.funnel,
  } as Record<string,string>)[bd] ?? "—";

  // Heatmap cell style
  const heatStyle = (key: string, invert: boolean) => {
    if (tableLook !== "heatmap") return {};
    const mm = colMM[key]; if (!mm || mm.max === mm.min) return {};
    return { backgroundColor: heatColor(0, invert) }; // placeholder; computed per-row below
  };
  const heatStyleVal = (key: string, val: number, invert: boolean) => {
    if (tableLook !== "heatmap") return {};
    const mm = colMM[key]; if (!mm || mm.max === mm.min) return {};
    return { backgroundColor: heatColor((val - mm.min) / (mm.max - mm.min), invert) };
  };

  const SortIcon = ({ k }: { k: string }) => (
    sortKey === k
      ? sortDir === "asc" ? <ChevronUp className="h-3 w-3 inline ml-0.5" /> : <ChevronDown className="h-3 w-3 inline ml-0.5" />
      : <span className="inline ml-0.5 opacity-30 text-[10px]">↕</span>
  );

  // CSV download
  const downloadCsv = () => {
    const headers = ["Ad Name", ...extraBD, ...BASE_COLS.map(c=>c.label), ...[...customFields]];
    const rows = sortedData.map(r => {
      const d = derive(r);
      return [r.adName, ...extraBD.map(bd=>getBDVal(r,bd)), ...BASE_COLS.map(c=>c.fmt(r,d)), ...CF_COLS.map(c=>c.fmt(r,d))];
    });
    const csv = [headers,...rows].map(r=>r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "creatives-kpi.csv"; a.click();
  };

  // Shared button styles
  const btnOutline = "flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-semibold border-brand-brandBlue text-brand-brandBlue hover:bg-brand-brandBlue hover:text-white transition-colors";
  const btnFilled  = "flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-semibold bg-brand-brandBlue border-brand-brandBlue text-white hover:opacity-90 transition-opacity";
  const label = "text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1";
  const input = "border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-brandBlue bg-white w-full";

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-4">

        {/* ── Top Filters Card ── */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 space-y-4">

          {/* Row 1 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-3">
            <div><div className={label}>Account</div>
              <Sel value={account} options={["Account 1","Account 2","Account 3"]} onChange={setAccount} placeholder="Select..." /></div>
            <div><div className={label}>Funnel</div>
              <Sel value={funnel} options={["Funnel 1","Funnel 2","Funnel 3"]} onChange={setFunnel} placeholder="Select..." /></div>
            <div><div className={label}>Platform</div>
              <Sel value={platform} options={PLATFORM_OPTS} onChange={setPlatform} placeholder="Select..." /></div>
            <div><div className={label}>Date Range</div>
              <input type="text" value={dateRange} onChange={e=>setDateRange(e.target.value)} className={input} /></div>
            <div><div className={label}>Calendar Range</div>
              <Sel value={calRange} options={CAL_RANGES} onChange={setCalRange} /></div>
            <div><div className={label}>Breakdown</div>
              <Sel value={breakdown} options={BD_LEVEL_OPTS} onChange={setBreakdown} placeholder="Select..." /></div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-3 items-end">
            <div><div className={label}>Cell</div>
              <Sel value={cell} options={["Cell A","Cell B","Cell C"]} onChange={setCell} placeholder="Select..." /></div>
            <div><div className={label}>Client</div>
              <Sel value={client} options={PRODUCTS} onChange={setClient} placeholder="Select..." /></div>
            <div><div className={label}>Start Date</div>
              <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} className={input} /></div>
            <div><div className={label}>Start Date Range</div>
              <Sel value={startDateRange} options={["Last 7 Days","Last 30 Days","Custom"]} onChange={setStartDateRange} placeholder="..." /></div>
            <div><div className={label}>Breakdown, Level-2</div>
              <Sel value={breakdown2} options={BD_LEVEL_OPTS} onChange={setBreakdown2} placeholder="Select..." /></div>
            <div>
              <div className={label}>Breakdown, Level-3</div>
              <div className="flex gap-2">
                <Sel value={breakdown3} options={BD_LEVEL_OPTS} onChange={setBreakdown3} placeholder="Select..." />
                <button className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-brand-lightBlue hover:bg-brand-brandBlue text-white transition-colors">
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 1st Time Launched */}
          <div className="flex items-center gap-2">
            <button role="switch" aria-checked={firstTime} onClick={()=>setFirstTime(v=>!v)}
              className={`relative w-8 h-4 rounded-full transition-colors ${firstTime ? "bg-brand-brandBlue" : "bg-gray-300"}`}>
              <span className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${firstTime ? "translate-x-4" : ""}`} />
            </button>
            <span className="text-xs text-gray-600">1st Time Launched</span>
          </div>
        </div>

        {/* ── Search and Filters Manager ── */}
        <CollapsibleSection title="Search and Filters Manager" open={secSF} onToggle={()=>setSecSF(v=>!v)}>
          <div className="flex flex-wrap items-center gap-2">
            <select className="border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-brandBlue bg-white w-44">
              <option>Default</option><option>Filter Set 1</option><option>Filter Set 2</option>
            </select>
            <button className={btnOutline}><Upload className="h-3.5 w-3.5" />LOAD</button>
            <button className={btnOutline}><Save className="h-3.5 w-3.5" />SAVE</button>
            <button className={btnOutline}><Save className="h-3.5 w-3.5" />SAVE AS...</button>
            <button className={btnOutline}><Plus className="h-3.5 w-3.5" /></button>
          </div>
        </CollapsibleSection>

        {/* ── Advanced Search ── */}
        <CollapsibleSection title="Advanced Search" open={secAS} onToggle={()=>setSecAS(v=>!v)}>
          <div className="space-y-3">
            {blocks.map(block => (
              <div key={block.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50/40 space-y-2">
                {block.conditions.map((cond, ci) => (
                  <div key={cond.id} className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase w-10 flex-shrink-0">
                      {ci === 0 ? "WHERE" : "AND"}
                    </span>
                    <div className="flex items-center gap-1 border border-gray-300 rounded px-2 py-1 bg-white">
                      <select value={cond.field} onChange={e=>updateCond(block.id,cond.id,"field",e.target.value)}
                        className="text-xs text-gray-700 focus:outline-none bg-transparent min-w-[130px]">
                        {SEARCH_FIELDS.map(f=><option key={f}>{f}</option>)}
                      </select>
                      <X className="h-3 w-3 text-gray-400 cursor-pointer hover:text-gray-600" onClick={()=>updateCond(block.id,cond.id,"field","Campaign Name")} />
                    </div>
                    <select value={cond.operator} onChange={e=>updateCond(block.id,cond.id,"operator",e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-xs text-gray-700 bg-white focus:outline-none">
                      {SEARCH_OPS.map(o=><option key={o}>{o}</option>)}
                    </select>
                    <input type="text" value={cond.value} onChange={e=>updateCond(block.id,cond.id,"value",e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-xs text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-brand-brandBlue w-32" />
                    <label className="flex items-center gap-1 text-xs text-gray-600 cursor-pointer">
                      <input type="checkbox" checked={cond.caseSens} onChange={e=>updateCond(block.id,cond.id,"caseSens",e.target.checked)}
                        className="accent-brand-brandBlue" />
                      Case Sens.
                    </label>
                    <button onClick={()=>updateCond(block.id,cond.id,"value","")}
                      className="text-gray-400 hover:text-brand-accentRed transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-1">
                  <button onClick={()=>addNested(block.id)}
                    className="text-xs text-brand-brandBlue hover:underline flex items-center gap-1">
                    <Plus className="h-3 w-3" /> ADD NESTED CONDITION
                  </button>
                  <div className="flex gap-2">
                    <button onClick={()=>addNested(block.id)}
                      className="text-xs px-2 py-1 border border-gray-300 rounded text-gray-600 hover:border-brand-brandBlue transition-colors">+1</button>
                    <button onClick={()=>deleteBlock(block.id)}
                      className="text-xs px-2 py-1 border border-gray-300 rounded text-gray-600 hover:border-brand-accentRed hover:text-brand-accentRed transition-colors">DELETE BLOCK</button>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between">
              <button onClick={addBlock} className={btnOutline}>ADD BLOCK</button>
              <button onClick={()=>setBlocks([])}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand-accentRed transition-colors">
                <Trash2 className="h-3.5 w-3.5" /> DELETE ALL BLOCKS
              </button>
            </div>
            <div className="border-t border-gray-100 pt-3">
              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-700 transition-colors">
                <RefreshCw className="h-4 w-4" /> SUBMIT SEARCH
              </button>
            </div>
          </div>
        </CollapsibleSection>

        {/* ── Table Filter ── */}
        <CollapsibleSection title="Table Filter" open={secTF} onToggle={()=>setSecTF(v=>!v)}>
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 border border-gray-300 rounded px-2 py-1.5 bg-white">
                <select value={tfField} onChange={e=>setTfField(e.target.value)}
                  className="text-xs text-gray-700 bg-transparent focus:outline-none">
                  {FILTER_FIELDS.map(f=><option key={f}>{f}</option>)}
                </select>
                <X className="h-3 w-3 text-gray-400 cursor-pointer hover:text-gray-600" onClick={()=>setTfField("Spend")} />
              </div>
              <select value={tfOp} onChange={e=>setTfOp(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-700 bg-white focus:outline-none">
                {FILTER_OPS.map(o=><option key={o}>{o}</option>)}
              </select>
              <input type="number" value={tfVal} onChange={e=>setTfVal(e.target.value)} placeholder="Value..."
                className="border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-brand-brandBlue w-24" />
              <div className="flex gap-1">
                {FILTER_LEVELS.map(lvl => (
                  <button key={lvl} onClick={()=>toggleLevel(lvl)}
                    className={`flex items-center gap-0.5 px-2 py-1 text-xs rounded border transition-colors ${tfLevels.has(lvl) ? "bg-brand-brandBlue text-white border-brand-brandBlue" : "text-gray-600 border-gray-300 hover:border-brand-brandBlue"}`}>
                    {lvl} <X className="h-2.5 w-2.5" />
                  </button>
                ))}
              </div>
              <select className="border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-700 bg-white focus:outline-none w-20">
                <option>All</option><option>Any</option>
              </select>
              {["AND","OR","DEL"].map(btn => (
                <button key={btn}
                  className={`px-2.5 py-1 text-xs rounded border font-semibold transition-colors ${btn==="DEL" ? "border-gray-300 text-gray-500 hover:border-brand-accentRed hover:text-brand-accentRed" : "border-brand-brandBlue text-brand-brandBlue hover:bg-brand-brandBlue hover:text-white"}`}>
                  {btn}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button className={btnFilled}>APPLY FILTER</button>
              <button className={btnOutline}>CLEAR FILTER</button>
            </div>
          </div>
        </CollapsibleSection>

        {/* ── Strike Rate ── */}
        <CollapsibleSection title="Strike Rate" open={secSR} onToggle={()=>setSecSR(v=>!v)}>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-gray-600 font-medium">Spend Limit</span>
            <input type="number" value={spendLimit} onChange={e=>setSpendLimit(e.target.value)}
              placeholder="Enter Value..."
              className="border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-brandBlue w-40" />
            <button className={btnFilled}>APPLY</button>
            <div className="flex items-center gap-2">
              <button role="switch" aria-checked={eligibleOnly} onClick={()=>setEligibleOnly(v=>!v)}
                className={`relative w-8 h-4 rounded-full transition-colors ${eligibleOnly ? "bg-brand-brandBlue" : "bg-gray-300"}`}>
                <span className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${eligibleOnly ? "translate-x-4" : ""}`} />
              </button>
              <span className="text-sm text-gray-600">Eligible Ads Only</span>
            </div>
          </div>
        </CollapsibleSection>

        {/* ── Table Card ── */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">

          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-end gap-2 px-4 py-3 border-b border-gray-100">

            {/* Custom Fields */}
            <div className="relative" ref={cfDrop.ref}>
              <button onClick={()=>cfDrop.setOpen(o=>!o)}
                className={customFields.size > 0 ? btnFilled : btnOutline}>
                CUSTOM FIELDS <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {cfDrop.open && (
                <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-4" style={{minWidth:540}}>
                  <div className="grid grid-cols-3 gap-x-6">
                    <CheckboxColumn items={CF_COL1} selected={customFields} onToggle={toggleCF} />
                    <CheckboxColumn items={CF_COL2} selected={customFields} onToggle={toggleCF} />
                    <CheckboxColumn items={CF_COL3} selected={customFields} onToggle={toggleCF} />
                  </div>
                </div>
              )}
            </div>

            {/* Breakdowns */}
            <div className="relative" ref={bdDrop.ref}>
              <button onClick={()=>bdDrop.setOpen(o=>!o)}
                className={breakdownCols.size > 1 ? btnFilled : btnOutline}>
                BREAKDOWNS <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {bdDrop.open && (
                <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-4" style={{minWidth:580}}>
                  <div className="grid grid-cols-3 gap-x-6">
                    <CheckboxColumn items={BD_COL1} selected={breakdownCols} onToggle={toggleBD} />
                    <CheckboxColumn items={BD_COL2} selected={breakdownCols} onToggle={toggleBD} />
                    <CheckboxColumn items={BD_COL3} selected={breakdownCols} onToggle={toggleBD} />
                  </div>
                </div>
              )}
            </div>

            {/* Save/Load */}
            <div className="relative" ref={slDrop.ref}>
              <button onClick={()=>slDrop.setOpen(o=>!o)} className={btnOutline}>
                SAVE/LOAD <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {slDrop.open && (
                <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1" style={{minWidth:230}}>
                  <div className="px-3 py-2 border-b border-gray-100">
                    <div className="flex items-center gap-1 border border-gray-300 rounded px-2 py-1 bg-white">
                      <input value={saveProfile} onChange={e=>setSaveProfile(e.target.value)}
                        className="text-xs text-gray-700 flex-1 focus:outline-none" />
                      <X className="h-3 w-3 text-gray-400 cursor-pointer" onClick={()=>setSaveProfile("")} />
                    </div>
                  </div>
                  {[
                    { icon:<Upload className="h-3.5 w-3.5"/>, label:"Load Breakdowns" },
                    { icon:<Save   className="h-3.5 w-3.5"/>, label:"Save Breakdowns" },
                    { icon:<Save   className="h-3.5 w-3.5"/>, label:"Save Breakdowns As..." },
                    { icon:<Trash2 className="h-3.5 w-3.5"/>, label:"Delete Selected Breakdowns" },
                  ].map(item => (
                    <button key={item.label}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-brand-lightGrey transition-colors text-left">
                      {item.icon} {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Table Look */}
            <div className="relative" ref={tlDrop.ref}>
              <button onClick={()=>tlDrop.setOpen(o=>!o)}
                className={tableLook === "heatmap" ? btnFilled : btnOutline}>
                TABLE LOOK <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {tlDrop.open && (
                <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1" style={{minWidth:130}}>
                  {(["striped","heatmap"] as TableLook[]).map(look => (
                    <button key={look} onClick={()=>{setTableLook(look);tlDrop.setOpen(false);}}
                      className={`w-full text-left px-4 py-2 text-xs transition-colors ${tableLook===look ? "text-brand-brandBlue font-semibold bg-brand-brandBlue/5" : "text-gray-700 hover:bg-brand-lightGrey"}`}>
                      {look === "striped" ? "Striped" : "Heat Map"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Save CSV */}
            <button onClick={downloadCsv} className={btnFilled}>
              <TableProperties className="h-3.5 w-3.5" /> SAVE CSV
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table style={{borderCollapse:"collapse", width:"100%"}}>
              <thead>
                <tr className="border-b border-gray-200 bg-white">
                  <th className="px-3 py-2.5 w-7 border-r border-gray-100">
                    <ChevronDown className="h-3 w-3 text-gray-400 mx-auto" />
                  </th>
                  <th className="px-3 py-2.5 w-9 border-r border-gray-100">
                    <ChevronDown className="h-3 w-3 text-gray-400 mx-auto" />
                  </th>
                  <th onClick={()=>handleSort("adName")}
                    className="px-3 py-2.5 text-[10px] font-semibold text-gray-600 uppercase tracking-wide text-left whitespace-nowrap cursor-pointer hover:bg-gray-50 border-r border-gray-100 select-none"
                    style={{minWidth:200}}>
                    Ad Name <SortIcon k="adName" />
                  </th>
                  {extraBD.map(bd => (
                    <th key={bd} className="px-3 py-2.5 text-[10px] font-semibold text-gray-600 uppercase tracking-wide text-left whitespace-nowrap border-r border-gray-100" style={{minWidth:90}}>
                      {bd}
                    </th>
                  ))}
                  {BASE_COLS.map(col => (
                    <th key={col.key} onClick={()=>handleSort(col.key)}
                      className="px-3 py-2.5 text-[10px] font-semibold text-gray-600 uppercase tracking-wide text-right whitespace-nowrap cursor-pointer hover:bg-gray-50 border-r border-gray-100 last:border-r-0 select-none">
                      {col.label} <SortIcon k={col.key} />
                    </th>
                  ))}
                  {CF_COLS.map(col => (
                    <th key={col.key} className="px-3 py-2.5 text-[10px] font-semibold text-gray-600 uppercase tracking-wide text-right whitespace-nowrap border-r border-gray-100 last:border-r-0">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedData.map((row, idx) => {
                  const d = derive(row);
                  const rowBg = tableLook === "striped" && idx % 2 === 1 ? "bg-gray-50/60" : "bg-white";
                  const cellMap: Record<string,number> = {
                    spend:row.spend, impressions:row.impressions, clicks:row.clicks,
                    purchases:row.purchases, cpm:d.cpm, cpc:d.cpc, ctr:d.ctr, cpa:d.cpa, roas:d.roas
                  };
                  return (
                    <tr key={row.id} className={`border-b border-gray-100 hover:bg-brand-brandBlue/5 transition-colors ${rowBg}`}>
                      <td className="px-3 py-2 text-center border-r border-gray-100">
                        <ChevronDown className="h-3 w-3 text-gray-300 mx-auto" />
                      </td>
                      <td className="px-2 py-1.5 border-r border-gray-100">
                        <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center mx-auto">
                          <span className="text-[8px] text-gray-400 font-bold">IMG</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-[11px] text-gray-700 font-medium text-left border-r border-gray-100 whitespace-nowrap" style={{maxWidth:220,overflow:"hidden",textOverflow:"ellipsis"}}>
                        {row.adName}
                      </td>
                      {extraBD.map(bd => (
                        <td key={bd} className="px-3 py-2 text-[11px] text-gray-600 text-left border-r border-gray-100 whitespace-nowrap">
                          {getBDVal(row, bd)}
                        </td>
                      ))}
                      {BASE_COLS.map(col => (
                        <td key={col.key}
                          className="px-3 py-2 text-[11px] text-gray-600 text-right border-r border-gray-100 last:border-r-0 whitespace-nowrap"
                          style={heatStyleVal(col.key, cellMap[col.key] ?? 0, col.invert)}>
                          {col.fmt(row, d)}
                        </td>
                      ))}
                      {CF_COLS.map(col => (
                        <td key={col.key} className="px-3 py-2 text-[11px] text-gray-600 text-right border-r border-gray-100 last:border-r-0 whitespace-nowrap">
                          {col.fmt(row, d)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Total row */}
          <div className="border-t border-gray-200 bg-gray-50/60 px-3 py-2">
            <div className="flex items-center text-[11px]">
              <span className="w-7 flex-shrink-0" />
              <span className="w-9 flex-shrink-0" />
              <span className="font-semibold text-gray-700 flex-shrink-0 pl-3" style={{minWidth:200}}>Total</span>
              {extraBD.map(bd=><span key={bd} className="flex-shrink-0" style={{minWidth:90}} />)}
              {[
                fmt$(totals.spend), fmtK(totals.impressions), fmt$(totals.cpm),
                fmtK(totals.clicks), fmt$(totals.cpc), fmtPct(totals.ctr),
                String(totals.purchases), fmt$(totals.cpa), fmtX(totals.roas),
              ].map((val, i) => (
                <span key={i} className="text-right font-semibold text-gray-700 flex-shrink-0 px-3" style={{minWidth:80}}>{val}</span>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="border-t border-gray-100 px-4 py-2.5 flex items-center gap-4 text-xs text-gray-600">
            <span>Show rows</span>
            <select className="border border-gray-300 rounded px-2 py-1 text-xs text-gray-700 focus:outline-none">
              <option>500</option><option>250</option><option>100</option><option>50</option><option>25</option>
            </select>
            <span>1 – {MOCK_DATA.length} of {MOCK_DATA.length}</span>
            <div className="flex items-center gap-1 ml-auto">
              <button className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:border-gray-300 text-xs">‹</button>
              <button className="w-6 h-6 flex items-center justify-center rounded bg-brand-brandBlue text-white text-xs font-semibold">1</button>
              <button className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:border-gray-300 text-xs">›</button>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
