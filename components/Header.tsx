"use client";

import { useEffect, useRef, useState } from "react";
import { TrendingUp, List, Menu, UserCircle, Settings } from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface HeaderProps {
  earnings: number;
  sales: number;
}

export default function Header({ earnings, sales }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-[100] gradient-radial shadow-md">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Logo and Metrics */}
        <div className="flex items-center gap-4 lg:gap-6 flex-1">
          <div className="flex items-center gap-2">
            <img
              src="/TNT logo high res.png"
              alt="TNT Logo"
              className="h-6 w-6 lg:h-7 lg:w-7 object-contain"
            />
            <h1 className="text-xl lg:text-2xl font-heading font-bold text-white">
              TNT EDGE
            </h1>
          </div>

          {/* Earnings + Sales in a white pill */}
          <div className="hidden sm:flex items-center gap-4 lg:gap-6 bg-white rounded-lg px-3 py-1.5">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-brand-accentRed" />
              <span className="text-sm lg:text-base font-medium text-gray-700">Earnings</span>
              <span className="text-sm lg:text-base font-heading font-bold text-brand-darkBlue">
                {formatCurrency(earnings)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <List className="h-4 w-4 text-brand-brandBlue" />
              <span className="text-sm lg:text-base font-medium text-gray-700">Sales</span>
              <span className="text-sm lg:text-base font-heading font-bold text-brand-darkBlue">
                {formatNumber(sales)}
              </span>
            </div>
          </div>
        </div>

        {/* Search + Menu button */}
        <div className="flex items-center gap-2 lg:gap-4">
{/* Menu button + dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="p-2 rounded-lg bg-white hover:bg-brand-lightGrey transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5 text-brand-darkBlue" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[200]">
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-lightGrey transition-colors"
                >
                  <UserCircle className="h-4 w-4 text-brand-darkBlue" />
                  Profile
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-lightGrey transition-colors"
                >
                  <Settings className="h-4 w-4 text-brand-darkBlue" />
                  Settings
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}


