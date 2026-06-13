"use client";
import React from "react";
import { useQuotation } from "@/context/QuotationContext";
import { SectionHeader } from "../ui/SectionHeader";
import { SeamlessInput } from "../ui/SeamlessInput";
import { RemoveButton } from "../ui/ActionButtons";

export const AssumptionsExclusionsSection: React.FC = () => {
  const { localData, setLocalData, addArrayItem, removeArrayItem } = useQuotation();

  if (!localData) return null;

  return (
    <div className="mb-8 relative group">
      <SectionHeader title="8) ASSUMPTIONS & EXCLUSIONS">
        <div className="print:hidden flex gap-2">
          <button
            onClick={() => addArrayItem("assumptions", "New Assumption")}
            className="bg-white/20 hover:bg-white/40 text-white px-2 py-0.5 rounded text-[10px] transition-all cursor-pointer"
          >
            + Add Assumption
          </button>
          
        </div>
      </SectionHeader>
      <div className="border-x border-b border-blue-200 p-4 bg-yellow-50/30">
        <ul className="list-disc pl-5 space-y-2">
          {localData.assumptions.map((item, idx) => (
            <li key={`assump-${idx}`} className="text-gray-700 relative group/row flex items-center pr-4">
              <div className="flex-1">
                <SeamlessInput
                  value={item}
                  onChange={(v: string) => {
                    const newArr = [...localData.assumptions];
                    newArr[idx] = v;
                    setLocalData({ ...localData, assumptions: newArr });
                  }}
                />
              </div>
              <RemoveButton onClick={() => removeArrayItem("assumptions", idx)} className="right-0" />
            </li>
          ))}
          
        </ul>
      </div>
    </div>
  );
};
