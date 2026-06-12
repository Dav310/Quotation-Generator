"use client";
import React from "react";
import { InputBase, InputBaseProps } from "@mui/material";

interface SeamlessTextAreaProps extends Omit<InputBaseProps, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  bold?: boolean;
}

export const SeamlessTextArea: React.FC<SeamlessTextAreaProps> = ({
  value,
  onChange,
  className = "",
  bold = false,
  ...rest
}) => {
  return (
    <InputBase
      value={value}
      onChange={(e) => onChange(e.target.value)}
      multiline
      fullWidth
      inputProps={{
        style: {
          fontWeight: bold ? "bold" : "normal",
          padding: "2px 4px",
          lineHeight: "1.5",
        },
      }}
      className={`quo-seamless-input ${className}`}
      {...rest}
    />
  );
};
