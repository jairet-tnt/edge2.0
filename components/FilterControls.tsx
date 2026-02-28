"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";

const CALENDAR_OPTIONS = [
  "Today", "Yesterday", "Last 7 Days", "Last 14 Days",
  "Last 30 Days", "This Month", "Last Month",
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer select-none">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
      <div
        className="
          w-9 h-5 bg-gray-200 rounded-full peer
          peer-checked:bg-brand-brandBlue
          after:content-[''] after:absolute after:top-[2px] after:left-[2px]
          after:bg-white after:rounded-full after:h-4 after:w-4
          after:shadow-sm after:transition-transform
          peer-checked:after:translate-x-4
        "
      />
    </label>
  );
}

const inputCls = "px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-brandBlue";

export default function FilterControls() {
  const [compareOn, setCompareOn] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 px-6 py-4">

      {/* Row 1 */}
      <div className="flex flex-wrap items-end gap-6">

        {/* ACCOUNT */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
            Account
          </span>
          <select className={`${inputCls} min-w-[190px] bg-white`}>
            <option value="" />
          </select>
        </div>

        {/* DATE RANGE */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
            Date Range
          </span>
          <input
            type="text"
            defaultValue="2026-02-27"
            className={`${inputCls} w-44`}
          />
        </div>

        {/* CALENDAR RANGE */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
            Calendar Range
          </span>
          <select className={`${inputCls} min-w-[140px] bg-white`}>
            <option value="">--</option>
            {CALENDAR_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>

        {/* COMPARE */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
            Compare
          </span>
          <div className="h-[34px] flex items-center">
            <Toggle checked={compareOn} onChange={() => setCompareOn(v => !v)} />
          </div>
        </div>

        {/* VIRTUAL ACCOUNTS */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
            Virtual Accounts
          </span>
          <div className="h-[34px] flex items-center">
            <Toggle checked={false} onChange={() => {}} />
          </div>
        </div>

        {/* Refresh */}
        <div className="ml-auto">
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-lightBlue hover:bg-brand-brandBlue text-white transition-colors"
            aria-label="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

      </div>

      {/* Row 2 — visible when Compare is ON */}
      {compareOn && (
        <div className="flex flex-wrap items-end gap-6 mt-4 pt-4 border-t border-gray-100">

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              Comparison Dates
            </span>
            <input
              type="text"
              defaultValue="2026-02-20"
              className={`${inputCls} w-44`}
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              Compare Range
            </span>
            <select className={`${inputCls} min-w-[140px] bg-white`}>
              <option value="">--</option>
              {CALENDAR_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

        </div>
      )}

    </div>
  );
}
