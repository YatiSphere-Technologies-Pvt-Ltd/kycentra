"use client";

import { useState, useCallback } from "react";
import { TxMetricsDashboard, TxAlertQueue, TxAlertDetail } from "@/features/transaction-monitoring";
import { txMetrics, volumeData, txAlerts } from "@/features/transaction-monitoring/data/mock-data";

export default function TransactionMonitoringPage() {
  const [selectedId, setSelectedId] = useState<string | null>(txAlerts[0]?.id ?? null);
  const selectedAlert = txAlerts.find((a) => a.id === selectedId) ?? null;

  const handleSubmitNext = useCallback(() => {
    const idx = txAlerts.findIndex((a) => a.id === selectedId);
    const next = txAlerts[idx + 1];
    if (next) setSelectedId(next.id);
  }, [selectedId]);

  return (
    <div className="-m-6 flex flex-col" style={{ height: "calc(100vh - var(--nx-topbar-height))" }}>
      <div className="px-6 pt-4 pb-2">
        <TxMetricsDashboard metrics={txMetrics} volumeData={volumeData} />
      </div>

      <div className="flex flex-1 min-h-0 mx-6 mb-4 rounded-xl border border-border bg-card shadow-elevation-1 overflow-hidden">
        <div className="w-2/5 min-w-0">
          <TxAlertQueue alerts={txAlerts} selectedId={selectedId} onSelect={setSelectedId} />
        </div>
        <div className="flex-1 min-w-0">
          {selectedAlert ? (
            <TxAlertDetail alert={selectedAlert} onSubmitNext={handleSubmitNext} />
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
              Select an alert to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
