"use client";
import React from "react";
import { useQuotation } from "@/context/QuotationContext";
import { SectionHeader } from "../ui/SectionHeader";
import { SeamlessInput } from "../ui/SeamlessInput";
import { RemoveButton } from "../ui/ActionButtons";

export const DeliveryPlanSection: React.FC = () => {
  const { localData, setLocalData, addArrayItem, removeArrayItem } = useQuotation();

  if (!localData) return null;

  return (
    <div className="mb-8 relative group">
      <SectionHeader
        title="5) DELIVERY PLAN"
        addLabel="+ Add Plan"
        onAdd={() => addArrayItem("deliveryPlan", { week: "New Week", tasks: "" })}
      />
      <table className="w-full border-x border-b quo-border-primary">
        <thead className="quo-table-header text-xs text-left">
          <tr>
            <th className="py-2 px-3 font-medium w-24">Week</th>
            <th className="py-2 px-3 font-medium">Planned Work</th>
          </tr>
        </thead>
        <tbody>
          {localData.deliveryPlan.map((plan, idx) => (
            <tr key={idx} className="quo-table-row relative group/row">
              <td className="py-2 px-3 align-top border-b quo-border-bottom-primary font-bold quo-primary-text">
                <SeamlessInput
                  value={plan.week}
                  onChange={(v: string) => {
                    const newPlan = [...localData.deliveryPlan];
                    newPlan[idx].week = v;
                    setLocalData({ ...localData, deliveryPlan: newPlan });
                  }}
                />
              </td>
              <td className="py-2 px-3 align-top border-b quo-border-bottom-primary relative">
                <RemoveButton onClick={() => removeArrayItem("deliveryPlan", idx)} className="-right-6 top-2" />
                <SeamlessInput
                  value={plan.tasks}
                  onChange={(v: string) => {
                    const newPlan = [...localData.deliveryPlan];
                    newPlan[idx].tasks = v;
                    setLocalData({ ...localData, deliveryPlan: newPlan });
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
