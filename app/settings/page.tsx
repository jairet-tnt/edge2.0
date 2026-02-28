"use client";

import { useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

type Theme = "light" | "dark" | "system";

const THEME_OPTIONS: { value: Theme; label: string; description: string; icon: React.ElementType }[] = [
  {
    value: "light",
    label: "Light",
    description: "Always use the light theme.",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    description: "Always use the dark theme.",
    icon: Moon,
  },
  {
    value: "system",
    label: "System",
    description: "Follow your device's system preference.",
    icon: Monitor,
  },
];

export default function SettingsPage() {
  const [theme, setTheme] = useState<Theme>("system");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-lg">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-1">Appearance</h2>
          <p className="text-sm text-gray-500 mb-5">Choose how the dashboard looks for you.</p>

          <div className="space-y-3">
            {THEME_OPTIONS.map(({ value, label, description, icon: Icon }) => {
              const active = theme === value;
              return (
                <label
                  key={value}
                  className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                    active
                      ? "border-brand-brandBlue bg-brand-brandBlue/5"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={value}
                    checked={active}
                    onChange={() => setTheme(value)}
                    className="sr-only"
                  />
                  {/* Custom radio dot */}
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      active ? "border-brand-brandBlue" : "border-gray-300"
                    }`}
                  >
                    {active && (
                      <div className="w-2 h-2 rounded-full bg-brand-brandBlue" />
                    )}
                  </div>

                  <Icon
                    className={`h-5 w-5 flex-shrink-0 ${active ? "text-brand-brandBlue" : "text-gray-400"}`}
                  />

                  <div>
                    <div className={`text-sm font-semibold ${active ? "text-brand-brandBlue" : "text-gray-700"}`}>
                      {label}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{description}</div>
                  </div>
                </label>
              );
            })}
          </div>

          <div className="mt-5">
            <button
              onClick={handleSave}
              className="w-full py-2 rounded-lg bg-brand-brandBlue text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              {saved ? "Saved!" : "Save Settings"}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
