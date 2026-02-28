"use client";

import { RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

// --- Chart helpers ---

function smoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev.x + curr.x) / 2;
    d += ` C ${cpx} ${prev.y} ${cpx} ${curr.y} ${curr.x} ${curr.y}`;
  }
  return d;
}

function normalize(values: number[], w: number, h: number, padX = 0, padY = 6) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  return values.map((v, i) => ({
    x: padX + (i / (values.length - 1)) * (w - padX * 2),
    y: h - padY - ((v - min) / range) * (h - padY * 2),
  }));
}

// Labels are intentionally omitted from all SVGs — rendered as HTML below each chart.

function SparklineArea({
  data,
  color = "#1d4c93",
  fillColor = "#89cde7",
}: {
  data: number[];
  color?: string;
  fillColor?: string;
}) {
  const W = 300;
  const H = 80;
  const points = normalize(data, W, H);
  const linePath = smoothPath(points);
  const areaPath =
    linePath + ` L ${points[points.length - 1].x} ${H} L ${points[0].x} ${H} Z`;
  const gradId = `grad-${color.replace("#", "")}`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      preserveAspectRatio="none"
      style={{ height: 80 }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fillColor} stopOpacity="0.4" />
          <stop offset="100%" stopColor={fillColor} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      {[20, 45, 70].map((y) => (
        <line
          key={y}
          x1={0} y1={y} x2={W} y2={y}
          stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 3"
        />
      ))}
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path d={linePath} stroke={color} strokeWidth="2" fill="none" />
    </svg>
  );
}

function BarChartSVG({
  data,
  color = "#1d4c93",
}: {
  data: number[];
  color?: string;
}) {
  const W = 300;
  const H = 80;
  const max = Math.max(...data) || 1;
  const barW = (W / data.length) * 0.6;
  const gap = W / data.length;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      preserveAspectRatio="none"
      style={{ height: 80 }}
    >
      {[20, 45, 70].map((y) => (
        <line
          key={y}
          x1={0} y1={y} x2={W} y2={y}
          stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 3"
        />
      ))}
      {data.map((v, i) => {
        const barH = (v / max) * (H - 10);
        const x = gap * i + gap * 0.2;
        return (
          <rect key={i} x={x} y={H - barH} width={barW} height={barH} fill={color} rx="1" />
        );
      })}
    </svg>
  );
}

function StackedBarChart({
  data,
  colors,
}: {
  data: number[][];
  colors: string[];
}) {
  const W = 280;
  const H = 80;
  const maxTotal = Math.max(
    ...data[0].map((_, i) => data.reduce((s, d) => s + d[i], 0))
  );
  const barW = (W / data[0].length) * 0.6;
  const gap = W / data[0].length;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      preserveAspectRatio="none"
      style={{ height: 80 }}
    >
      {[20, 45, 70].map((y) => (
        <line
          key={y}
          x1={0} y1={y} x2={W} y2={y}
          stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 3"
        />
      ))}
      {data[0].map((_, colIdx) => {
        let yOffset = H;
        return colors.map((color, rowIdx) => {
          const v = data[rowIdx][colIdx];
          const barH = (v / maxTotal) * (H - 4);
          yOffset -= barH;
          const y = yOffset;
          return (
            <rect
              key={`${rowIdx}-${colIdx}`}
              x={gap * colIdx + gap * 0.2}
              y={y}
              width={barW}
              height={barH}
              fill={color}
              rx="0"
            />
          );
        });
      })}
    </svg>
  );
}

// --- Mock data ---

const dateLabels = ["20/02", "22/02", "24/02", "26/02"];
const dateFull   = ["20/02", "21/02", "22/02", "23/02", "24/02", "25/02", "26/02"];

const revenueData = [380000, 360000, 420000, 395000, 355000, 335000, 365000];
const spendData   = [310000, 295000, 370000, 340000, 275000, 255000, 295000];
const roasData    = [1.38, 1.28, 1.42, 1.35, 1.22, 1.18, 1.32];
const merData     = [1.36, 1.27, 1.41, 1.33, 1.21, 1.17, 1.31];
const cacData     = [140, 125, 135, 128, 145, 152, 138];
const salesData   = [2500, 2200, 2800, 2600, 2000, 1900, 2400];
const cpmData     = [27, 25, 28, 26, 24, 23, 25];
const cpcData     = [1.3, 1.2, 1.4, 1.3, 1.1, 1.0, 1.2];
const cvrData     = [0.9, 0.85, 0.95, 0.88, 0.82, 0.8, 0.87];
const aovData     = [195, 188, 198, 192, 185, 183, 190];

const revenueByChannel = [
  [310000, 290000, 320000, 300000],
  [270000, 250000, 280000, 260000],
  [28000,  26000,  30000,  28000],
  [12000,  11000,  13000,  12000],
  [0, 0, 0, 0],
];
const spendByChannel = [
  [280000, 265000, 290000, 275000],
  [220000, 205000, 235000, 215000],
  [12000,  11000,  13000,  12000],
  [6000,   5500,   6500,   6000],
  [400,    350,    450,    400],
];
const channelColors = ["#e21729", "#1d4c93", "#89cde7", "#2dd4bf", "#6b7280"];

// --- Types ---

interface KpiCard {
  value: string;
  label: string;
  change: number;
  chart: "line" | "bar";
  data: number[];
}

interface ChannelCard {
  type: "channel";
  title: string;
  channels: { name: string; value: string; change: number }[];
  stackedData: number[][];
}

type Card = KpiCard | ChannelCard;

// --- Sub-components ---

/** Delta badge — uses light colours so it reads on the dark blue header */
function Delta({ change }: { change: number }) {
  const positive = change >= 0;
  return (
    <span
      className={`flex items-center gap-0.5 text-xs font-medium ${
        positive ? "text-green-600" : "text-brand-accentRed"
      }`}
    >
      {positive ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}
      {positive ? "+" : ""}
      {change.toFixed(2)}%
    </span>
  );
}

/** HTML date labels — uniform, never stretched */
function DateRow({ labels }: { labels: string[] }) {
  return (
    <div className="flex justify-between mt-1">
      {labels.map((lbl) => (
        <span key={lbl} className="text-[9px] text-gray-400 leading-none">
          {lbl}
        </span>
      ))}
    </div>
  );
}

function KpiCardComponent({ card }: { card: KpiCard }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
      {/* Dark blue title strip */}
      <div className="bg-brand-darkBlue px-4 py-2.5 flex-shrink-0">
        <span className="text-sm font-semibold text-white">{card.label}</span>
      </div>

      {/* Body */}
      <div className="px-4 pt-3 pb-4 flex flex-col gap-0 flex-1">
        <div className="flex items-baseline gap-2 mb-2">
          <div className="text-2xl font-heading font-bold text-brand-darkBlue">
            {card.value}
          </div>
          <Delta change={card.change} />
        </div>
        {card.chart === "line" ? (
          <SparklineArea data={card.data} />
        ) : (
          <BarChartSVG data={card.data} />
        )}
        <DateRow labels={dateFull} />
      </div>
    </div>
  );
}

function ChannelCardComponent({ card }: { card: ChannelCard }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
      {/* Dark blue title strip */}
      <div className="bg-brand-darkBlue px-4 py-2.5 flex-shrink-0">
        <span className="text-sm font-semibold text-white">{card.title}</span>
      </div>

      {/* Body */}
      <div className="px-4 pt-3 pb-4 flex flex-col gap-2 flex-1">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {card.channels.map((ch, i) => (
            <div key={ch.name} className="flex items-center justify-between min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: channelColors[i] ?? "#6b7280" }}
                />
                <span className="text-xs text-gray-600 truncate">{ch.name}</span>
              </div>
              <div className="flex items-center gap-1 ml-1 flex-shrink-0">
                <span className="text-xs font-medium text-gray-800">{ch.value}</span>
                <span
                  className={`text-xs ${
                    ch.change >= 0 ? "text-green-600" : "text-brand-accentRed"
                  }`}
                >
                  {ch.change >= 0 ? "+" : ""}
                  {ch.change.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
        <StackedBarChart data={card.stackedData} colors={channelColors} />
        <DateRow labels={dateLabels} />
      </div>
    </div>
  );
}

// --- Page ---

export default function ExecutiveDashboard() {
  const kpiCards: Card[] = [
    { value: "$2.9M",   label: "Total Revenue",     change: 15.12, chart: "line", data: revenueData },
    { value: "$2.1M",   label: "Total Spend",        change: 12.94, chart: "line", data: spendData   },
    { value: "144%",    label: "Paid Media ROAS",    change: 1.93,  chart: "line", data: roasData    },
    { value: "144%",    label: "MER",                change: 1.93,  chart: "line", data: merData     },
    { value: "$132.5",  label: "Blended CAC",        change: -3.37, chart: "bar",  data: cacData     },
    {
      type: "channel",
      title: "Revenue by Channel",
      channels: [
        { name: "Facebook", value: "$1.5M",   change: -1.77  },
        { name: "Google",   value: "$1.4M",   change: -41.81 },
        { name: "Bing",     value: "$37.5K",  change: 9.84   },
        { name: "AppLovin", value: "$24.3K",  change: -54.03 },
        { name: "TikTok",   value: "$0",      change: 0.0    },
      ],
      stackedData: revenueByChannel,
    },
    {
      type: "channel",
      title: "Spend per Channel",
      channels: [
        { name: "Facebook", value: "$1.1M",   change: 3.32   },
        { name: "Google",   value: "$913.8K", change: 28.59  },
        { name: "Bing",     value: "$15K",    change: -2.43  },
        { name: "AppLovin", value: "$7.9K",   change: -26.53 },
        { name: "TikTok",   value: "$455.6",  change: -70.34 },
      ],
      stackedData: spendByChannel,
    },
    { value: "15,478",  label: "Total Sales",        change: 16.88, chart: "line", data: salesData  },
    { value: "$25.8",   label: "Total CPM",          change: 0.34,  chart: "line", data: cpmData    },
    { value: "$1.2",    label: "Total CPC",          change: 6.8,   chart: "line", data: cpcData    },
    { value: "0.87%",   label: "Total CVR",          change: 10.53, chart: "line", data: cvrData    },
    { value: "$190.3",  label: "Total AoV",          change: 1.5,   chart: "line", data: aovData    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Filters */}
        <div className="bg-white rounded border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-end gap-3 lg:gap-4">
            <div className="flex flex-col gap-1">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Funnel</div>
              <select className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand-brandBlue">
                <option>...</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Platform</div>
              <select className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand-brandBlue">
                <option>...</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date Range</div>
              <input
                type="text"
                defaultValue="2026-02-20 to 2026-02-26"
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand-brandBlue"
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Calendar Range</div>
              <select className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand-brandBlue">
                <option>Last 7 Days</option>
                <option>Last Month</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <button className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-brand-lightBlue hover:bg-brand-brandBlue text-white transition-colors sm:col-span-2 lg:ml-auto">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {kpiCards.map((card, idx) =>
            "type" in card && card.type === "channel" ? (
              <ChannelCardComponent key={idx} card={card} />
            ) : (
              <KpiCardComponent key={idx} card={card as KpiCard} />
            )
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
