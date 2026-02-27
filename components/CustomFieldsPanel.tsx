"use client";

import { CustomField } from "@/types";
import { X } from "lucide-react";
import { useMemo } from "react";

interface CustomFieldsPanelProps {
  fields: CustomField[];
  selected: string[];
  onChange: (next: string[]) => void;
  onClose: () => void;
}

export default function CustomFieldsPanel({
  fields,
  selected,
  onChange,
  onClose,
}: CustomFieldsPanelProps) {
  const isSelected = useMemo(() => new Set(selected), [selected]);

  const toggleField = (id: string) => {
    const next = new Set(isSelected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onChange(Array.from(next));
  };

  return (
    <div className="absolute right-4 top-12 z-50 w-[320px] max-h-[70vh] overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-brand-darkBlue">Custom Fields</h3>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-brand-lightGrey transition-colors"
          aria-label="Close custom fields"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {fields.map((field) => (
          <label
            key={field.id}
            className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={isSelected.has(field.id)}
              onChange={() => toggleField(field.id)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-brandBlue focus:ring-brand-brandBlue"
            />
            <span>{field.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}






