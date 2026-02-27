"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    traffic: false,
    edge: true,
    creatives: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static left-0 z-40 bg-brand-darkBlue border-r border-brand-darkBlue transition-transform duration-300 ease-in-out",
          "w-64 lg:w-64",
          "top-0 lg:inset-y-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        style={{ height: "100vh", top: "0px" }}
      >
        <div className="h-full overflow-y-auto scrollbar-hide">
          <div className="p-4 lg:p-6">
            <h2 className="text-xs font-semibold text-brand-lightBlue uppercase tracking-wider mb-4">
              INSIGHTS
            </h2>

            {/* Traffic Section */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection("traffic")}
                className="w-full flex items-center justify-between text-sm font-medium text-white hover:text-brand-lightBlue py-2 transition-colors"
              >
                <span>Traffic</span>
                {expandedSections.traffic ? (
                  <ChevronDown className="h-4 w-4 text-white" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-white" />
                )}
              </button>
              {expandedSections.traffic && (
                <div className="ml-4 mt-2 space-y-1">
                  <a
                    href="#"
                    className="block text-sm text-brand-lightBlue hover:text-white py-1 transition-colors"
                  >
                    Executive Dashboard
                  </a>
                </div>
              )}
            </div>

            {/* Edge Section */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection("edge")}
                className="w-full flex items-center justify-between text-sm font-medium text-white hover:text-brand-lightBlue py-2 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span>Edge</span>
                  <Circle className="h-2 w-2 fill-brand-accentRed text-brand-accentRed" />
                </div>
                {expandedSections.edge ? (
                  <ChevronDown className="h-4 w-4 text-white" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-white" />
                )}
              </button>
              {expandedSections.edge && (
                <div className="ml-4 mt-2 space-y-1">
                  <a
                    href="#"
                    className="block text-sm text-brand-accentRed font-semibold py-1"
                  >
                    Ads KPI
                  </a>
                  <a
                    href="#"
                    className="block text-sm text-brand-lightBlue hover:text-white py-1 transition-colors"
                  >
                    Hourly Report
                  </a>
                  <a
                    href="#"
                    className="block text-sm text-brand-lightBlue hover:text-white py-1 transition-colors"
                  >
                    Correlation report
                  </a>
                  <a
                    href="#"
                    className="block text-sm text-brand-lightBlue hover:text-white py-1 transition-colors"
                  >
                    Manage Rules
                  </a>
                </div>
              )}
            </div>

            {/* Creatives Section */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection("creatives")}
                className="w-full flex items-center justify-between text-sm font-medium text-white hover:text-brand-lightBlue py-2 transition-colors"
              >
                <span>Creatives</span>
                {expandedSections.creatives ? (
                  <ChevronDown className="h-4 w-4 text-white" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-white" />
                )}
              </button>
              {expandedSections.creatives && (
                <div className="ml-4 mt-2 space-y-1">
                  <a
                    href="#"
                    className="block text-sm text-brand-lightBlue hover:text-white py-1 transition-colors"
                  >
                    Video KPI
                  </a>
                  <a
                    href="#"
                    className="block text-sm text-brand-lightBlue hover:text-white py-1 transition-colors"
                  >
                    Creatives KPI
                  </a>
                  <a
                    href="#"
                    className="block text-sm text-brand-lightBlue hover:text-white py-1 transition-colors"
                  >
                    Ad Grid
                  </a>
                  <a
                    href="#"
                    className="block text-sm text-brand-lightBlue hover:text-white py-1 transition-colors"
                  >
                    Policy Dashboard
                  </a>
                  <a
                    href="#"
                    className="block text-sm text-brand-lightBlue hover:text-white py-1 transition-colors"
                  >
                    Strike Rate Report
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}


