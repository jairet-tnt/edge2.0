"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, MoreVertical, Plus } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

// --- Mock data ---

interface Campaign {
  id: string;
  name: string;
  status?: string;
  platform: string;
  priority: string;
  tags: string;
  pipeline: string;
  launchOn?: string;
  assignedTo?: string;
  statusNote?: string;
}

const readyForLaunch: Campaign[] = [
  { id: "r1", name: "SugarTreatInc-2603389-WWHZ", platform: "Facebook", priority: "Normal", tags: "NeuroGenics", pipeline: "HZ" },
  { id: "r2", name: "NgepaSabaSabe-2606389-NN", platform: "Facebook", priority: "Normal", tags: "NeuroGenics", pipeline: "NN" },
  { id: "r3", name: "MetaBallev-2606379-MDSC", platform: "YouTube", priority: "Normal", tags: "AV Labs", pipeline: "MDSC" },
  { id: "r4", name: "AllPTestConstantConstigation-2609977-VT", platform: "Facebook", priority: "Normal", tags: "Emma", pipeline: "HZ" },
  { id: "r5", name: "TopStatisReworks/OP-2607983-HZ", platform: "Facebook", priority: "Normal", tags: "Emma", pipeline: "HZ" },
  { id: "r6", name: "WhisperTricks/HumanTalentTool-2606061-VT", platform: "Facebook", priority: "Normal", tags: "Lung Clear", pipeline: "VT" },
  { id: "r7", name: "ReviewTestNBoindConstigation-2698502-HZ", platform: "YouTube", priority: "Normal", tags: "Emma", pipeline: "HZ" },
  { id: "r8", name: "TallyToProgSurganOut-2115604-VT", platform: "TikTok", priority: "Normal", tags: "Emma", pipeline: "VT" },
  { id: "r9", name: "SugarTreatInBoindBees-2603867-VT", platform: "Facebook", priority: "Normal", tags: "NeuroGenics", pipeline: "VT" },
  { id: "r10", name: "BaliBonesCaraVal-2606583-NN", platform: "Facebook", priority: "Normal", tags: "Emma", pipeline: "NN" },
  { id: "r11", name: "DavidMyBloodingSuruDemandGen-2607309-VT", platform: "YouTube", priority: "Normal", tags: "AB Amino", pipeline: "VT" },
  { id: "r12", name: "BroDisiticalBestHooksTappers-2603824-MMHZ", platform: "Facebook", priority: "Normal", tags: "Sofun", pipeline: "NMHZ", statusNote: "En: (#4) Application request limit reached." },
  { id: "r13", name: "BagnTestTcTestOutNissalsEmotions/Stories-1102041-WWHZ", platform: "Facebook", priority: "Normal", tags: "Emma", pipeline: "WWHZ", statusNote: "En: (#4) Application request limit reached." },
  { id: "r14", name: "ColorFulLiveDatacStaticPOP-2699105p-JIS-NDP-VT", platform: "Facebook", priority: "Normal", tags: "AKKA LCP", pipeline: "HZ", statusNote: "En: Error with campaign creation" },
];

const pendingQA: Campaign[] = [
  { id: "p1", name: "RetinaShtieldCamLine-1124114-WWVT", status: "", platform: "Facebook", priority: "Normal", tags: "Vision Hero", pipeline: "WWVT", launchOn: "2025-11-08", assignedTo: "Marc Manes" },
  { id: "p2", name: "TSNretargeting-1128328-NA", status: "", platform: "Facebook", priority: "Normal", tags: "TestsGreens", pipeline: "NA", launchOn: "", assignedTo: "Sohail Chatut" },
  { id: "p3", name: "APLookV1Walking-1142350-WWVT", status: "", platform: "AppLovin", priority: "Normal", tags: "ProFlix", pipeline: "WWVT", launchOn: "", assignedTo: "Monique Charles" },
  { id: "p4", name: "APLookV1Walking-1142350-WWVT", status: "", platform: "AppLovin", priority: "Normal", tags: "ProFlix", pipeline: "WWVT", launchOn: "", assignedTo: "Monique Charles" },
  { id: "p5", name: "FoodLineStrip-1130334-WWVT", status: "", platform: "Facebook", priority: "Normal", tags: "ScalEase", pipeline: "WWVT", launchOn: "", assignedTo: "Monique Charles/Kristina" },
  { id: "p6", name: "V1Compl-1148350-WWVT", status: "", platform: "AppLovin", priority: "Normal", tags: "ScalEase", pipeline: "WWVT", launchOn: "", assignedTo: "Monique Charles" },
  { id: "p7", name: "FBThreadSmoothline-1142387-WWVT", status: "", platform: "Facebook", priority: "Normal", tags: "ScalEase", pipeline: "WWVT", launchOn: "", assignedTo: "Monique Charles/Kristina" },
  { id: "p8", name: "CastorOilWretaProveOVV-1142396-WWHZ", status: "", platform: "Facebook", priority: "Normal", tags: "TestsGreens", pipeline: "WWHZ", launchOn: "", assignedTo: "Monique Charles" },
  { id: "p9", name: "BiblicalStoryGPSwaps(2)-1144907-WWVT", status: "", platform: "Facebook", priority: "Normal", tags: "Neil Exodus", pipeline: "WWVT", launchOn: "", assignedTo: "Kristina/Marc Manes" },
  { id: "p10", name: "BiblicalStoryGPSwaps(3)-1144907-WWVT", status: "", platform: "Facebook", priority: "Normal", tags: "Neil Exodus", pipeline: "WWVT", launchOn: "", assignedTo: "Kristina/Marc Manes" },
  { id: "p11", name: "ProductRevealImageClient-1150068-NA", status: "", platform: "Facebook", priority: "Normal", tags: "AB Amino", pipeline: "NA", launchOn: "", assignedTo: "Jamie/Kristina" },
  { id: "p12", name: "ClientNewHookBody-1148403-NN", status: "", platform: "Facebook", priority: "Normal", tags: "AB Amino", pipeline: "NN", launchOn: "", assignedTo: "Jamie/Kristina" },
  { id: "p13", name: "WaterDobutALCutDawn-1149753-NN", status: "", platform: "AppLovin", priority: "Normal", tags: "Lymph Savior", pipeline: "NN", launchOn: "", assignedTo: "Marc Manes" },
  { id: "p14", name: "TCutDownBoostOfto-1151161-WWHZ", status: "", platform: "Facebook", priority: "Normal", tags: "Vital BP", pipeline: "WWHZ", launchOn: "", assignedTo: "Monique Charles/Zima" },
];

const launched: Campaign[] = [
  { id: "l1", name: "MitoStaticMamteIMonials-1129992-NA", statusNote: "Reusing existing campaign for [k] AB Amino with ID: 491248826356", platform: "Facebook", priority: "Normal", tags: "AB Amino", pipeline: "NA", launchOn: "2025-10-08" },
  { id: "l2", name: "MitoStaticMamteIMonials-1129997-NA", statusNote: "Reusing existing campaign for [k] AB Amino with ID: 491248826356", platform: "Facebook", priority: "Normal", tags: "AB Amino", pipeline: "NA", launchOn: "2025-10-08" },
  { id: "l3", name: "MitoStaticMamteIMonials-1129996-NA", statusNote: "Reusing existing campaign for [k] AB Amino with ID: 491248826356", platform: "Facebook", priority: "Normal", tags: "AB Amino", pipeline: "NA", launchOn: "2025-10-08" },
  { id: "l4", name: "IsoCreep-1130324-WWHZ", statusNote: "Reusing existing campaign for [k] AV Labs with ID: 12023930903830769", platform: "Facebook", priority: "Normal", tags: "AV Labs", pipeline: "WWHZ", launchOn: "2025-10-03" },
  { id: "l5", name: "EverylonDubiMycp-1130364-WWHZ", statusNote: "Reusing existing campaign for [k] AV Labs with ID: 12023930903830769", platform: "Facebook", priority: "Normal", tags: "AV Labs", pipeline: "WWHZ", launchOn: "2025-10-03" },
  { id: "l6", name: "HypaSecondPostTest-1130426-WWHZ", statusNote: "Reusing existing campaign for [k] AV Labs with ID: 12023930903830769", platform: "Facebook", priority: "Normal", tags: "AV Labs", pipeline: "WWHZ", launchOn: "2025-10-03" },
  { id: "l7", name: "BuilingBioShoPostTestTest-1130426-NA", statusNote: "Reusing existing campaign for [k] AV Labs with ID: 12023930903830769", platform: "Facebook", priority: "Normal", tags: "AV Labs", pipeline: "NA", launchOn: "2025-10-03" },
  { id: "l8", name: "OfferingToTheGoodChildToppers-1132041-WWVT", statusNote: "Reusing existing campaign for [k] TestsGreens with ID: 12023726281500435", platform: "Facebook", priority: "Normal", tags: "TestsGreens", pipeline: "WWVT", launchOn: "2025-10-03" },
  { id: "l9", name: "2PhdHeadsDiscoveredFilter-1134141-WWVT", statusNote: "Reusing existing campaign for [k] Emma with ID: 1202537469126050983", platform: "Google", priority: "Normal", tags: "Emma", pipeline: "WWVT", launchOn: "2025-10-30" },
  { id: "l10", name: "2PhdHeadsDiscoveredOnHisWeightCast-1137507-WWVT", statusNote: "Reusing existing campaign for [k] Emma with ID: 1202346336170020583", platform: "Facebook", priority: "Normal", tags: "Emma", pipeline: "WWVT", launchOn: "2025-10-31" },
  { id: "l11", name: "BananaBerryTopperCVExpansion-1129196-WWVT", statusNote: "Reusing existing campaign for [k] Simple Blood Sugar with ID: 1202287101577200753", platform: "Facebook", priority: "Normal", tags: "Simple Blood Sugar", pipeline: "WWVT", launchOn: "2025-10-31" },
  { id: "l12", name: "2PhdHeadsDiscoveredInParamedHistoKalPred-1130669-WWVT", statusNote: "Reusing existing campaign for [k] Emma with ID: 1202346336170020583", platform: "Facebook", priority: "Normal", tags: "Emma", pipeline: "WWVT", launchOn: "2025-10-31" },
];

const onHold: Campaign[] = [
  { id: "h1", name: "2PhdHeadsDiscoveredConstigation-1130662-WWVT", platform: "Facebook", priority: "Normal", tags: "ScalEase", pipeline: "WWVT", launchOn: "", assignedTo: "Sohail/Zima/Kristina" },
  { id: "h2", name: "Up1BClaveTool-1127749-WWVT", platform: "Google", priority: "Normal", tags: "ScalEase", pipeline: "WWVT", launchOn: "", assignedTo: "Monique Charles" },
  { id: "h3", name: "SinControlSplitPostVoluteBlond-1127859-WWHZ", platform: "Google", priority: "Normal", tags: "ScalEase", pipeline: "WWHZ", launchOn: "", assignedTo: "Monique Charles" },
  { id: "h4", name: "ShiftControlDual-quority-1127862-WWHZ", platform: "Google", priority: "Normal", tags: "ScalEase", pipeline: "WWHZ", launchOn: "", assignedTo: "Monique Charles" },
  { id: "h5", name: "SHIFt3xSplitPairDirecti-1127867-WWHZ", platform: "Google", priority: "Normal", tags: "ScalEase", pipeline: "WWHZ", launchOn: "", assignedTo: "Monique Charles" },
  { id: "h6", name: "SHIFt3xSplitPairReshColorr-1127870-WWHZ", platform: "Google", priority: "Normal", tags: "ScalEase", pipeline: "WWHZ", launchOn: "", assignedTo: "Monique Charles" },
  { id: "h7", name: "SHIFt2xSplitPairColorr-1127880-WWHZ", platform: "Google", priority: "Normal", tags: "ScalEase", pipeline: "WWHZ", launchOn: "", assignedTo: "Monique Charles" },
  { id: "h8", name: "SHIFt2xSplitPairColorr-1127893-WWHZ", platform: "Google", priority: "Normal", tags: "ScalEase", pipeline: "WWHZ", launchOn: "", assignedTo: "Monique Charles" },
  { id: "h9", name: "CBPenisCliTool-1128113-WWHZ", platform: "Google", priority: "Normal", tags: "ScalEase", pipeline: "WWHZ", launchOn: "", assignedTo: "Monique Charles" },
  { id: "h10", name: "SinControlSplitPairHStretch-1128271-WWHZ", platform: "Google", priority: "Normal", tags: "ScalEase", pipeline: "WWHZ", launchOn: "", assignedTo: "Monique Charles" },
  { id: "h11", name: "AnimalazePitHostImballee-1132007-WWVT", platform: "Facebook", priority: "Normal", tags: "TestsGreens", pipeline: "WWVT", launchOn: "", assignedTo: "Sohail Chatut" },
  { id: "h12", name: "RCRetargeting-1128380-NA", platform: "Facebook", priority: "Normal", tags: "Retina Clear", pipeline: "NA", launchOn: "", assignedTo: "Sohail Chatut" },
  { id: "h13", name: "Taco200IIMinorHilS/Female-1127360-WWVT", platform: "Facebook", priority: "Normal", tags: "TestsGreens", pipeline: "WWVT", launchOn: "", assignedTo: "Sohail Chatut" },
  { id: "h14", name: "9InlineFoodAlterHookBode-1306426-WWVT", platform: "Facebook", priority: "Normal", tags: "TestsGreens", pipeline: "WWVT", launchOn: "", assignedTo: "Sohail Chatut" },
  { id: "h15", name: "BaseRBStation-1131073-NA", platform: "Facebook", priority: "Normal", tags: "Vital BP", pipeline: "NN", launchOn: "", assignedTo: "Admin/Monique Charles" },
];

interface SectionProps {
  title: string;
  campaigns: Campaign[];
  totalCount: number;
  variant: "ready" | "pending" | "launched" | "hold";
  showAssigned?: boolean;
  showStatus?: boolean;
}

function CampaignSection({ title, campaigns, totalCount, variant, showAssigned, showStatus }: SectionProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const perPage = 15;
  const totalPages = Math.ceil(totalCount / perPage);
  const displayed = campaigns.slice(0, perPage);

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedRows.size === displayed.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(displayed.map((c) => c.id)));
    }
  };

  const badgeColor =
    variant === "ready"
      ? "bg-orange-100 text-orange-700 border-orange-200"
      : "bg-gray-100 text-gray-600 border-gray-200";

  return (
    <div className="bg-white rounded border border-gray-200 overflow-hidden">
      {/* Section header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-brand-lightGrey">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
          <span className={`text-xs px-2 py-0.5 rounded border font-medium ${badgeColor}`}>
            {totalCount}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={selectAll}
            className="text-xs font-semibold text-brand-brandBlue hover:text-brand-darkBlue transition-colors"
          >
            SELECT ALL {displayed.length}
          </button>
          <span className="text-xs text-gray-500">{selectedRows.size} selected</span>
          <button className="px-3 py-1 bg-brand-brandBlue text-white text-xs font-semibold rounded hover:bg-brand-darkBlue transition-colors disabled:opacity-40">
            UPDATE SELECTED
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="px-4 py-2.5 w-8">
                <button
                  onClick={selectAll}
                  className="flex items-center justify-center w-4 h-4 border border-gray-300 rounded hover:bg-brand-lightGrey"
                >
                  {selectedRows.size === displayed.length && displayed.length > 0 && (
                    <div className="w-2.5 h-2.5 bg-brand-brandBlue rounded-sm" />
                  )}
                </button>
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-1">Name <span className="text-gray-400 text-[10px]">⇅</span></div>
              </th>
              {showStatus && (
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-1">Status <span className="text-gray-400 text-[10px]">⇅</span></div>
                </th>
              )}
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Platform</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Priority</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tags</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pipeline</th>
              {(showAssigned || variant === "launched") && (
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-1">Launch On <span className="text-gray-400 text-[10px]">⇅</span></div>
                </th>
              )}
              {showAssigned && (
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Assigned To</th>
              )}
              {showAssigned && <th className="px-4 py-2.5 w-8" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {displayed.map((c) => (
              <tr
                key={c.id}
                className="hover:bg-brand-lightGrey transition-colors"
              >
                <td className="px-4 py-2.5">
                  <button
                    onClick={() => toggleRow(c.id)}
                    className="flex items-center justify-center w-4 h-4 border border-gray-300 rounded hover:bg-brand-lightGrey"
                  >
                    {selectedRows.has(c.id) && (
                      <div className="w-2.5 h-2.5 bg-brand-brandBlue rounded-sm" />
                    )}
                  </button>
                </td>
                <td className="px-4 py-2.5">
                  <div className="text-xs font-medium text-gray-800">{c.name}</div>
                  {c.statusNote && (
                    <div className="text-xs text-brand-accentRed mt-0.5 max-w-xs truncate">
                      {c.statusNote}
                    </div>
                  )}
                </td>
                {showStatus && (
                  <td className="px-4 py-2.5 text-xs text-gray-600 max-w-xs">
                    {c.statusNote && (
                      <span className="text-gray-500 truncate block max-w-[300px]">{c.statusNote}</span>
                    )}
                  </td>
                )}
                <td className="px-4 py-2.5 text-xs text-gray-700">{c.platform}</td>
                <td className="px-4 py-2.5 text-xs text-gray-700">{c.priority}</td>
                <td className="px-4 py-2.5 text-xs text-gray-700">{c.tags}</td>
                <td className="px-4 py-2.5 text-xs text-gray-700">{c.pipeline}</td>
                {(showAssigned || variant === "launched") && (
                  <td className="px-4 py-2.5 text-xs text-gray-700 whitespace-nowrap">{c.launchOn || ""}</td>
                )}
                {showAssigned && (
                  <td className="px-4 py-2.5 text-xs text-gray-700">{c.assignedTo}</td>
                )}
                {showAssigned && (
                  <td className="px-4 py-2.5">
                    <button className="p-1 rounded hover:bg-brand-lightGrey transition-colors">
                      <MoreVertical className="h-4 w-4 text-gray-400" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-200 text-xs text-gray-500">
        <span>1 – {Math.min(perPage, totalCount)} of {totalCount}</span>
        <div className="flex items-center gap-1">
          <button className="px-1.5 py-0.5 rounded hover:bg-brand-lightGrey disabled:opacity-30">‹ Prev</button>
          <button className="px-2 py-0.5 rounded bg-brand-brandBlue text-white font-semibold">1</button>
          {totalPages > 1 && (
            <button className="px-1.5 py-0.5 rounded hover:bg-brand-lightGrey">Next ›</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdGridPage() {
  const [filterOpen, setFilterOpen] = useState(true);

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-4">
        {/* Header actions */}
        <div className="flex justify-end">
          <button className="flex items-center gap-1.5 px-4 py-2 bg-brand-accentRed text-white text-sm font-semibold rounded hover:opacity-90 transition-opacity uppercase tracking-wide">
            <Plus className="h-4 w-4" />
            Create Campaign
          </button>
        </div>

        {/* Filter Panel (collapsible) */}
        <div className="bg-white rounded border border-gray-200">
          <button
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-brand-lightGrey transition-colors"
            onClick={() => setFilterOpen((v) => !v)}
          >
            <span>Filter</span>
            {filterOpen ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
          </button>

          {filterOpen && (
            <div className="px-4 pb-4 border-t border-gray-100">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-3">
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Filter Campaign Name</div>
                  <select className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-brandBlue">
                    <option>Including Ad Labels</option>
                  </select>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Value</div>
                  <input
                    type="text"
                    placeholder="Enter name"
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-brandBlue"
                  />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tag Value</div>
                  <select className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-brandBlue">
                    <option>...</option>
                  </select>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">User Value</div>
                  <select className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-brandBlue">
                    <option>...</option>
                  </select>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Filter Platform</div>
                  <select className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-brandBlue">
                    <option>...</option>
                  </select>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Filter Priority</div>
                  <div className="flex items-center gap-1">
                    <select className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-brandBlue">
                      <option>...</option>
                    </select>
                    <span className="text-gray-400 text-xs">–</span>
                    <input type="number" placeholder="0" className="w-16 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-brandBlue" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3 max-w-sm">
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Date Range</div>
                  <input
                    type="text"
                    className="w-full px-2 py-1.5 border border-gray-200 bg-gray-100 rounded text-sm text-gray-400 cursor-not-allowed"
                    disabled
                  />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Calendar Range</div>
                  <select className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-brandBlue">
                    <option>...</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <button className="px-4 py-1.5 bg-brand-brandBlue text-white text-xs font-semibold rounded hover:bg-brand-darkBlue transition-colors uppercase tracking-wide">
                  Apply Filter
                </button>
                <button className="px-4 py-1.5 border border-gray-300 text-gray-600 text-xs font-semibold rounded hover:bg-brand-lightGrey transition-colors uppercase tracking-wide">
                  Clear Filter
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Status sections */}
        <CampaignSection
          title="Ready for Launch"
          campaigns={readyForLaunch}
          totalCount={19}
          variant="ready"
          showStatus={false}
          showAssigned={false}
        />

        <CampaignSection
          title="Pending QA"
          campaigns={pendingQA}
          totalCount={156}
          variant="pending"
          showStatus={true}
          showAssigned={true}
        />

        <CampaignSection
          title="Launched"
          campaigns={launched}
          totalCount={2797}
          variant="launched"
          showStatus={true}
          showAssigned={false}
        />

        <CampaignSection
          title="On Hold"
          campaigns={onHold}
          totalCount={115}
          variant="hold"
          showStatus={false}
          showAssigned={true}
        />
      </div>
    </DashboardLayout>
  );
}
