"use client";
import React from "react";
import { useQuotation } from "@/context/QuotationContext";

export const HeaderSection: React.FC = () => {
  const { meta } = useQuotation();

  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h1 className="text-3xl font-extrabold quo-primary-text tracking-wider mb-1">
          iTechQu
        </h1>
        <p className="text-gray-500 font-medium">
          Information Technology With Quality
        </p>
      </div>
      <div className="text-right">
        <h2 className="text-2xl font-bold quo-primary-text tracking-widest mb-3">
          QUOTATION
        </h2>
        <table className="text-xs ml-auto">
          <tbody>
            <tr>
              <td className="pr-4 text-gray-600 text-right">Quotation No. :</td>
              <td className="font-bold text-gray-900">{meta.quotationNumber}</td>
            </tr>
            <tr>
              <td className="pr-4 text-gray-600 text-right">Date :</td>
              <td className="font-bold text-gray-900">{meta.date}</td>
            </tr>
            <tr>
              <td className="pr-4 text-gray-600 text-right">Validity :</td>
              <td className="font-bold text-gray-900">{meta.validity}</td>
            </tr>
            <tr>
              <td className="pr-4 text-gray-600 text-right">Currency :</td>
              <td className="font-bold text-gray-900">INR (Indian Rupees)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
