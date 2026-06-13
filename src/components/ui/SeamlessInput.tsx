"use client";
import React from "react";
import { InputBase, InputBaseProps } from "@mui/material";

interface SeamlessInputProps extends Omit<InputBaseProps, 'onChange'> {
  value: string | number;
  onChange: (value: any) => void;
  bold?: boolean;
  align?: "left" | "center" | "right";
  isNumber?: boolean;
}

export const SeamlessInput: React.FC<SeamlessInputProps> = ({
  value,
  onChange,
  className = "",
  bold = false,
  align = "left",
  isNumber = false,
  ...rest
}) => {
  return (
    <InputBase
      value={value}
      onChange={(e) =>
        onChange(
          isNumber
            ? Number(e.target.value.replace(/[^0-9.-]+/g, ""))
            : e.target.value
        )
      }
      fullWidth
      inputProps={{
        style: {
          textAlign: align,
          fontWeight: bold ? "bold" : "normal",
          padding: "2px 4px",
          fontSize:"14px"
        },
      }}
      className={`quo-seamless-input ${className}`}
      {...rest}
    />
  );
};
