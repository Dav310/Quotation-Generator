"use client";
import React from "react";
import { useQuotation } from "@/context/QuotationContext";

export const FooterSection: React.FC = () => {
  const { meta } = useQuotation();

  return (
    <div className="mt-8 pt-4 border-t-2 quo-border-primary text-center text-xs text-gray-500 flex justify-center items-center gap-2">
      <strong>iTechQu — Information Technology With Quality</strong>
      <span>|</span>
      <span>{meta.quotationNumber}</span>
      <span>|</span>
      <span>Dated: {meta.date}</span>
      <span>|</span>
      <span>Valid for {meta.validity} from Quotation Date</span>
    </div>
  );
};
