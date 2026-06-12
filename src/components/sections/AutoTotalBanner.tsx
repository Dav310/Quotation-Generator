"use client";
import React from "react";
import { useQuotation } from "@/context/QuotationContext";
import { InputBase } from "@mui/material";

export const AutoTotalBanner: React.FC = () => {
  const { localData, updateLocalData, formatCurrency, numberToWords } =
    useQuotation();

  if (!localData) return null;

  return (
    <div className="quo-primary-bg p-4 sm:p-5 rounded-sm flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-2 mb-8 shadow-inner overflow-hidden">
      <div className="w-full sm:w-auto">
        <div className="text-xs uppercase tracking-wider mb-2 font-semibold opacity-90">
          AUTO TOTAL
        </div>
        <div className="text-3xl sm:text-4xl text-white font-bold mb-1 flex items-center">
          <span className="opacity-90">₹</span>
          <InputBase
            value={formatCurrency(localData.totalCost)}
            onChange={(e) =>
              updateLocalData(
                "totalCost",
                Number(e.target.value.replace(/[^0-9.-]+/g, "")),
              )
            }
            className="ml-2 rounded px-1 flex-1 sm:flex-none sm:w-48"
            sx={{
              "& input": {
                color: "#fff",
                fontSize: { xs: "32px", sm: "40px" },
                fontWeight: "700",
                padding: 0,
              },
            }}
          />
        </div>
        <div className="text-[10px] sm:text-xs opacity-90 break-words">
          {numberToWords(localData.totalCost)}
        </div>
      </div>
      <div className="text-sm font-medium flex items-center bg-black/20 py-1 px-3 rounded whitespace-nowrap self-start sm:self-auto">
        Duration:
        <InputBase
          value={`${localData.deliveryPlan.length} Weeks`}
          className="text-white font-bold ml-2 rounded px-1 w-20 sm:w-24"
          inputProps={{
            style: { padding: 0, color: "white", textAlign: "right" },
          }}
        />
      </div>
    </div>
  );
};
