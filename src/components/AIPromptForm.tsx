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
} from "@mui/icons-material";

interface AIPromptFormProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

export default function AIPromptForm({
  onGenerate,
  isLoading,
}: AIPromptFormProps) {
  const [prompt, setPrompt] = useState(
    "Build a school management system with fees, attendance, and SMS alerts, budget ₹80,000, 6 weeks",
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt);
      setIsOpen(false);
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

          <div className="flex justify-end mt-3">
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || !prompt.trim()}
              endIcon={isLoading ? undefined : <SendIcon fontSize="small" />}
              className="quo-btn-primary px-8 py-2.5 normal-case"
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Generate"
              )}
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
