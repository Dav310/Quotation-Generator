"use client";
import React from "react";

interface RemoveButtonProps {
  onClick: () => void;
  className?: string;
  title?: string;
}

export const RemoveButton: React.FC<RemoveButtonProps> = ({ onClick, className = "", title = "Remove" }) => {
  return (
    <button
      onClick={onClick}
      className={`print:hidden absolute text-red-500 hover:text-red-700 font-bold ${className}`}
      title={title}
    >
      ×
    </button>
  );
};
