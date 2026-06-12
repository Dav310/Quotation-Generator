"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { QuotationData, QuotationMeta, QuotationModule, PaymentMilestone } from "@/types";

interface QuotationContextType {
  meta: QuotationMeta;
  updateMeta: (field: keyof QuotationMeta, value: string) => void;
  localData: QuotationData | null;
  setLocalData: React.Dispatch<React.SetStateAction<QuotationData | null>>;
  updateModule: (idx: number, field: keyof QuotationModule, value: any) => void;
  updateMilestone: (idx: number, field: keyof PaymentMilestone, value: any) => void;
  updateLocalData: (field: keyof QuotationData, value: any) => void;
  addArrayItem: (field: keyof QuotationData, defaultItem: any) => void;
  removeArrayItem: (field: keyof QuotationData, idx: number) => void;
  formatCurrency: (amount: number) => string;
  numberToWords: (num: number | null | undefined) => string;
}

const QuotationContext = createContext<QuotationContextType | undefined>(undefined);

export const QuotationProvider: React.FC<{ children: React.ReactNode; initialData: QuotationData; initialMeta: QuotationMeta }> = ({ children, initialData, initialMeta }) => {
  const [meta, setMeta] = useState<QuotationMeta>(initialMeta);
  const [localData, setLocalData] = useState<QuotationData | null>(initialData);

  useEffect(() => {
    if (initialData) {
      setLocalData(JSON.parse(JSON.stringify(initialData)));
    }
  }, [initialData]);

  const updateMeta = (field: keyof QuotationMeta, value: string) => {
    setMeta(prev => ({ ...prev, [field]: value }));
  };

  const updateModule = (idx: number, field: keyof QuotationModule, value: any) => {
    if (!localData) return;
    const newModules = [...localData.modules];
    newModules[idx] = { ...newModules[idx], [field]: value };
    const newTotal = newModules.reduce((sum, mod) => sum + (Number(mod.cost) || 0), 0);
    setLocalData({ ...localData, modules: newModules, totalCost: newTotal });
  };

  const updateMilestone = (idx: number, field: keyof PaymentMilestone, value: any) => {
    if (!localData) return;
    const newMilestones = [...localData.paymentMilestones];
    newMilestones[idx] = { ...newMilestones[idx], [field]: value };
    if (field === "percentage") {
      const perc = Number(value) || 0;
      newMilestones[idx].amount = Math.round((localData.totalCost * perc) / 100);
    }
    setLocalData({ ...localData, paymentMilestones: newMilestones });
  };

  const updateLocalData = (field: keyof QuotationData, value: any) => {
    if (!localData) return;
    setLocalData({ ...localData, [field]: value });
  };

  const addArrayItem = (field: keyof QuotationData, defaultItem: any) => {
    if (!localData) return;
    setLocalData({
      ...localData,
      [field]: [...(localData[field] as any[]), defaultItem],
    });
  };

  const removeArrayItem = (field: keyof QuotationData, idx: number) => {
    if (!localData) return;
    const arr = [...(localData[field] as any[])];
    arr.splice(idx, 1);

    let newTotal = localData.totalCost;
    if (field === "modules") {
      newTotal = arr.reduce((sum, mod) => sum + (Number(mod.cost) || 0), 0);
    }
    setLocalData({ ...localData, [field]: arr, totalCost: newTotal });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(amount);
  };

  const numberToWords = (num: number | null | undefined): string => {
    if (num === null || num === undefined || isNaN(num) || num === 0) return "";
    const a = ["", "One ", "Two ", "Three ", "Four ", "Five ", "Six ", "Seven ", "Eight ", "Nine ", "Ten ", "Eleven ", "Twelve ", "Thirteen ", "Fourteen ", "Fifteen ", "Sixteen ", "Seventeen ", "Eighteen ", "Nineteen "];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    if (num.toString().length > 9) return "overflow";
    const n = ("000000000" + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return "";
    let str = "";
    str += Number(n[1]) !== 0 ? (a[Number(n[1])] || b[n[1][0] as any] + " " + a[n[1][1] as any]) + "Crore " : "";
    str += Number(n[2]) !== 0 ? (a[Number(n[2])] || b[n[2][0] as any] + " " + a[n[2][1] as any]) + "Lakh " : "";
    str += Number(n[3]) !== 0 ? (a[Number(n[3])] || b[n[3][0] as any] + " " + a[n[3][1] as any]) + "Thousand " : "";
    str += Number(n[4]) !== 0 ? (a[Number(n[4])] || b[n[4][0] as any] + " " + a[n[4][1] as any]) + "Hundred " : "";
    str += Number(n[5]) !== 0 ? (str != "" ? "and " : "") + (a[Number(n[5])] || b[n[5][0] as any] + " " + a[n[5][1] as any]) : "";
    return str.trim() ? "Rupees " + str.trim() + " Only" : "";
  };

  return (
    <QuotationContext.Provider value={{
      meta, updateMeta, localData, setLocalData, updateModule, updateMilestone, updateLocalData, addArrayItem, removeArrayItem, formatCurrency, numberToWords
    }}>
      {children}
    </QuotationContext.Provider>
  );
};

export const useQuotation = () => {
  const context = useContext(QuotationContext);
  if (context === undefined) {
    throw new Error("useQuotation must be used within a QuotationProvider");
  }
  return context;
};
