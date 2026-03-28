"use client";

import { useRef, useState, useCallback } from "react";
import { GraphNodeComponent } from "./graph-node";
import { GraphEdgeComponent } from "./graph-edge";
import type { GraphNode, GraphEdge } from "../types";

interface GraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedNodeId: string | null;
  onSelectNode: (id: string | null) => void;
}

export function GraphCanvas({ nodes, edges, selectedNodeId, onSelectNode }: GraphCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0.85);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  // Connected nodes for highlighting
  const connectedIds = new Set<string>();
  if (selectedNodeId) {
    connectedIds.add(selectedNodeId);
    edges.forEach((e) => {
      if (e.source === selectedNodeId || e.target === selectedNodeId) {
        connectedIds.add(e.source);
        connectedIds.add(e.target);
      }
    });
  }

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.max(0.3, Math.min(2, z - e.deltaY * 0.001)));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as SVGElement).tagName === "svg" || (e.target as SVGElement).tagName === "rect") {
      setDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  }, [dragging, dragStart]);

  const handleMouseUp = useCallback(() => setDragging(false), []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as SVGElement).tagName === "svg") {
      onSelectNode(null);
    }
  }, [onSelectNode]);

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      style={{ cursor: dragging ? "grabbing" : "grab" }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleCanvasClick}
    >
      {/* Arrow marker */}
      <defs>
        <marker id="arrowhead" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={8} markerHeight={8} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--nx-neutral-400)" />
        </marker>
      </defs>

      <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
        {/* Edges first (behind nodes) */}
        {edges.map((edge) => {
          const source = nodeMap.get(edge.source);
          const target = nodeMap.get(edge.target);
          if (!source || !target) return null;
          const dimmed = selectedNodeId !== null && !connectedIds.has(edge.source) && !connectedIds.has(edge.target);
          return <GraphEdgeComponent key={edge.id} edge={edge} sourceNode={source} targetNode={target} dimmed={dimmed} />;
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const dimmed = selectedNodeId !== null && !connectedIds.has(node.id);
          return (
            <GraphNodeComponent
              key={node.id}
              node={node}
              selected={selectedNodeId === node.id}
              dimmed={dimmed}
              onSelect={onSelectNode}
            />
          );
        })}
      </g>
    </svg>
  );
}
