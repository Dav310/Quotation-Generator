"use client";
import React from "react";
import { useQuotation } from "@/context/QuotationContext";

export const ClientProviderSection: React.FC = () => {
  const { meta } = useQuotation();

  return (
    <>
      {/* Thick Blue Separator */}
      <div className="h-[4px] w-full quo-primary-bg mb-8"></div>

      {/* Client / Provider Boxes */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="border quo-border-primary rounded-sm overflow-hidden">
          <div className="quo-primary-bg-light quo-primary-text font-bold py-2 px-3 border-b quo-border-bottom-primary uppercase text-xs tracking-wider">
            BILL TO — CLIENT
          </div>
          <div className="p-4 leading-loose bg-[#fcfdfd]">
            <p className="font-bold text-sm mb-1">{meta.clientName}</p>
            <p><strong>Rep 1:</strong> {meta.repName}</p>
            <p><strong>Rep 2:</strong> Director</p>
            <p><strong>GSTIN:</strong> {meta.gstin}</p>
          </div>
        </div>
        <div className="border quo-border-primary rounded-sm overflow-hidden">
          <div className="quo-primary-bg-light quo-primary-text font-bold py-2 px-3 border-b quo-border-bottom-primary uppercase text-xs tracking-wider">
            SERVICE PROVIDER
          </div>
          <div className="p-4 leading-loose bg-[#fcfdfd]">
            <p><strong>Provider 1:</strong> {meta.providers}</p>
            <p><strong>Trade/Brand:</strong> iTechQu</p>
            <p><strong>Type:</strong> Registered MSME Firm</p>
          </div>
        </div>
      </div>
    </>
  );
};
