"use client";
import React from "react";
import { TextField, Typography, Paper } from "@mui/material";
import { QuotationMeta } from "@/types";
import EditIcon from '@mui/icons-material/Edit';
import { useQuotation } from "@/context/QuotationContext";

export default function EditableFieldsSidebar() {
  const { meta, updateMeta } = useQuotation();

  const fields: { key: keyof QuotationMeta; label: string }[] = [
    { key: "clientName", label: "Client Name" },
    { key: "repName", label: "Sales Representative" },
    { key: "gstin", label: "GSTIN" },
    { key: "quotationNumber", label: "Quotation No." },
    { key: "date", label: "Date" },
    { key: "validity", label: "Validity" },
    { key: "providers", label: "Providers" },
  ];

  return (
    <Paper elevation={0} className="quo-sidebar-card p-6 flex flex-col gap-5 print:hidden">
      <div className="flex items-center gap-2 mb-6">
        <div className="quo-icon-circle w-8 h-8 flex items-center justify-center">
          <EditIcon fontSize="small" />
        </div>
        <Typography variant="h6" className="quo-title-text">
          Document Settings
        </Typography>
      </div>
      <div className="flex flex-col gap-5">
        {fields.map((f) => (
          <TextField
            key={f.key}
            label={f.label}
            fullWidth
            size="small"
            variant="outlined"
            value={meta[f.key]}
            onChange={(e) => updateMeta(f.key, e.target.value)}
            sx={{ 
              "& .MuiOutlinedInput-root": { 
                backgroundColor: '#fafafa', 
                borderRadius: '10px',
                transition: 'all 0.2s ease',
                "&:hover": { backgroundColor: '#f0f4f8' },
                "&.Mui-focused": { backgroundColor: '#fff', boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.1)' }
              } 
            }}
          />
        ))}
      </div>
    </Paper>
  );
}
