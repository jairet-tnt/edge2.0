"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Download,
  BarChart3,
  Search,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

// --- Mock data ---
const mockRows = [
  { day: "2026-02-20", spend: 295432, cpm: 27.14, impr: 10882000, clicks: 82450, cpc: 1.18, ctr: 0.76, purchases: 1842, cpa: 160.4, roas: 1.38 },
  { day: "2026-02-21", spend: 310218, cpm: 26.8, impr: 11575000, clicks: 88200, cpc: 1.22, ctr: 0.76, purchases: 1930, cpa: 160.7, roas: 1.36 },
  { day: "2026-02-22", spend: 372105, cpm: 28.3, impr: 13148000, clicks: 98700, cpc: 1.38, ctr: 0.75, purchases: 2210, cpa: 168.4, roas: 1.42 },
  { day: "2026-02-23", spend: 340760, cpm: 27.6, impr: 12347000, clicks: 92100, cpc: 1.29, ctr: 0.75, purchases: 2050, cpa: 166.2, roas: 1.35 },
  { day: "2026-02-24", spend: 276340, cpm: 25.1, impr: 11009000, clicks: 80300, cpc: 1.15, ctr: 0.73, purchases: 1760, cpa: 157.0, roas: 1.22 },
  { day: "2026-02-25", spend: 255980, cpm: 24.4, impr: 10491000, clicks: 76800, cpc: 1.1, ctr: 0.73, purchases: 1670, cpa: 153.3, roas: 1.18 },
  { day: "2026-02-26", spend: 293100, cpm: 26.1, impr: 11228000, clicks: 84900, cpc: 1.17, ctr: 0.76, purchases: 1820, cpa: 161.0, roas: 1.32 },
];

function fmt(n: number, type: "currency" | "number" | "percent" | "decimal" = "number") {
  if (type === "currency") return `$${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  if (type === "percent") return `${n.toFixed(2)}%`;
  if (type === "decimal") return n.toFixed(2);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return n.toLocaleString("en-US");
  return String(n);
}

type CollapseKey = "chart" | "strikeRate";

export default function AdsKpiPage() {
  const [collapsed, setCollapsed] = useState<Record<CollapseKey, boolean>>({
    chart: true,
    strikeRate: true,
  });

  const toggle = (key: CollapseKey) =>
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  const totals = mockRows.reduce(
    (acc, r) => ({
      spend: acc.spend + r.spend,
      impr: acc.impr + r.impr,
      clicks: acc.clicks + r.clicks,
      purchases: acc.purchases + r.purchases,
    }),
    { spend: 0, impr: 0, clicks: 0, purchases: 0 }
  );

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-4">
        {/* Filters */}
        <div className="bg-white rounded border border-gray-200 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Account</div>
              <select className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-brandBlue">
                <option>...</option>
              </select>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Funnel</div>
              <select className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-brandBlue">
                <option>...</option>
              </select>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Platform</div>
              <select className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-brandBlue">
                <option>...</option>
              </select>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Date Range</div>
              <input
                type="text"
                defaultValue="2026-02-20 to 2026-02-26"
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-brandBlue"
              />
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Calendar Range</div>
              <select className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-brandBlue">
                <option>...</option>
              </select>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Breakdown</div>
              <select className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-brandBlue">
                <option>Day</option>
                <option>Week</option>
                <option>Month</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Camp. Launch Date</div>
              <input
                type="text"
                className="w-full px-2 py-1.5 border border-gray-200 bg-gray-100 rounded text-sm text-gray-400 cursor-not-allowed"
                disabled
              />
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Camp. Launch Range</div>
              <select className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-brandBlue">
                <option>...</option>
              </select>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                1st Time Launched
              </label>
            </div>
            <div className="flex justify-end">
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-lightBlue hover:bg-brand-brandBlue text-white transition-colors">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Chart (collapsible) */}
        <div className="bg-white rounded border border-gray-200">
          <button
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-brand-lightGrey transition-colors"
            onClick={() => toggle("chart")}
          >
            <span>Chart</span>
            {collapsed.chart ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronUp className="h-4 w-4 text-gray-500" />}
          </button>
          {!collapsed.chart && (
            <div className="px-4 pb-4 text-sm text-gray-500 text-center py-8">
              Chart visualization will appear here
            </div>
          )}
        </div>

        {/* Strike Rate (collapsible) */}
        <div className="bg-white rounded border border-gray-200">
          <button
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-brand-lightGrey transition-colors"
            onClick={() => toggle("strikeRate")}
          >
            <span>Strike Rate</span>
            {collapsed.strikeRate ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronUp className="h-4 w-4 text-gray-500" />}
          </button>
          {!collapsed.strikeRate && (
            <div className="px-4 pb-4 text-sm text-gray-500 text-center py-8">
              Strike rate metrics will appear here
            </div>
          )}
        </div>

        {/* Filter rows */}
        <div className="bg-white rounded border border-gray-200 p-4 space-y-3">
          {[0, 1].map((rowIdx) => (
            <div key={rowIdx} className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center gap-2 lg:gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Field</span>
                <select className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-brandBlue w-28">
                  <option>...</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Comparison</span>
                <select className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-brandBlue w-24">
                  <option>...</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Value</span>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter value"
                    className="pl-2 pr-7 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-brandBlue w-32"
                  />
                  <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Filter Name</span>
                <select className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-brandBlue w-24">
                  <option>...</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Name</span>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter name"
                    className="pl-2 pr-7 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-brandBlue w-32"
                  />
                  <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                </div>
              </div>
              {rowIdx === 0 && (
                <div className="flex items-center gap-2 ml-auto">
                  <button className="px-3 py-1.5 border border-brand-brandBlue text-brand-brandBlue text-xs font-semibold rounded hover:bg-brand-brandBlue hover:text-white transition-colors uppercase tracking-wide">
                    Apply Filter
                  </button>
                  <button className="px-3 py-1.5 border border-gray-300 text-gray-600 text-xs font-semibold rounded hover:bg-brand-lightGrey transition-colors uppercase tracking-wide">
                    Clear Filter
                  </button>
                </div>
              )}
              {rowIdx === 1 && (
                <div className="flex items-center gap-4 ml-auto">
                  <span className="text-xs text-gray-500 font-medium">1st Time Launched</span>
                  <button className="px-3 py-1.5 bg-brand-brandBlue text-white text-xs font-semibold rounded hover:bg-brand-darkBlue transition-colors uppercase tracking-wide">
                    Create Campaign
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded border border-gray-200 overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-end gap-2 px-4 py-2 border-b border-gray-200">
            <button className="px-3 py-1.5 border border-gray-300 text-xs font-semibold text-gray-700 rounded hover:bg-brand-lightGrey transition-colors flex items-center gap-1">
              Custom Fields <ChevronDown className="h-3 w-3" />
            </button>
            <button className="px-3 py-1.5 bg-brand-brandBlue text-white text-xs font-semibold rounded hover:bg-brand-darkBlue transition-colors flex items-center gap-1">
              <Download className="h-3.5 w-3.5" /> Save CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-lightGrey border-b border-gray-200">
                <tr>
                  {["Chart", "Day", "Spend", "CPM", "Impr.", "Clicks", "CPC", "CTR(%)", "Purchases", "CPA", "ROAS"].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap"
                    >
                      <div className="flex items-center gap-1">
                        {col}
                        {col !== "Chart" && (
                          <span className="text-gray-400 text-[10px] leading-none">⇅</span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockRows.map((row) => (
                  <tr key={row.day} className="hover:bg-brand-lightGrey transition-colors">
                    <td className="px-4 py-2.5">
                      <BarChart3 className="h-4 w-4 text-gray-300" />
                    </td>
                    <td className="px-4 py-2.5 font-medium text-gray-800 whitespace-nowrap">{row.day}</td>
                    <td className="px-4 py-2.5 text-right">{fmt(row.spend, "currency")}</td>
                    <td className="px-4 py-2.5 text-right">{fmt(row.cpm, "decimal")}</td>
                    <td className="px-4 py-2.5 text-right">{fmt(row.impr)}</td>
                    <td className="px-4 py-2.5 text-right">{fmt(row.clicks)}</td>
                    <td className="px-4 py-2.5 text-right">{fmt(row.cpc, "decimal")}</td>
                    <td className="px-4 py-2.5 text-right">{fmt(row.ctr, "percent")}</td>
                    <td className="px-4 py-2.5 text-right">{fmt(row.purchases)}</td>
                    <td className="px-4 py-2.5 text-right">{fmt(row.cpa, "decimal")}</td>
                    <td className="px-4 py-2.5 text-right">{row.roas.toFixed(2)}</td>
                  </tr>
                ))}
                {/* Total row */}
                <tr className="bg-brand-lightGrey font-semibold border-t-2 border-gray-300">
                  <td className="px-4 py-3" />
                  <td className="px-4 py-3 font-bold text-gray-800">Total</td>
                  <td className="px-4 py-3 text-right">{fmt(totals.spend, "currency")}</td>
                  <td className="px-4 py-3 text-right">
                    {fmt(totals.spend / totals.impr * 1000, "decimal")}
                  </td>
                  <td className="px-4 py-3 text-right">{fmt(totals.impr)}</td>
                  <td className="px-4 py-3 text-right">{fmt(totals.clicks)}</td>
                  <td className="px-4 py-3 text-right">
                    {fmt(totals.spend / totals.clicks, "decimal")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {fmt((totals.clicks / totals.impr) * 100, "percent")}
                  </td>
                  <td className="px-4 py-3 text-right">{fmt(totals.purchases)}</td>
                  <td className="px-4 py-3 text-right">
                    {fmt(totals.spend / totals.purchases, "decimal")}
                  </td>
                  <td className="px-4 py-3 text-right">—</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>Show rows</span>
              <select className="px-2 py-1 border border-gray-300 rounded text-sm">
                <option>15</option>
                <option>30</option>
                <option>50</option>
              </select>
              <span>1 – {mockRows.length} of {mockRows.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="px-2.5 py-1 rounded bg-brand-brandBlue text-white text-xs font-semibold">1</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
