"use client";
import React from "react";
import { useQuotation } from "@/context/QuotationContext";

import { HeaderSection } from "./sections/HeaderSection";
import { ClientProviderSection } from "./sections/ClientProviderSection";
import { ProjectTitleSection } from "./sections/ProjectTitleSection";
import { AutoTotalBanner } from "./sections/AutoTotalBanner";
import { ModulePricingSection } from "./sections/ModulePricingSection";
import { DeliveryPlanSection } from "./sections/DeliveryPlanSection";
import { DeliverablesSection } from "./sections/DeliverablesSection";
import { PaymentTermsSection } from "./sections/PaymentTermsSection";
import { AssumptionsExclusionsSection } from "./sections/AssumptionsExclusionsSection";
import { SignatoriesSection } from "./sections/SignatoriesSection";
import { FooterSection } from "./sections/FooterSection";

export default function QuotationDocument() {
  const { localData } = useQuotation();

  if (!localData) {
    return (
      <div className="p-8 min-h-[800px] flex items-center justify-center bg-gray-50 text-gray-400 rounded-xl border border-dashed border-gray-300">
        <p className="text-lg">Your generated quotation will appear here</p>
      </div>
    );
  }

  return (
    <div className="mx-auto" style={{ maxWidth: "850px" }}>
      {/* Top Action Bar */}
      <div className="flex justify-end gap-3 mb-4 print:hidden">
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 shadow-sm transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Download PDF
        </button>
        <button
          onClick={() => navigator.share && navigator.share({ title: "Quotation", url: window.location.href }).catch(() => {})}
          className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </button>
      </div>

      {/* Main Document Content */}
      <div className="bg-white shadow-lg print:shadow-none print:p-0">
        <div className="p-10 font-sans text-[13px] text-gray-800 relative">
          <HeaderSection />
          <ClientProviderSection />
          <ProjectTitleSection />
          <AutoTotalBanner />
          <ModulePricingSection />
          <DeliveryPlanSection />
          <DeliverablesSection />
          <PaymentTermsSection />
          <AssumptionsExclusionsSection />
          <SignatoriesSection />
          <FooterSection />
        </div>
      </div>
    </div>
  );
}
