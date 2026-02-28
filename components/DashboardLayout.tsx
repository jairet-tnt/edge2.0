"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-lightGrey flex flex-col">
      <Header earnings={12300} sales={264} onSidebarToggle={() => setSidebarOpen((o) => !o)} />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Menu Button */}
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />

        <main className="flex-1 overflow-y-auto lg:ml-0">
          <div className="max-w-[1920px] mx-auto flex flex-col min-h-full">
            <div className="flex-1">{children}</div>

            <footer className="px-6 py-4 border-t border-gray-200 bg-white">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
                <div>
                  <div className="flex items-center gap-4 mb-1">
                    <a href="/" className="hover:text-gray-900">
                      Home
                    </a>
                    <a href="#" className="hover:text-gray-900">
                      Help
                    </a>
                  </div>
                  <div>Copyright 2026 © All rights reserved.</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-brand-accentRed rounded flex items-center justify-center">
                    <span className="text-white font-bold text-sm leading-none">/</span>
                  </div>
                  <span className="font-semibold text-gray-800">Tried and True Media</span>
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
