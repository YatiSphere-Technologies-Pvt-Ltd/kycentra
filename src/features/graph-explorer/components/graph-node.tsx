"use client";

import { cn } from "@/lib/utils";
import { riskStyles } from "@/lib/styles";
import type { GraphNode } from "../types";

const flagMap: Record<string, string> = { KY: "🇰🇾", NL: "🇳🇱", SG: "🇸🇬", JE: "🇯🇪", JP: "🇯🇵", GB: "🇬🇧", VG: "🇻🇬", DE: "🇩🇪", AT: "🇦🇹" };

interface GraphNodeProps {
  node: GraphNode;
  selected: boolean;
  dimmed: boolean;
  onSelect: (id: string) => void;
}

export function GraphNodeComponent({ node, selected, dimmed, onSelect }: GraphNodeProps) {
  const risk = riskStyles[node.riskTier];
  const flag = flagMap[node.jurisdiction ?? node.nationality ?? ""] ?? "";

  if (node.type === "sanctioned_entity") {
    return (
      <g
        transform={`translate(${node.x - 95},${node.y - 50})`}
        onClick={() => onSelect(node.id)}
        className="cursor-pointer"
        style={{ opacity: dimmed ? 0.2 : 1, transition: "opacity 200ms" }}
      >
        <rect width={190} height={100} rx={10} fill="var(--nx-rose-100)" stroke="var(--nx-rose-600)" strokeWidth={3} />
        <rect width={190} height={4} rx={2} fill="var(--nx-rose-600)" />
        <text x={16} y={30} fontSize={11} fontWeight={700} fill="var(--nx-rose-800)">🚫 {node.name}</text>
        <text x={16} y={48} fontSize={10} fill="var(--nx-rose-600)">{flag} {node.jurisdictionName}</text>
        <text x={16} y={64} fontSize={9} fill="var(--nx-rose-500)">{node.ofacEntry}</text>
        <text x={16} y={80} fontSize={9} fontWeight={600} fill="var(--nx-rose-700)">{node.status}</text>
        {selected && <rect width={190} height={100} rx={10} fill="none" stroke="var(--nx-indigo-500)" strokeWidth={2} strokeDasharray="4 2" />}
      </g>
    );
  }

  if (node.type === "shell_company") {
    return (
      <g
        transform={`translate(${node.x - 90},${node.y - 45})`}
        onClick={() => onSelect(node.id)}
        className="cursor-pointer"
        style={{ opacity: dimmed ? 0.2 : 1, transition: "opacity 200ms" }}
      >
        <rect width={180} height={90} rx={10} fill="var(--nx-rose-50)" stroke="var(--nx-rose-300)" strokeWidth={2} strokeDasharray="6 3" />
        <text x={14} y={26} fontSize={11} fontWeight={600} fill="var(--nx-rose-800)">⚠ {node.name}</text>
        <text x={14} y={42} fontSize={10} fill="var(--nx-neutral-500)">{flag} {node.jurisdictionName}</text>
        {node.anomalyFlags?.slice(0, 2).map((f, i) => (
          <text key={f} x={14} y={58 + i * 14} fontSize={9} fill="var(--nx-rose-600)">⚡ {f.replace(/_/g, " ")}</text>
        ))}
        {selected && <rect width={180} height={90} rx={10} fill="none" stroke="var(--nx-indigo-500)" strokeWidth={2} />}
      </g>
    );
  }

  if (node.type === "natural_person") {
    const initials = node.name.split(" ").map((w) => w[0]).join("");
    return (
      <g
        transform={`translate(${node.x - 85},${node.y - 42})`}
        onClick={() => onSelect(node.id)}
        className="cursor-pointer"
        style={{ opacity: dimmed ? 0.2 : 1, transition: "opacity 200ms" }}
      >
        <rect width={170} height={84} rx={10} fill={selected ? "var(--nx-indigo-50)" : "white"} stroke={selected ? "var(--nx-indigo-500)" : "var(--nx-neutral-200)"} strokeWidth={selected ? 2 : 1} />
        {/* Avatar */}
        <circle cx={28} cy={26} r={14} fill={risk.bg} />
        <text x={28} y={30} fontSize={10} fontWeight={700} fill={risk.fg} textAnchor="middle">{initials}</text>
        {/* Name */}
        <text x={50} y={22} fontSize={11} fontWeight={600} fill="var(--nx-neutral-900)">{node.name.length > 20 ? node.name.slice(0, 18) + "…" : node.name}</text>
        <text x={50} y={36} fontSize={9} fill="var(--nx-neutral-500)">{flag} {node.nationalityName ?? node.jurisdictionName}</text>
        {/* Badges */}
        {node.isUBO && (
          <g transform="translate(14, 52)">
            <rect width={30} height={16} rx={8} fill="var(--nx-teal-50)" />
            <text x={15} y={12} fontSize={8} fontWeight={700} fill="var(--nx-teal-700)" textAnchor="middle">UBO</text>
          </g>
        )}
        {node.effectiveOwnership && (
          <text x={52} y={64} fontSize={9} fontWeight={600} fill="var(--nx-indigo-600)" className="tabular-nums">{node.effectiveOwnership}%</text>
        )}
        {node.pepStatus && (
          <g transform="translate(100, 52)">
            <rect width={46} height={16} rx={8} fill="var(--nx-rose-50)" />
            <text x={23} y={12} fontSize={8} fontWeight={700} fill="var(--nx-rose-700)" textAnchor="middle">⚠ PEP</text>
          </g>
        )}
      </g>
    );
  }

  if (node.type === "trust") {
    return (
      <g
        transform={`translate(${node.x - 90},${node.y - 45})`}
        onClick={() => onSelect(node.id)}
        className="cursor-pointer"
        style={{ opacity: dimmed ? 0.2 : 1, transition: "opacity 200ms" }}
      >
        <rect width={180} height={90} rx={10} fill={selected ? "var(--nx-indigo-50)" : "var(--nx-neutral-25)"} stroke={risk.fg} strokeWidth={2} strokeDasharray="6 3" />
        <text x={14} y={26} fontSize={11} fontWeight={600} fill="var(--nx-neutral-900)">🏛 {node.name}</text>
        <text x={14} y={42} fontSize={10} fill="var(--nx-neutral-500)">{flag} {node.jurisdictionName}</text>
        <text x={14} y={58} fontSize={9} fill="var(--nx-neutral-400)">{node.businessType}</text>
        {node.pepStatus && <text x={14} y={78} fontSize={9} fontWeight={600} fill="var(--nx-rose-600)">⚠ PEP Associated</text>}
        {selected && <rect width={180} height={90} rx={10} fill="none" stroke="var(--nx-indigo-500)" strokeWidth={2} />}
      </g>
    );
  }

  // Default: legal_entity / fund
  const icon = node.type === "fund" ? "📊" : "🏢";
  return (
    <g
      transform={`translate(${node.x - 95},${node.y - 50})`}
      onClick={() => onSelect(node.id)}
      className="cursor-pointer"
      style={{ opacity: dimmed ? 0.2 : 1, transition: "opacity 200ms" }}
    >
      <rect width={190} height={100} rx={10} fill={selected ? "var(--nx-indigo-50)" : "white"} stroke={selected ? "var(--nx-indigo-500)" : risk.fg} strokeWidth={selected ? 2 : 1.5} />
      {/* Risk bar */}
      <rect width={190} height={4} rx={2} fill={risk.fg} />
      <text x={14} y={28} fontSize={11} fontWeight={600} fill="var(--nx-neutral-900)">{icon} {node.name.length > 18 ? node.name.slice(0, 16) + "…" : node.name}</text>
      <text x={14} y={44} fontSize={10} fill="var(--nx-neutral-500)">{flag} {node.jurisdictionName}</text>
      <text x={14} y={58} fontSize={9} fill="var(--nx-neutral-400)">{node.businessType}</text>
      {/* Stats */}
      {(node.ubos || node.alerts) && (
        <text x={14} y={82} fontSize={9} fill="var(--nx-neutral-400)">
          {node.ubos ? `UBOs: ${node.ubos}` : ""}{node.ubos && node.alerts ? "  ·  " : ""}{node.alerts ? `Alerts: ${node.alerts}` : ""}
        </text>
      )}
      {node.isClient && (
        <g transform="translate(140, 72)">
          <rect width={40} height={16} rx={8} fill="var(--nx-indigo-50)" />
          <text x={20} y={12} fontSize={8} fontWeight={600} fill="var(--nx-indigo-600)" textAnchor="middle">Client</text>
        </g>
      )}
      {node.aum && <text x={14} y={82} fontSize={9} fill="var(--nx-neutral-400)">AUM: {node.aum}</text>}
    </g>
  );
}
