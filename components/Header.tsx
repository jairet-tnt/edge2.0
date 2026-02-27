"use client";

import { Search, TrendingUp, List, User } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface HeaderProps {
  earnings: number;
  sales: number;
}

export default function Header({ earnings, sales }: HeaderProps) {
  return (
    <header className="sticky top-0 z-[100] bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Logo and Metrics */}
        <div className="flex items-center gap-4 lg:gap-6 flex-1">
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 gradient-radial rounded flex items-center gap-2">
              <img 
                src="/TNT logo high res.png" 
                alt="TNT Logo" 
                className="h-6 w-6 lg:h-7 lg:w-7 object-contain"
              />
              <h1 className="text-xl lg:text-2xl font-heading font-bold text-white">
                TNT EDGE
              </h1>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-4 lg:gap-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-brand-accentRed" />
              <span className="text-sm lg:text-base font-medium text-gray-700">
                Earnings
              </span>
              <span className="text-sm lg:text-base font-heading font-bold text-brand-darkBlue">
                {formatCurrency(earnings)}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <List className="h-4 w-4 text-brand-brandBlue" />
              <span className="text-sm lg:text-base font-medium text-gray-700">
                Sales
              </span>
              <span className="text-sm lg:text-base font-heading font-bold text-brand-darkBlue">
                {formatNumber(sales)}
              </span>
            </div>
          </div>
        </div>

        {/* Search and Profile */}
        <div className="flex items-center gap-2 lg:gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-brandBlue focus:border-transparent w-48 lg:w-64"
            />
          </div>
          
          <button className="p-2 rounded-lg hover:bg-brand-lightGrey transition-colors">
            <User className="h-5 w-5 text-brand-darkBlue" />
          </button>
        </div>
      </div>
    </header>
  );
}


