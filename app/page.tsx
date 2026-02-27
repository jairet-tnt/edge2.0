"use client";

import { useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import FilterControls from "@/components/FilterControls";
import FilterSection from "@/components/FilterSection";
import DataTable from "@/components/DataTable";
import Pagination from "@/components/Pagination";
import CustomFieldsPanel from "@/components/CustomFieldsPanel";
import { hierarchyData, getTotalMetrics, customFields } from "@/lib/mockData";
import { FilterTab, ClientSubTab } from "@/types";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<FilterTab>("CLIENT");
  const [selectedSubTab, setSelectedSubTab] = useState<ClientSubTab>("CLIENT");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [selectedCustomFields, setSelectedCustomFields] = useState<string[]>([]);
  const [customFieldsOpen, setCustomFieldsOpen] = useState(false);

  const total = getTotalMetrics(hierarchyData);
  const totalRow = {
    ...total,
    id: "total",
    name: "Total",
    level: "client" as const,
  };
  const totalPages = Math.ceil(hierarchyData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRows = hierarchyData.slice(startIndex, endIndex);

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedRows.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedRows.map((c) => c.id)));
    }
  };

  const customFieldLabels = useMemo(
    () =>
      customFields.reduce<Record<string, string>>((acc, field) => {
        acc[field.id] = field.label;
        return acc;
      }, {}),
    []
  );

  return (
    <div className="min-h-screen bg-brand-lightGrey flex flex-col">
      <Header earnings={12300} sales={264} />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-16 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? (
            <X className="h-6 w-6 text-brand-darkBlue" />
          ) : (
            <Menu className="h-6 w-6 text-brand-darkBlue" />
          )}
        </button>

        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto lg:ml-0">
          <div className="max-w-[1920px] mx-auto">
            <FilterControls />

            <FilterSection
              selectedTab={selectedTab}
              selectedSubTab={selectedSubTab}
              onTabChange={setSelectedTab}
              onSubTabChange={setSelectedSubTab}
              selectedCount={selectedRows.size}
              totalCount={hierarchyData.length}
              onSelectAll={handleSelectAll}
              onCustomFieldsClick={() => setCustomFieldsOpen((prev) => !prev)}
            />

            <div className="p-4 lg:p-6 relative">
              {customFieldsOpen && (
                <CustomFieldsPanel
                  fields={customFields}
                  selected={selectedCustomFields}
                  onChange={setSelectedCustomFields}
                  onClose={() => setCustomFieldsOpen(false)}
                />
              )}

              <DataTable
                rows={paginatedRows}
                total={totalRow}
                selectedRows={selectedRows}
                onSelectRow={handleSelectRow}
                onSelectAll={handleSelectAll}
                selectedCustomFields={selectedCustomFields}
                customFieldLabels={customFieldLabels}
              />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={hierarchyData.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(items) => {
                  setItemsPerPage(items);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Footer */}
            <footer className="px-4 py-4 border-t border-gray-200 bg-white">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <a href="#" className="hover:text-gray-900">
                    Home
                  </a>
                  <a href="#" className="hover:text-gray-900">
                    Help
                  </a>
                </div>
                <div>Copyright 2022 © All rights reserved.</div>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

