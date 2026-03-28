"use client";

import { useState, useCallback } from "react";
import {
  GraphCanvas,
  GraphToolbar,
  DetailPanel,
  AnomalyPanel,
  GraphLegend,
  GraphStatusBar,
} from "@/features/graph-explorer";
import { graphNodes, graphEdges, anomalies } from "@/features/graph-explorer/data/mock-data";

export default function GraphExplorerPage() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showAnomalies, setShowAnomalies] = useState(false);
  const [zoom, setZoom] = useState(0.85);

  const selectedNode = graphNodes.find((n) => n.id === selectedNodeId) ?? null;

  const handleHighlight = useCallback((nodeIds: string[]) => {
    if (nodeIds.length > 0) setSelectedNodeId(nodeIds[0]);
  }, []);

  return (
    <div className="-m-6 relative" style={{ height: "calc(100vh - var(--nx-topbar-height))" }}>
      {/* Toolbar overlay */}
      <GraphToolbar
        anomalyCount={anomalies.length}
        onToggleAnomalies={() => setShowAnomalies(!showAnomalies)}
        onFit={() => setZoom(0.85)}
        onZoomIn={() => setZoom((z) => Math.min(2, z + 0.15))}
        onZoomOut={() => setZoom((z) => Math.max(0.3, z - 0.15))}
      />

      {/* Graph canvas — full bleed */}
      <GraphCanvas
        nodes={graphNodes}
        edges={graphEdges}
        selectedNodeId={selectedNodeId}
        onSelectNode={setSelectedNodeId}
      />

      {/* Detail panel — right */}
      {selectedNode && (
        <DetailPanel node={selectedNode} onClose={() => setSelectedNodeId(null)} />
      )}

      {/* Anomaly panel — left */}
      {showAnomalies && (
        <AnomalyPanel
          anomalies={anomalies}
          onClose={() => setShowAnomalies(false)}
          onHighlight={handleHighlight}
        />
      )}

      {/* Legend */}
      <GraphLegend />

      {/* Status bar */}
      <GraphStatusBar nodeCount={graphNodes.length} edgeCount={graphEdges.length} zoom={zoom} />
    </div>
  );
}
