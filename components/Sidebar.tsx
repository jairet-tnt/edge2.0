"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  BarChart2,
  Image,
  MessageSquare,
  Layers,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

// ─── Nav data ─────────────────────────────────────────────────────────────────

const trafficLinks = [
  { label: "Executive Dashboard", href: "/executive-dashboard" },
  { label: "Edge", href: "/" },
  { label: "Ads KPI", href: "/ads-kpi" },
  { label: "Hourly Report", href: "/hourly-report" },
  { label: "Correlation report", href: "/correlation-report" },
  { label: "Manage Rules", href: "/manage-rules" },
];

const creativesLinks = [
  { label: "Video KPI", href: "/video-kpi" },
  { label: "Creatives KPI", href: "/creatives-kpi" },
  { label: "Ad Grid", href: "/ad-grid" },
  { label: "Policy Dashboard", href: "/policy-dashboard" },
  { label: "Strike Rate Report", href: "/strike-rate-report" },
];

const businessLinks = [
  { label: "Funnel Analysis", href: "/funnel-analysis" },
  { label: "Contribution Margin", href: "/contribution-margin" },
];

type NavSection = {
  type: "section";
  key: "traffic" | "creatives" | "business";
  label: string;
  collapsedLabel: string;
  icon: React.ElementType;
  links: { label: string; href: string }[];
};

type NavLink = {
  type: "link";
  key: string;
  label: string;
  collapsedLabel: string;
  icon: React.ElementType;
  href: string;
};

const NAV_ITEMS: (NavSection | NavLink)[] = [
  {
    type: "section",
    key: "traffic",
    label: "Traffic",
    collapsedLabel: "Traffic",
    icon: BarChart2,
    links: trafficLinks,
  },
  {
    type: "section",
    key: "creatives",
    label: "Creatives",
    collapsedLabel: "Creatives",
    icon: Image,
    links: creativesLinks,
  },
  {
    type: "link",
    key: "ai-chat",
    label: "AI Chat",
    collapsedLabel: "AI Chat",
    icon: MessageSquare,
    href: "/ai-chat",
  },
  {
    type: "section",
    key: "business",
    label: "Business Tools",
    collapsedLabel: "Business\nTools",
    icon: Layers,
    links: businessLinks,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isLinkActive = (href: string) => pathname === href;

  const isSectionActive = (links: { href: string }[]) =>
    links.some((l) => l.href === pathname);

  const [expandedSections, setExpandedSections] = useState({
    traffic: isSectionActive(trafficLinks),
    creatives: isSectionActive(creativesLinks),
    business: isSectionActive(businessLinks),
  });

  // Lock body scroll while mobile sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const toggleSection = (key: "traffic" | "creatives" | "business") => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLinkClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) onToggle();
  };

  return (
    <>
      {/* Mobile backdrop — tap to close */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          // Mobile: fixed, starts below header (top-16 = 64px)
          // Desktop: static, part of normal flex flow
          "fixed top-16 lg:static lg:top-auto",
          "left-0 z-50 lg:z-auto",
          "bg-brand-darkBlue border-r border-white/5",
          "flex flex-col transition-all duration-300 ease-in-out",
          collapsed ? "w-[68px]" : "w-56",
          // Mobile: slide in/out; Desktop: always visible
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        // Mobile: fill viewport below header; Desktop: fill parent height
        style={{ height: "calc(100vh - 64px)" }}
      >
        {/* ── Desktop-only collapse toggle ── */}
        <div
          className={cn(
            "flex-shrink-0 pt-4 pb-3 hidden lg:flex",
            collapsed ? "justify-center" : "justify-end pr-3"
          )}
        >
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="p-1.5 rounded text-brand-lightBlue hover:text-white hover:bg-white/10 transition-colors"
            aria-label={collapsed ? "Expand menu" : "Collapse menu"}
          >
            <PanelLeft className="h-5 w-5" />
          </button>
        </div>

        {/* ── Nav items — overscroll-contain prevents page scroll bleed ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain scrollbar-hide">
          {collapsed ? (
            /* ══ Collapsed: icon + label ══ */
            <nav className="flex flex-col items-center gap-0.5 px-1.5 pb-4">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active =
                  item.type === "section"
                    ? isSectionActive(item.links)
                    : isLinkActive(item.href);

                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setCollapsed(false);
                      if (item.type === "section") {
                        setExpandedSections({
                          traffic: item.key === "traffic",
                          creatives: item.key === "creatives",
                          business: item.key === "business",
                        });
                      }
                    }}
                    className={cn(
                      "flex flex-col items-center gap-1.5 py-3.5 w-full rounded-lg transition-colors",
                      active
                        ? "bg-white/10 text-white"
                        : "text-brand-lightBlue hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                    <span className="text-[11px] font-bold text-center leading-tight whitespace-pre-line px-0.5">
                      {item.collapsedLabel}
                    </span>
                  </button>
                );
              })}
            </nav>
          ) : (
            /* ══ Expanded: full navigation ══ */
            <div className="px-3 py-2 pb-6">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;

                if (item.type === "link") {
                  const active = isLinkActive(item.href);
                  return (
                    <div key={item.key} className="mb-1">
                      <Link
                        href={item.href}
                        onClick={handleLinkClick}
                        className={cn(
                          "w-full flex items-center gap-2 text-base font-bold py-2 px-2 rounded transition-colors",
                          active
                            ? "text-white bg-white/10"
                            : "text-white hover:text-brand-lightBlue hover:bg-white/5"
                        )}
                      >
                        <Icon className="h-4 w-4 text-brand-lightBlue flex-shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    </div>
                  );
                }

                // Section item
                const sectionActive = isSectionActive(item.links);
                const isExpanded = expandedSections[item.key];

                return (
                  <div key={item.key} className="mb-1">
                    <button
                      onClick={() => toggleSection(item.key)}
                      className={cn(
                        "w-full flex items-center justify-between text-base font-bold text-white hover:text-brand-lightBlue py-2 px-2 rounded transition-colors",
                        sectionActive && "bg-white/10"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-brand-lightBlue flex-shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-white" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-white" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="ml-6 mt-1 space-y-0.5">
                        {item.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={handleLinkClick}
                            className={cn(
                              "block text-sm py-1 px-2 rounded transition-colors",
                              pathname === link.href
                                ? "text-white font-semibold bg-white/10"
                                : "text-brand-lightBlue hover:text-white hover:bg-white/5"
                            )}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
