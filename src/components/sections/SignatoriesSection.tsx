"use client";
import React from "react";
import { useQuotation } from "@/context/QuotationContext";
import { SectionHeader } from "../ui/SectionHeader";
import { SeamlessInput } from "../ui/SeamlessInput";
import { RemoveButton } from "../ui/ActionButtons";

export const SignatoriesSection: React.FC = () => {
  const {
    meta,
    updateMeta,
    localData,
    setLocalData,
    addArrayItem,
    removeArrayItem,
  } = useQuotation();

  if (!localData) return null;

  return (
    <div className="mb-8">
      <SectionHeader
        title="9) SIGNATORIES"
        addLabel="+ Add Provider"
        onAdd={() =>
          addArrayItem("serviceProviders", {
            name: "New Provider",
            designation: "Title",
          })
        }
      />

      <div className="border-x border-b quo-border-primary p-6 bg-[#fcfdfd] space-y-6">
        {/* Client Sign Box (Full Width) */}
        <div className="border border-gray-200 bg-gray-50/50 rounded-sm p-5 shadow-sm">
          <div className="quo-primary-text font-bold text-xs uppercase mb-4 tracking-wider flex items-center gap-2">
            <span>CLIENT — </span>
            <span className="w-1/2">
              <SeamlessInput
                value={meta.companyName}
                onChange={() => {}}
                className="font-bold uppercase quo-primary-text"
              />
            </span>
          </div>
          <div className="space-y-4 max-w-2xl">
            <div className="flex border-b border-gray-200 border-dashed pb-1">
              <span className="w-32 text-gray-500 text-sm">Name</span>
              <span className="flex-1 font-medium text-sm">
                {meta.companyName}
              </span>
            </div>
            <div className="flex border-b border-gray-200 border-dashed pb-1">
              <span className="w-32 text-gray-500 text-sm">Designation</span>
              <span className="flex-1 font-medium text-sm">
                <SeamlessInput
                  value={meta.clientDesignation}
                  onChange={(v: string) => updateMeta("clientDesignation", v)}
                  className="font-medium"
                />
              </span>
            </div>
            <div className="flex border-b border-gray-200 border-dashed pb-1 mt-6">
              <span className="w-32 text-gray-500 text-sm">Signature</span>
              <span className="flex-1 border-b border-gray-300 w-48 inline-block max-w-[200px]"></span>
            </div>
            <div className="flex border-b border-gray-200 border-dashed pb-1">
              <span className="w-32 text-gray-500 text-sm">Date</span>
              <span className="flex-1 border-b border-gray-300 w-48 inline-block max-w-[200px]"></span>
            </div>
          </div>
        </div>

        {/* Dynamic Service Providers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {localData.serviceProviders?.map((provider, idx) => (
            <div
              key={`prov-${idx}`}
              className="border border-gray-200 bg-white rounded-sm p-5 shadow-sm relative group/row"
            >
              <RemoveButton
                onClick={() => removeArrayItem("serviceProviders", idx)}
                className="right-4 top-4"
              />
              <div className="quo-primary-text font-bold text-xs uppercase mb-4 tracking-wider flex items-center gap-2">
                <span>SERVICE PROVIDER {idx + 1} —</span>
                
              </div>
              <div className="space-y-4">
                <div className="flex border-b border-gray-200 border-dashed pb-1">
                  <span className="w-24 text-gray-500 text-sm pt-1">Name</span>
                  <span className="flex-1 font-medium text-sm">
                    <SeamlessInput
                      value={provider.name}
                      onChange={(v: string) => {
                        const newProv = [...localData.serviceProviders];
                        newProv[idx].name = v;
                        setLocalData({
                          ...localData,
                          serviceProviders: newProv,
                        });
                      }}
                    />
                  </span>
                </div>
                <div className="flex border-b border-gray-200 border-dashed pb-1">
                  <span className="w-24 text-gray-500 text-sm pt-1">
                    Designation
                  </span>
                  <span className="flex-1 font-medium text-sm">
                    <SeamlessInput
                      value={provider.designation}
                      onChange={(v: string) => {
                        const newProv = [...localData.serviceProviders];
                        newProv[idx].designation = v;
                        setLocalData({
                          ...localData,
                          serviceProviders: newProv,
                        });
                      }}
                    />
                  </span>
                </div>
                <div className="flex border-b border-gray-200 border-dashed pb-1 mt-6">
                  <span className="w-24 text-gray-500 text-sm">Signature</span>
                  <span className="flex-1 border-b border-gray-300 w-32 inline-block max-w-[150px]"></span>
                </div>
                <div className="flex border-b border-gray-200 border-dashed pb-1">
                  <span className="w-24 text-gray-500 text-sm">Date</span>
                  <span className="flex-1 border-b border-gray-300 w-32 inline-block max-w-[150px]"></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
