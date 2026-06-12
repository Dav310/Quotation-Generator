"use client";
import React, { useState } from "react";
import AIPromptForm from "@/components/AIPromptForm";
import EditableFieldsSidebar from "@/components/EditableFieldsSidebar";
import QuotationDocument from "@/components/QuotationDocument";
import { QuotationData, QuotationMeta } from "@/types";

import { QuotationProvider } from "@/context/QuotationContext";

const defaultBlankQuotation: QuotationData = {
  title: "New Project Proposal",
  description: "Executive summary of the proposed project goes here.",
  modules: [{ name: "Module 1", description: "Module description", cost: 0 }],
  deliveryPlan: [{ week: "Week 1", tasks: "Initial tasks" }],
  deliverables: ["Deliverable 1"],
  paymentMilestones: [{ percentage: 100, amount: 0, description: "Full Payment" }],
  assumptions: ["Assumption 1"],
  exclusions: ["Exclusion 1"],
  totalCost: 0,
  serviceProviders: [{ name: "Er. Hemant Chandra", designation: "Founder" }, { name: "Er. Avinash Chandraker", designation: "Co-Founder" }]
};

export default function Home() {
  const [initialMeta] = useState<QuotationMeta>({
    clientName: "ABC Corp",
    repName: "Rahul Sharma",
    gstin: "27AADCB2230M1Z2",
    quotationNumber: "QT-2026-001",
    date: new Date().toLocaleDateString('en-IN'),
    validity: "15 Days",
    providers: "iTechQu Solutions Pvt Ltd",
  });

  const [quotationData, setQuotationData] = useState<QuotationData>(defaultBlankQuotation);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async (prompt: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to connect to the generation server.");
      }
      
      const data = await res.json();
      setQuotationData(data);
    } catch (error: any) {
      console.error(error);
      alert(`Error generating quotation: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <QuotationProvider initialData={quotationData} initialMeta={initialMeta}>
      <main className="min-h-screen bg-slate-50 text-gray-900 p-4 md:p-8 print:p-0 print:bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 print:block print:max-w-none">
          
          {/* Left Sidebar */}
          <div className="lg:col-span-3 space-y-6 print:hidden">
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start justify-center">
              <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600 tracking-tight mb-1">
                iTechQu
              </h1>
              <p className="text-xs text-blue-600 font-bold uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-md">
                Quotation Generator
              </p>
            </div>
            <EditableFieldsSidebar />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 print:block w-full">
            <div className="print:hidden">
              <AIPromptForm onGenerate={handleGenerate} isLoading={isLoading} />
            </div>
            <QuotationDocument />
          </div>

        </div>
      </main>
    </QuotationProvider>
  );
}
