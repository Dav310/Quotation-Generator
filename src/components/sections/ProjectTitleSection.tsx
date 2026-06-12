"use client";
import React from "react";
import { useQuotation } from "@/context/QuotationContext";
import { SeamlessInput } from "../ui/SeamlessInput";
import { SeamlessTextArea } from "../ui/SeamlessTextArea";

export const ProjectTitleSection: React.FC = () => {
  const { localData, updateLocalData } = useQuotation();

  if (!localData) return null;

  return (
    <div className="quo-primary-bg-light border quo-border-primary p-4 mb-6 rounded-sm">
      <SeamlessInput
        value={localData.title}
        onChange={(val: string) => updateLocalData("title", val)}
        className="quo-primary-text text-base mb-1"
        bold={true}
      />
      <SeamlessTextArea
        value={localData.description}
        onChange={(val: string) => updateLocalData("description", val)}
        className="text-gray-700"
      />
    </div>
  );
};
