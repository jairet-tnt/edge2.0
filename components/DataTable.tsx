"use client";

import { useMemo, useState } from "react";
import { BarChart3, ChevronDown, ChevronRight } from "lucide-react";
import { HierarchyRow } from "@/types";
import { formatCurrency, formatNumber, formatPercent, cn } from "@/lib/utils";

interface DataTableProps {
  rows: HierarchyRow[];
  total: HierarchyRow;
  selectedRows: Set<string>;
  onSelectRow: (id: string) => void;
  onSelectAll: () => void;
  selectedCustomFields: string[];
  customFieldLabels: Record<string, string>;
}

const levelPadding: Record<string, string> = {
  client: "pl-2",
  brand: "pl-6",
  platform: "pl-10",
  adAccount: "pl-14",
};

export default function DataTable({
  rows,
  total,
  selectedRows,
  onSelectRow,
  onSelectAll,
  selectedCustomFields,
  customFieldLabels,
}: DataTableProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const allSelected = rows.length > 0 && selectedRows.size === rows.length;

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const flattened = useMemo(() => {
    const acc: HierarchyRow[] = [];
    const walk = (list: HierarchyRow[]) => {
      list.forEach((row) => {
        acc.push(row);
        if (row.children && expanded[row.id]) {
          walk(row.children);
        }
      });
    };
    walk(rows);
    return acc;
  }, [rows, expanded]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto scrollbar-hide">
        <table className="w-full">
          <thead className="bg-brand-lightGrey border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={onSelectAll}
                  className="flex items-center justify-center w-5 h-5 border border-gray-300 rounded hover:bg-brand-lightGrey transition-colors"
                >
                  {allSelected && <div className="w-3 h-3 bg-brand-brandBlue rounded-sm" />}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Chart
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Spend
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Impr.
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                CPM
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Clicks
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                CPC
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                CTR (%)
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Purch.
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                CPA
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ROAS
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Platform Purch.
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Target Delta
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Budget Today
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Budget
              </th>
              {selectedCustomFields.map((fieldId) => (
                <th
                  key={fieldId}
                  className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {customFieldLabels[fieldId] || fieldId}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {flattened.map((row) => (
              <TableRow
                key={row.id}
                row={row}
                isSelected={selectedRows.has(row.id)}
                onSelect={() => onSelectRow(row.id)}
                onToggleExpand={() => toggleExpand(row.id)}
                isExpanded={!!expanded[row.id]}
                hasChildren={!!row.children?.length}
                selectedCustomFields={selectedCustomFields}
                customFieldLabels={customFieldLabels}
              />
            ))}
            <TableRow
              row={total}
              isSelected={false}
              onSelect={() => {}}
              onToggleExpand={() => {}}
              isExpanded={false}
              hasChildren={false}
              isTotal
              selectedCustomFields={selectedCustomFields}
              customFieldLabels={customFieldLabels}
            />
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-gray-200">
        {flattened.map((row) => (
          <MobileCard
            key={row.id}
            row={row}
            isSelected={selectedRows.has(row.id)}
            onSelect={() => onSelectRow(row.id)}
            onToggleExpand={() => toggleExpand(row.id)}
            isExpanded={!!expanded[row.id]}
            hasChildren={!!row.children?.length}
            selectedCustomFields={selectedCustomFields}
            customFieldLabels={customFieldLabels}
          />
        ))}
        <MobileCard
          row={total}
          isSelected={false}
          onSelect={() => {}}
          onToggleExpand={() => {}}
          isExpanded={false}
          hasChildren={false}
          isTotal
          selectedCustomFields={selectedCustomFields}
          customFieldLabels={customFieldLabels}
        />
      </div>
    </div>
  );
}

function TableRow({
  row,
  isSelected,
  onSelect,
  onToggleExpand,
  isExpanded,
  hasChildren,
  isTotal = false,
  selectedCustomFields,
  customFieldLabels,
}: {
  row: HierarchyRow;
  isSelected: boolean;
  onSelect: () => void;
  onToggleExpand: () => void;
  isExpanded: boolean;
  hasChildren: boolean;
  isTotal?: boolean;
  selectedCustomFields: string[];
  customFieldLabels: Record<string, string>;
}) {
  return (
    <tr
      className={cn(
        "hover:bg-brand-lightGrey transition-colors",
        isTotal && "bg-brand-lightGrey font-semibold"
      )}
    >
      <td className="px-4 py-3">
        {!isTotal && (
          <button
            onClick={onSelect}
            className="flex items-center justify-center w-5 h-5 border border-gray-300 rounded hover:bg-brand-lightGrey transition-colors"
          >
            {isSelected && <div className="w-3 h-3 bg-brand-brandBlue rounded-sm" />}
          </button>
        )}
      </td>
      <td className="px-4 py-3">
        <BarChart3 className="h-4 w-4 text-gray-400" />
      </td>
      <td className={cn("px-4 py-3", levelPadding[row.level] || "pl-2")}>
        <div className="flex items-center gap-2">
          {hasChildren ? (
            <button
              onClick={onToggleExpand}
              className="p-1 rounded hover:bg-brand-lightGrey transition-colors"
              aria-label="Expand row"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-600" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-600" />
              )}
            </button>
          ) : (
            <span className="w-5" />
          )}
          <span className={cn("text-sm", isTotal ? "font-bold" : "font-medium")}>
            {row.name}
          </span>
          {row.status === "disabled" && (
            <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded">
              DISABLED
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-right text-sm">{formatCurrency(row.spend)}</td>
      <td className="px-4 py-3 text-right text-sm">{formatNumber(row.impressions)}</td>
      <td className="px-4 py-3 text-right text-sm">{formatCurrency(row.cpm)}</td>
      <td className="px-4 py-3 text-right text-sm">{formatNumber(row.clicks)}</td>
      <td className="px-4 py-3 text-right text-sm">{formatCurrency(row.cpc)}</td>
      <td className="px-4 py-3 text-right text-sm">{row.ctr.toFixed(2)}%</td>
      <td className="px-4 py-3 text-right text-sm">{formatNumber(row.purchases)}</td>
      <td className="px-4 py-3 text-right text-sm">{formatCurrency(row.cpa)}</td>
      <td className="px-4 py-3 text-right text-sm">{row.roas.toFixed(2)}</td>
      <td className="px-4 py-3 text-right text-sm">
        {row.platformPurchases > 0 && (
          <div>
            <div>{formatNumber(row.platformPurchases)}</div>
            {row.platformPurchasesDelta !== undefined && (
              <div
                className={cn(
                  "text-xs",
                  row.platformPurchasesDelta < 0
                    ? "text-brand-accentRed"
                    : "text-brand-brandBlue"
                )}
              >
                {formatPercent(row.platformPurchasesDelta)}
              </div>
            )}
          </div>
        )}
      </td>
      <td className="px-4 py-3 text-right text-sm">
        <div>
          <div
            className={cn(
              row.targetDelta < 0 ? "text-brand-accentRed" : "text-brand-brandBlue"
            )}
          >
            {formatCurrency(row.targetDelta)}
          </div>
          <div
            className={cn(
              "text-xs",
              row.targetDeltaPercent < 0 ? "text-brand-accentRed" : "text-brand-brandBlue"
            )}
          >
            {formatPercent(row.targetDeltaPercent)}
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-right text-sm">
        {formatCurrency(row.budgetToday)}
      </td>
      <td className="px-4 py-3 text-right text-sm">{formatCurrency(row.budget)}</td>
      {selectedCustomFields.map((fieldId) => (
        <td key={fieldId} className="px-4 py-3 text-right text-sm">
          {row.customMetrics?.[customFieldLabels[fieldId] || fieldId] ??
            row.customMetrics?.[fieldId] ??
            "—"}
        </td>
      ))}
    </tr>
  );
}

function MobileCard({
  row,
  isSelected,
  onSelect,
  onToggleExpand,
  isExpanded,
  hasChildren,
  isTotal = false,
  selectedCustomFields,
  customFieldLabels,
}: {
  row: HierarchyRow;
  isSelected: boolean;
  onSelect: () => void;
  onToggleExpand: () => void;
  isExpanded: boolean;
  hasChildren: boolean;
  isTotal?: boolean;
  selectedCustomFields: string[];
  customFieldLabels: Record<string, string>;
}) {
  return (
    <div
      className={cn("p-4 space-y-3", isTotal && "bg-brand-lightGrey font-semibold")}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 flex-1">
          {!isTotal && (
            <button
              onClick={onSelect}
              className="flex items-center justify-center w-5 h-5 border border-gray-300 rounded hover:bg-gray-100 flex-shrink-0"
            >
              {isSelected && <div className="w-3 h-3 bg-brand-brandBlue rounded-sm" />}
            </button>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {hasChildren ? (
                <button
                  onClick={onToggleExpand}
                  className="p-1 rounded hover:bg-brand-lightGrey transition-colors"
                  aria-label="Expand row"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                  )}
                </button>
              ) : (
                <BarChart3 className="h-4 w-4 text-gray-400 flex-shrink-0" />
              )}
              <h3 className={cn("text-sm font-medium truncate", isTotal && "font-bold")}>
                {row.name}
              </h3>
              {row.status === "disabled" && (
                <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded flex-shrink-0">
                  DISABLED
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <Metric label="Spend" value={formatCurrency(row.spend)} />
        <Metric label="Impressions" value={formatNumber(row.impressions)} />
        <Metric label="CPM" value={formatCurrency(row.cpm)} />
        <Metric label="Clicks" value={formatNumber(row.clicks)} />
        <Metric label="CPC" value={formatCurrency(row.cpc)} />
        <Metric label="CTR" value={`${row.ctr.toFixed(2)}%`} />
        <Metric label="Purchases" value={formatNumber(row.purchases)} />
        <Metric label="CPA" value={formatCurrency(row.cpa)} />
        <Metric label="ROAS" value={row.roas.toFixed(2)} />
        <Metric
          label="Target Delta"
          value={formatCurrency(row.targetDelta)}
          helper={`${formatPercent(row.targetDeltaPercent)}`}
          valueClass={row.targetDelta < 0 ? "text-brand-accentRed" : "text-brand-brandBlue"}
        />
        {selectedCustomFields.map((fieldId) => {
          const label = customFieldLabels[fieldId] || fieldId;
          const val =
            row.customMetrics?.[label] ?? row.customMetrics?.[fieldId] ?? "—";
          return <Metric key={fieldId} label={label} value={String(val)} />;
        })}
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  helper,
  valueClass,
}: {
  label: string;
  value: string;
  helper?: string;
  valueClass?: string;
}) {
  return (
    <div>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className={cn("font-medium", valueClass)}>{value}</div>
      {helper && <div className="text-xs text-gray-500">{helper}</div>}
    </div>
  );
}


