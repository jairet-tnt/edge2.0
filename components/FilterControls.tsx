"use client";

import { RefreshCw } from "lucide-react";

export default function FilterControls() {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex flex-wrap items-center gap-3 lg:gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Account:</label>
          <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-brandBlue">
            <option>All Accounts</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Date Range:</label>
          <input
            type="date"
            defaultValue="2025-12-05"
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-brandBlue"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Calendar Range:</label>
          <input
            type="text"
            placeholder="..."
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-brandBlue w-24"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Compare:</label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-lightBlue rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-brandBlue"></div>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Virtual Accounts:</label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-lightBlue rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-brandBlue"></div>
          </label>
        </div>

        <button className="ml-auto p-2 rounded-lg bg-brand-lightGrey hover:bg-gray-200 transition-colors">
          <RefreshCw className="h-4 w-4 text-gray-600" />
        </button>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Metric Left:</label>
          <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-brandBlue">
            <option>Spend</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Metric Right:</label>
          <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-brandBlue">
            <option>Spend</option>
          </select>
        </div>
      </div>
    </div>
  );
}


