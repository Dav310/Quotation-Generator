"use client";
import React from "react";
import { useQuotation } from "@/context/QuotationContext";
import { SectionHeader } from "../ui/SectionHeader";
import { SeamlessInput } from "../ui/SeamlessInput";
import { SeamlessTextArea } from "../ui/SeamlessTextArea";
import { RemoveButton } from "../ui/ActionButtons";

export const ModulePricingSection: React.FC = () => {
  const { localData, updateModule, addArrayItem, removeArrayItem, formatCurrency } = useQuotation();

  if (!localData) return null;

  return (
    <div className="mb-8 relative group">
      <SectionHeader
        title="4) MODULE-WISE SCOPE & PRICING"
        addLabel="+ Add Module"
        onAdd={() =>
          addArrayItem("modules", {
            name: "New Module",
            description: "",
            cost: 0,
          })
        }
      />
      <table className="w-full border-x border-b quo-border-primary text-sm">
        <thead className="quo-table-header text-left text-xs">
          <tr>
            <th className="py-1.5 px-2 font-medium w-10 text-center">Sr.</th>
            <th className="py-1.5 px-2 font-medium">
              Module Name / Features & Description
            </th>
            <th className="py-1.5 px-2 font-medium text-right w-28">
              Amount (₹)
            </th>
          </tr>
        </thead>
        <tbody>
          {localData.modules.map((module, idx) => (
            <tr key={idx} className="quo-table-row relative group/row">
              <td className="py-1.5 px-2 align-top text-gray-500 border-b quo-border-bottom-primary text-center">
                {idx + 1}
              </td>
              <td className="py-1.5 px-2 align-top border-b quo-border-bottom-primary">
                <SeamlessInput
                  value={module.name}
                  onChange={(v: string) => updateModule(idx, "name", v)}
                  bold={true}
                  className="text-[13px] text-gray-900 leading-tight"
                />
                <SeamlessTextArea
                  value={module.description}
                  onChange={(v: string) => updateModule(idx, "description", v)}
                  className="text-[12px] text-gray-600 mt-0.5 leading-tight"
                />
              </td>
              <td className="py-1.5 px-2 align-top border-b quo-border-bottom-primary relative">
                <RemoveButton onClick={() => removeArrayItem("modules", idx)} className="-right-6 top-2" />
                <SeamlessInput
                  value={formatCurrency(module.cost)}
                  onChange={(v: number) => updateModule(idx, "cost", v)}
                  bold={true}
                  align="right"
                  isNumber={true}
                  className="text-[13px]"
                />
              </td>
            </tr>
          ))}
          <tr className="quo-table-header">
            <td colSpan={2} className="py-1.5 px-2 text-right font-bold text-[13px] tracking-wide">
              Grand Total
            </td>
            <td className="py-1.5 px-2 text-right font-bold text-[13px]">
              ₹{formatCurrency(localData.totalCost)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
