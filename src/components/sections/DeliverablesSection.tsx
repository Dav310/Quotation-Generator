"use client";
import React from "react";
import { useQuotation } from "@/context/QuotationContext";
import { SectionHeader } from "../ui/SectionHeader";
import { SeamlessInput } from "../ui/SeamlessInput";
import { RemoveButton } from "../ui/ActionButtons";

export const DeliverablesSection: React.FC = () => {
  const { localData, setLocalData, addArrayItem, removeArrayItem } = useQuotation();

  if (!localData) return null;

  return (
    <div className="mb-8 relative group">
      <SectionHeader
        title="6) DELIVERABLES"
        addLabel="+ Add Item"
        onAdd={() => addArrayItem("deliverables", "New Deliverable")}
      />
      <div className="border-x border-b quo-border-primary p-4 bg-[#fcfdfd]">
        <ul className="list-disc pl-5 space-y-2">
          {localData.deliverables.map((item, idx) => (
            <li key={idx} className="text-gray-700 relative group/row flex items-center pr-4">
              <div className="flex-1">
                <SeamlessInput
                  value={item}
                  onChange={(v: string) => {
                    const newDel = [...localData.deliverables];
                    newDel[idx] = v;
                    setLocalData({ ...localData, deliverables: newDel });
                  }}
                />
              </div>
              <RemoveButton onClick={() => removeArrayItem("deliverables", idx)} className="right-0" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
