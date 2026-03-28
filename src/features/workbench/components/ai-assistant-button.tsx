"use client";

import { BrainCircuit } from "lucide-react";

// ============================================================
// AIAssistantButton — floating trigger for the AI chat panel
// Animation keyframes defined in globals.css for reusability.
// ============================================================

interface AIAssistantButtonProps {
  onClick?: () => void;
}

export function AIAssistantButton({ onClick }: AIAssistantButtonProps) {
  return (
    <button
      type="button"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-elevation-3 transition-all hover:scale-105 hover:shadow-elevation-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ai-btn-gradient"
      onClick={onClick}
      aria-label="Open AI Assistant"
    >
      <BrainCircuit className="h-6 w-6 text-white" aria-hidden="true" />
      <span className="absolute inset-0 rounded-full ai-pulse-ring" aria-hidden="true" />
    </button>
  );
}
