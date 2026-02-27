"use client";

import { useState } from "react";
import { RefreshCw, Download, Settings } from "lucide-react";
import { FilterTab, ClientSubTab } from "@/types";
import { cn } from "@/lib/utils";

interface FilterSectionProps {
  selectedTab: FilterTab;
  selectedSubTab: ClientSubTab;
  onTabChange: (tab: FilterTab) => void;
  onSubTabChange: (tab: ClientSubTab) => void;
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onCustomFieldsClick: () => void;
}

export default function FilterSection({
  selectedTab,
  selectedSubTab,
  onTabChange,
  onSubTabChange,
  selectedCount,
  totalCount,
  onSelectAll,
  onCustomFieldsClick,
}: FilterSectionProps) {
  const primaryTabs: FilterTab[] = [
    "CLIENT",
    "PRODUCER",
    "WRITER",
    "EDITOR",
    "ACCOUNT",
    "CAMPAIGN",
    "ADSET",
    "AD",
  ];

  const clientSubTabs: ClientSubTab[] = [
    "CLIENT",
    "FUNNEL",
    "PLATFORM",
    "ACCOUNT",
    "CAMPAIGN",
    "ADSET",
    "AD",
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Top Filter Bar */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-3 lg:gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Date Range:</span>
            <span className="font-medium text-gray-900">2025-12-05 to 2025-12-05</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">{selectedCount} selected</span>
            <button
              onClick={onSelectAll}
              className="text-brand-brandBlue hover:text-brand-darkBlue font-medium transition-colors"
            >
              SELECT ALL {totalCount}
            </button>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={onCustomFieldsClick}
              className="px-3 py-1.5 text-sm font-medium text-brand-darkBlue hover:bg-brand-lightGrey rounded-lg transition-colors flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">CUSTOM FIELDS</span>
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-brand-darkBlue hover:bg-brand-lightGrey rounded-lg transition-colors flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">TABLE LOOK</span>
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-white bg-brand-brandBlue hover:bg-brand-darkBlue rounded-lg transition-colors flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">SAVE CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Tabs */}
      <div className="px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-1 min-w-max">
          {primaryTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={cn(
                "px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                selectedTab === tab
                  ? "text-brand-brandBlue border-b-2 border-brand-brandBlue"
                  : "text-gray-600 hover:text-brand-darkBlue"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Secondary Tabs (when CLIENT is selected) */}
      {selectedTab === "CLIENT" && (
        <div className="px-4 overflow-x-auto scrollbar-hide border-t border-gray-100">
          <div className="flex gap-1 min-w-max">
            {clientSubTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => onSubTabChange(tab)}
                className={cn(
                  "px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                  selectedSubTab === tab
                    ? "text-brand-brandBlue border-b-2 border-brand-brandBlue"
                    : "text-gray-600 hover:text-brand-darkBlue"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


