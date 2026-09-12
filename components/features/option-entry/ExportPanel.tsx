"use client";

import { useState } from "react";
import { Check, Copy, Download, Sparkles } from "lucide-react";
import { ROUNDS } from "@/types";
import type { Category, OptionEntry } from "@/types";

export interface ExportPanelProps {
  optionList: OptionEntry[];
  candidateRank: number;
  category: Category;
  onAutoPopulate: () => void;
  onClear: () => void;
}

/** Gets the list off this screen and into the KEA portal. */
export function ExportPanel({
  optionList,
  candidateRank,
  category,
  onAutoPopulate,
  onClear,
}: ExportPanelProps) {
  const [copied, setCopied] = useState(false);

  const copyOptionList = async () => {
    if (optionList.length === 0) return;

    const header = [
      "KEA KCET OPTION ENTRY PREFERENCE LIST",
      `Rank: #${candidateRank.toLocaleString("en-IN")} | Category: ${category}`,
      "------------------------------------------------------------",
      "Pref # | College Code | College Name | Branch | Est. Cutoff",
      "------------------------------------------------------------",
    ].join("\n");

    const rows = optionList
      .map(
        ({ prediction: p }, idx) =>
          `${idx + 1}. [${p.college.kea_code}] ${p.college.shortName} - ${p.branch} (${p.branchName}) | ${ROUNDS[p.round]} closed #${p.closingRank.toLocaleString("en-IN")}`
      )
      .join("\n");

    try {
      await navigator.clipboard.writeText(`${header}\n${rows}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard can be blocked by the browser. The CSV export still works,
      // so fail quietly rather than throwing an alert at the student.
    }
  };

  const downloadCsv = () => {
    if (optionList.length === 0) return;

    const headers =
      "Priority,College Code,College Name,Branch Code,Branch Name,Category,Round,Opening Rank,Closing Rank,Chance %,Tier,Note";
    const rows = optionList.map(
      ({ prediction: p, tier, userNote }, idx) =>
        `${idx + 1},"${p.college.kea_code}","${p.college.name}","${p.branch}","${p.branchName}","${category}","${ROUNDS[p.round]}",${p.openingRank},${p.closingRank},${p.chancePercent}%,"${tier}","${userNote.replace(/"/g, "''")}"`
    );

    const blob = new Blob([[headers, ...rows].join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `KCET_Option_Entry_Rank_${candidateRank}_${category}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center gap-2.5 flex-wrap">
      <button
        onClick={onAutoPopulate}
        className="bg-[#CC3D2E] hover:bg-[#B5351F] text-white text-xs font-medium rounded-lg px-4 py-2.5 transition-colors flex items-center gap-2 shadow-[0_0_12px_rgba(139,92,246,0.3)]"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#CC3D2E]" aria-hidden />
        <span>Build my list</span>
      </button>

      {optionList.length > 0 && (
        <>
          <button
            onClick={copyOptionList}
            className="bg-transparent hover:bg-[#F0EDE8] border border-[#E5E0D8] text-xs font-medium text-[#1A1A1A] rounded-lg px-3.5 py-2.5 transition-colors flex items-center gap-1.5"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden />
            ) : (
              <Copy className="w-3.5 h-3.5" aria-hidden />
            )}
            <span>{copied ? "Copied" : "Copy list"}</span>
          </button>

          <button
            onClick={downloadCsv}
            className="bg-transparent hover:bg-[#F0EDE8] border border-[#E5E0D8] text-xs font-medium text-[#1A1A1A] rounded-lg px-3.5 py-2.5 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" aria-hidden />
            <span>Download CSV</span>
          </button>

          <button
            onClick={onClear}
            className="bg-transparent hover:bg-red-500/20 text-xs font-medium text-[#6B6B6B] hover:text-red-300 border border-white/8 rounded-lg px-3 py-2.5 transition-colors"
          >
            Clear all
          </button>
        </>
      )}
    </div>
  );
}

export default ExportPanel;
