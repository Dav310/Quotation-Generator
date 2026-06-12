"use client";
import React from "react";

interface SectionHeaderProps {
  title: string;
  onAdd?: () => void;
  addLabel?: string;
  children?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, onAdd, addLabel, children }) => {
  return (
    <div className="quo-primary-bg font-bold py-2 px-3 uppercase text-xs tracking-wider rounded-t-sm flex justify-between items-center print:border-b-0">
      <span>{title}</span>
      {children ? (
        children
      ) : onAdd && addLabel ? (
        <button
          onClick={onAdd}
          className="print:hidden bg-white/20 hover:bg-white/40 text-white px-2 py-0.5 rounded text-[10px] transition-all"
        >
          {addLabel}
        </button>
      ) : null}
    </div>
  );
};
