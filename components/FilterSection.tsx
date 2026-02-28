"use client";

import { useState, useRef, useEffect } from "react";
import { Download, ChevronDown, ChevronUp, X, Plus } from "lucide-react";
import { FilterTab, ClientSubTab, CustomField } from "@/types";
import { cn } from "@/lib/utils";

interface FilterSectionProps {
  selectedTab: FilterTab;
  selectedSubTab: ClientSubTab;
  onTabChange: (tab: FilterTab) => void;
  onSubTabChange: (tab: ClientSubTab) => void;
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  customFields: CustomField[];
  selectedCustomFields: string[];
  onCustomFieldsChange: (fields: string[]) => void;
}

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

// ─── Tab label maps ────────────────────────────────────────────────────────────
const PRIMARY_LABELS: Record<FilterTab, string> = {
  CLIENT: "Client", PRODUCER: "Producer", WRITER: "Writer", EDITOR: "Editor",
  ACCOUNT: "Account", CAMPAIGN: "Campaign", ADSET: "Ad Set", AD: "Ad",
};

const SUB_LABELS: Record<ClientSubTab, string> = {
  CLIENT: "Client", FUNNEL: "Funnel", PLATFORM: "Platform",
  ACCOUNT: "Account", CAMPAIGN: "Campaign", ADSET: "Ad Set", AD: "Ad",
};

const TABLE_LOOK_OPTS = ["Striped", "Heat Map", "Compact"];

// ─── Small toggle ──────────────────────────────────────────────────────────────
function SmallToggle() {
  return (
    <label className="relative inline-flex items-center cursor-pointer select-none">
      <input type="checkbox" className="sr-only peer" />
      <div className="
        w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-brand-brandBlue
        after:content-[''] after:absolute after:top-[2px] after:left-[2px]
        after:bg-white after:rounded-full after:h-4 after:w-4
        after:shadow-sm after:transition-transform peer-checked:after:translate-x-4
      " />
    </label>
  );
}

// ─── Advanced filter panel (shown when Filter header is expanded) ──────────────
const FILTER_FIELDS      = ["Spend","Impressions","Clicks","CPM","CPC","CTR","Purchases","CPA","CVR","ROAS","AOV"];
const FILTER_CONDITIONS  = ["More than or Equal","Less than or Equal","Equal to","Greater than","Less than","Not Equal to"];
const FILTER_CALENDAR    = ["Today","Yesterday","Last 7 Days","Last 14 Days","Last 30 Days","This Month","Last Month"];

function AdvancedFilterPanel() {
  const inp  = "border border-gray-300 rounded px-2.5 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-brandBlue bg-white";
  const btnB = "px-3 py-1.5 text-xs font-semibold rounded border border-brand-brandBlue text-brand-brandBlue hover:bg-brand-brandBlue hover:text-white transition-colors";
  const btnG = "px-3 py-1.5 text-xs font-semibold rounded border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors";

  return (
    <div className="px-6 py-4 border-b border-gray-200 bg-brand-lightGrey/50 space-y-4">
      {/* Row 1: toggles + filter name */}
      <div className="flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <SmallToggle />
          <span className="text-sm text-gray-700">Show Selected Only</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <SmallToggle />
          <span className="text-sm text-gray-700">Show Active Only</span>
        </label>
        <div className="flex items-center gap-2 ml-2">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter name</span>
          <input type="text" className={`${inp} w-44`} />
          <button className={btnB}>SAVE FILTER</button>
          <button className={btnG}>DELETE FILTER</button>
        </div>
      </div>

      {/* Row 2: field / condition / value / date / calendar / ops */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Field</span>
          <select className={`${inp} min-w-[140px]`}>
            {FILTER_FIELDS.map(f => <option key={f}>{f}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Condition</span>
          <select className={`${inp} min-w-[180px]`}>
            {FILTER_CONDITIONS.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Value</span>
          <input type="text" className={`${inp} w-24`} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Date Range</span>
          <input type="text" readOnly className={`${inp} w-40 !bg-brand-lightGrey cursor-default`} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Calendar Range</span>
          <select className={`${inp} min-w-[140px]`}>
            <option value="">--</option>
            {FILTER_CALENDAR.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="flex gap-1 pb-[1px]">
          <button className={btnB}>AND</button>
          <button className={btnB}>OR</button>
          <button className={btnG}>DEL</button>
        </div>
      </div>

      {/* Row 3: apply / clear */}
      <div className="flex gap-3">
        <button className={btnB}>APPLY FILTER</button>
        <button className={btnG}>CLEAR FILTER</button>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function FilterSection({
  selectedTab, selectedSubTab, onTabChange, onSubTabChange,
  selectedCount, totalCount, onSelectAll,
  customFields, selectedCustomFields, onCustomFieldsChange,
}: FilterSectionProps) {
  const primaryTabs: FilterTab[]     = ["CLIENT","PRODUCER","WRITER","EDITOR","ACCOUNT","CAMPAIGN","ADSET","AD"];
  const clientSubTabs: ClientSubTab[] = ["CLIENT","FUNNEL","PLATFORM","ACCOUNT","CAMPAIGN","ADSET","AD"];

  const [filterExpanded, setFilterExpanded] = useState(false);
  const [tableLook, setTableLook] = useState("Striped");
  const cfDrop = useDropdown();
  const tlDrop = useDropdown();

  const toggleField = (id: string) => {
    const next = new Set(selectedCustomFields);
    if (next.has(id)) next.delete(id); else next.add(id);
    onCustomFieldsChange(Array.from(next));
  };

  const btnOutline = "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border border-brand-brandBlue text-brand-brandBlue hover:bg-brand-brandBlue hover:text-white transition-colors";
  const btnFilled  = "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border bg-brand-brandBlue border-brand-brandBlue text-white hover:opacity-90 transition-opacity";

  return (
    <div>
      {/* ── "Filter" collapsible header ── */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
        <span className="text-sm font-semibold text-gray-700">Filter</span>
        <button
          onClick={() => setFilterExpanded(v => !v)}
          className="p-1 rounded hover:bg-brand-lightGrey transition-colors"
          aria-label={filterExpanded ? "Collapse filter" : "Expand filter"}
        >
          {filterExpanded
            ? <X className="h-4 w-4 text-gray-500" />
            : <ChevronDown className="h-4 w-4 text-gray-500" />}
        </button>
      </div>

      {/* ── Advanced filter panel ── */}
      {filterExpanded && <AdvancedFilterPanel />}

      {/* ── Top action bar ── */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-3 lg:gap-4">

          {/* Date range */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-gray-900">2026-02-27 to 2026-02-27</span>
          </div>

          {/* Selection */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">{selectedCount} selected</span>
            <button
              onClick={onSelectAll}
              className="text-brand-brandBlue hover:text-brand-darkBlue font-medium transition-colors"
            >
              Select All {totalCount}
            </button>
            {selectedCount > 0 && (
              <button className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
                Update Selected <ChevronDown className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">

            {/* Custom Fields dropdown */}
            <div className="relative" ref={cfDrop.ref}>
              <button
                onClick={() => cfDrop.setOpen(o => !o)}
                className={selectedCustomFields.length > 0 ? btnFilled : btnOutline}
              >
                Custom Fields
                {cfDrop.open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
              {cfDrop.open && (
                <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-3" style={{ minWidth: 280 }}>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {customFields.map(field => (
                      <label key={field.id} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedCustomFields.includes(field.id)}
                          onChange={() => toggleField(field.id)}
                          className="h-3.5 w-3.5 rounded border-gray-300 accent-brand-brandBlue flex-shrink-0"
                        />
                        <span className="text-xs text-gray-700 group-hover:text-gray-900">{field.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Table Look dropdown */}
            <div className="relative" ref={tlDrop.ref}>
              <button
                onClick={() => tlDrop.setOpen(o => !o)}
                className={tableLook !== "Striped" ? btnFilled : btnOutline}
              >
                Table Look
                {tlDrop.open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
              {tlDrop.open && (
                <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1" style={{ minWidth: 130 }}>
                  {TABLE_LOOK_OPTS.map(look => (
                    <button
                      key={look}
                      onClick={() => { setTableLook(look); tlDrop.setOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-xs transition-colors ${
                        tableLook === look
                          ? "text-brand-brandBlue font-semibold bg-brand-brandBlue/5"
                          : "text-gray-700 hover:bg-brand-lightGrey"
                      }`}
                    >
                      {look}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Save CSV */}
            <button className={btnFilled}>
              <Download className="h-3.5 w-3.5" />
              Save CSV
            </button>

          </div>
        </div>
      </div>

      {/* ── Primary tabs — pill style ── */}
      <div className="flex justify-center overflow-x-auto scrollbar-hide py-2.5 border-b border-gray-100">
        <div className="flex items-center gap-1 min-w-max px-4">
          {primaryTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors",
                selectedTab === tab
                  ? "bg-brand-darkBlue text-white"
                  : "text-gray-600 hover:bg-brand-lightGrey"
              )}
            >
              {PRIMARY_LABELS[tab]}
            </button>
          ))}
          <button
            className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 text-gray-400 hover:bg-brand-lightGrey transition-colors ml-1"
            aria-label="Add view"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* ── Sub-tabs — pill style ── */}
      {selectedTab === "CLIENT" && (
        <div className="flex justify-center overflow-x-auto scrollbar-hide py-2.5 border-b border-gray-100">
          <div className="flex items-center gap-1 min-w-max px-4">
            {clientSubTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => onSubTabChange(tab)}
                className={cn(
                  "px-4 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors",
                  selectedSubTab === tab
                    ? "bg-gray-600 text-white"
                    : "text-gray-600 hover:bg-brand-lightGrey"
                )}
              >
                {SUB_LABELS[tab]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
