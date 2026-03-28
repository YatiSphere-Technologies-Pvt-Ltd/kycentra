"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { AIIndicator } from "@/components/shared";
import { Paperclip, AlertTriangle, Send } from "lucide-react";
import type { ChatMessage, CaseDetail } from "../types";

interface CollabPanelProps {
  messages: ChatMessage[];
  collaborators: CaseDetail["collaborators"];
}

export function PanelCollaboration({ messages, collaborators }: CollabPanelProps) {
  const onlineCount = collaborators.filter((c) => c.online).length + 1;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-sm font-semibold">Case Discussion</span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-nx-emerald-500" />
          {onlineCount} online
        </span>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-lg border p-3 ${msg.senderType === "ai" ? "bg-nx-violet-50/50 border-nx-violet-200" : "bg-card border-border"}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  {msg.senderType === "ai" && <AIIndicator size={12} />}
                  <span className="text-[13px] font-semibold">{msg.sender}</span>
                  {msg.role && <span className="text-[11px] text-muted-foreground">· {msg.role}</span>}
                </div>
                <span className="text-[11px] text-muted-foreground tabular-nums">{msg.timestamp}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{msg.message}</p>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Tipping-off warning */}
      <div className="flex items-center gap-2 px-4 py-2 text-[11px] font-medium border-t border-border" style={{ backgroundColor: "var(--nx-amber-50)", color: "var(--nx-amber-700)" }}>
        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
        Active investigation — do not discuss with the subject (tipping-off prohibition).
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-border">
        <input type="text" className="flex-1 h-9 rounded-md border border-border bg-background px-3 text-sm placeholder:text-muted-foreground/50" placeholder="Type a message..." />
        <Button variant="ghost" size="icon" className="shrink-0 h-9 w-9" aria-label="Attach file"><Paperclip className="h-4 w-4" /></Button>
        <Button size="sm" className="h-9 gap-1.5"><Send className="h-3.5 w-3.5" />Send</Button>
      </div>
    </div>
  );
}
