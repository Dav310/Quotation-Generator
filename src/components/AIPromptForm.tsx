"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Paper,
  Collapse,
} from "@mui/material";
import {
  AutoAwesome as AutoAwesomeIcon,
  Send as SendIcon,
  UploadFile as UploadFileIcon,
} from "@mui/icons-material";
import { useQuotation } from "@/context/QuotationContext";

interface AIPromptFormProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

export default function AIPromptForm({
  onGenerate,
  isLoading,
}: AIPromptFormProps) {
  const { setLocalData, setMeta } = useQuotation();
  const [prompt, setPrompt] = useState(
    "Build a school management system with fees, attendance, and SMS alerts, budget ₹80,000, 6 weeks",
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt);
      setIsOpen(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/v1/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to process the uploaded file.");
      }

      const responseData = await res.json();
      if (setLocalData && responseData.data) {
        setLocalData(responseData.data);
      } else if (setLocalData && !responseData.data) {
        // Fallback if the AI messes up the wrapper
        setLocalData(responseData);
      }
      
      if (setMeta && responseData.meta) {
        setMeta(responseData.meta);
      }
      setIsOpen(false);
    } catch (error: any) {
      console.error(error);
      alert(`Error uploading file: ${error.message}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <Box className="mb-6 ">
      {!isOpen ? (
        <div className="flex justify-end">
          <Button
            variant="contained"
            onClick={() => setIsOpen(true)}
            startIcon={<AutoAwesomeIcon />}
            className="quo-btn-primary px-8 py-3 normal-case "
          >
            Generate Quotation with AI
          </Button>
        </div>
      ) : (
        <Paper
          elevation={0}
          component="form"
          onSubmit={handleSubmit}
          className="quo-form-card p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 quo-gradient-bar"></div>

          <div className="flex items-center justify-between gap-2 mb-4 mt-1">
            <div className="flex items-center gap-2">
              <AutoAwesomeIcon className="quo-icon-purple" fontSize="small" />
              <Typography
                variant="h6"
                className="quo-title-text tracking-tight"
              >
                AI Quotation Brief
              </Typography>
            </div>
            <Button
              size="small"
              onClick={() => setIsOpen(false)}
              className="quo-text-muted normal-case"
            >
              Cancel
            </Button>
          </div>

          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            placeholder="Describe the project, budget, and timeline..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="mb-5"
            autoFocus
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "#f8fafc",
                transition: "all 0.2s",
                "&:hover": { backgroundColor: "#f1f5f9" },
                "&.Mui-focused": {
                  backgroundColor: "#fff",
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
                },
              },
            }}
          />

          <div className="flex justify-between items-center mt-3">
            <div>
              <input
                type="file"
                accept=".pdf,.xls,.xlsx"
                hidden
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <Button
                variant="outlined"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <UploadFileIcon fontSize="small" />}
                className="rounded-xl px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 normal-case font-medium"
              >
                {isUploading ? "Uploading..." : "Import PDF/Excel"}
              </Button>
            </div>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={isLoading || !prompt.trim()}
              endIcon={isLoading ? undefined : <SendIcon fontSize="small" />}
              className="quo-btn-primary px-8 py-2.5 normal-case"
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : "Generate"}
            </Button>
          </div>
        </Paper>
      )}

      {isLoading && !isOpen && (
        <div className="mt-4 flex items-center gap-3 quo-loading-text">
          <CircularProgress size={20} color="inherit" />
          <Typography variant="body2" className="font-medium">
            Generating your quotation...
          </Typography>
        </div>
      )}
    </Box>
  );
}
