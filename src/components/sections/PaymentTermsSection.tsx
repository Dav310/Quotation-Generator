"use client";
import React from "react";
import { useQuotation } from "@/context/QuotationContext";
import { SectionHeader } from "../ui/SectionHeader";
import { SeamlessInput } from "../ui/SeamlessInput";
import { RemoveButton } from "../ui/ActionButtons";

export const PaymentTermsSection: React.FC = () => {
  const { localData, updateMilestone, addArrayItem, removeArrayItem, formatCurrency } = useQuotation();

  if (!localData) return null;

  return (
    <div className="mb-8 relative group">
      <SectionHeader
        title="7) PAYMENT TERMS"
        addLabel="+ Add Term"
        onAdd={() =>
          addArrayItem("paymentMilestones", {
            description: "New Milestone",
            percentage: 0,
            amount: 0,
          })
        }
      />
      <table className="w-full border-x quo-border-primary">
        <thead className="quo-table-header text-xs text-left">
          <tr>
            <th className="py-2 px-3 font-medium">Milestone</th>
            <th className="py-2 px-3 font-medium w-24">%</th>
            <th className="py-2 px-3 font-medium text-right w-32">
              Amount (₹)
            </th>
          </tr>
        </thead>
        <tbody>
          {localData.paymentMilestones.map((ms, idx) => (
            <tr key={idx} className="quo-table-row relative group/row">
              <td className="py-2 px-3 border-b quo-border-bottom-primary">
                <SeamlessInput
                  value={ms.description}
                  onChange={(v: string) => updateMilestone(idx, "description", v)}
                />
              </td>
              <td className="py-2 px-3 border-b quo-border-bottom-primary">
                <div className="flex items-center">
                  <SeamlessInput
                    value={ms.percentage}
                    onChange={(v: number) => updateMilestone(idx, "percentage", v)}
                    isNumber={true}
                    className="w-10"
                  />{" "}
                  %
                </div>
              </td>
              <td className="py-2 px-3 border-b quo-border-bottom-primary text-right font-bold text-gray-800 relative">
                <RemoveButton onClick={() => removeArrayItem("paymentMilestones", idx)} className="-right-6 top-2" />
                ₹{formatCurrency(ms.amount)}
              </td>
            </tr>
          ))}
          <tr className="quo-table-header">
            <td className="py-2 px-3 font-bold text-sm tracking-wide">Total</td>
            <td className="py-2 px-3 font-bold text-sm">100%</td>
            <td className="py-2 px-3 text-right font-bold text-sm">
              ₹{formatCurrency(localData.totalCost)}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="mt-2 text-xs text-gray-600">
        <strong>Payment Mode:</strong> Bank Transfer / UPI / NEFT (Details in Invoice)
      </div>
    </div>
  );
};
