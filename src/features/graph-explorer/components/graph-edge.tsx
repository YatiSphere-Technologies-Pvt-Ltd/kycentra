"use client";

import type { GraphEdge, GraphNode } from "../types";

interface GraphEdgeProps {
  edge: GraphEdge;
  sourceNode: GraphNode;
  targetNode: GraphNode;
  dimmed: boolean;
}

const edgeStyles: Record<string, { stroke: string; dasharray: string; width: number }> = {
  ownership:       { stroke: "var(--nx-neutral-400)", dasharray: "", width: 1.5 },
  beneficial:      { stroke: "var(--nx-teal-500)", dasharray: "6 4", width: 1.5 },
  directorship:    { stroke: "var(--nx-violet-400)", dasharray: "2 3", width: 1.5 },
  shared_address:  { stroke: "var(--nx-teal-400)", dasharray: "8 4 2 4", width: 1 },
  sanctions_match: { stroke: "var(--nx-rose-500)", dasharray: "4 2", width: 2.5 },
  transaction:     { stroke: "var(--nx-amber-500)", dasharray: "", width: 2 },
};

export function GraphEdgeComponent({ edge, sourceNode, targetNode, dimmed }: GraphEdgeProps) {
  const style = edgeStyles[edge.type] ?? edgeStyles.ownership;
  const sx = sourceNode.x;
  const sy = sourceNode.y + 50;
  const tx = targetNode.x;
  const ty = targetNode.y - 50;

  // Curved path for non-vertical edges
  const midY = (sy + ty) / 2;
  const path = `M ${sx} ${sy} C ${sx} ${midY}, ${tx} ${midY}, ${tx} ${ty}`;

  // Label position
  const lx = (sx + tx) / 2;
  const ly = midY;

  return (
    <g style={{ opacity: dimmed ? 0.1 : 1, transition: "opacity 200ms" }}>
      {/* Edge line */}
      <path
        d={path}
        fill="none"
        stroke={style.stroke}
        strokeWidth={style.width}
        strokeDasharray={style.dasharray}
        markerEnd="url(#arrowhead)"
      />
      {/* Label */}
      <g transform={`translate(${lx},${ly})`}>
        <rect x={-20} y={-9} width={40} height={18} rx={9} fill="white" stroke="var(--nx-neutral-200)" strokeWidth={0.5} />
        <text x={0} y={4} fontSize={9} fontWeight={600} fill="var(--nx-indigo-600)" textAnchor="middle" className="tabular-nums">
          {edge.label}
        </text>
      </g>
    </g>
  );
}
