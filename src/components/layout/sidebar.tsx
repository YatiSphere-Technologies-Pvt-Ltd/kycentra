"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navSections } from "@/config/navigation";
import { useSidebarStore } from "@/stores/sidebar-store";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronsLeft, ChevronsRight, ChevronRight } from "lucide-react";
import type { NavItem } from "@/types";

// ── Shared item styles ──
const itemBase = "group flex items-center gap-2 rounded-md text-[12.5px] transition-colors duration-150";
const itemPy = "py-[5px]";
const itemPx = "px-2.5";

// ── Nav Link ──
function NavLink({ item, isOpen, isActive, indent = false }: { item: NavItem; isOpen: boolean; isActive: boolean; indent?: boolean }) {
  const Icon = item.icon;

  const link = (
    <Link
      href={item.href}
      className={cn(
        itemBase, itemPy, itemPx,
        indent && "pl-8",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          : "text-sidebar-foreground/60 hover:bg-sidebar-accent/40 hover:text-sidebar-accent-foreground font-normal"
      )}
    >
      {Icon && <Icon className={cn("h-3.75 w-3.75 shrink-0", isActive ? "text-sidebar-accent-foreground" : "text-sidebar-foreground/35 group-hover:text-sidebar-foreground/60")} />}
      {isOpen && <span className="truncate flex-1">{item.title}</span>}
      {isOpen && item.badge && (
        <span className="flex h-4 min-w-4 items-center justify-center rounded bg-nx-rose-500/90 px-1 text-[8px] font-bold text-white leading-none">
          {item.badge}
        </span>
      )}
    </Link>
  );

  if (!isOpen) {
    return (
      <Tooltip>
        <TooltipTrigger render={<span />}>{link}</TooltipTrigger>
        <TooltipContent side="right">{item.title}</TooltipContent>
      </Tooltip>
    );
  }

  return link;
}

// ── Collapsible ──
function CollapsibleNavItem({ item, isOpen, pathname }: { item: NavItem; isOpen: boolean; pathname: string }) {
  const isChildActive = item.children?.some((c) => pathname === c.href || pathname.startsWith(c.href)) ?? false;
  const [expanded, setExpanded] = useState(isChildActive);
  const Icon = item.icon;

  if (!isOpen) {
    return (
      <Tooltip>
        <TooltipTrigger render={<span />}>
          <Link href={item.href} className={cn(itemBase, itemPy, itemPx, isChildActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground/60 hover:bg-sidebar-accent/40 hover:text-sidebar-accent-foreground")}>
            {Icon && <Icon className={cn("h-3.75 w-3.75 shrink-0", isChildActive ? "text-sidebar-accent-foreground" : "text-sidebar-foreground/35")} />}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{item.title}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className={cn(
          itemBase, itemPy, itemPx, "w-full text-left",
          isChildActive ? "text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground/60 hover:bg-sidebar-accent/40 hover:text-sidebar-accent-foreground"
        )}
      >
        {Icon && <Icon className={cn("h-3.75 w-3.75 shrink-0", isChildActive ? "text-sidebar-accent-foreground" : "text-sidebar-foreground/35 group-hover:text-sidebar-foreground/60")} />}
        <span className="truncate flex-1">{item.title}</span>
        <ChevronRight className={cn("h-3 w-3 shrink-0 text-sidebar-foreground/20 transition-transform duration-150", expanded && "rotate-90")} />
      </button>

      {expanded && (
        <div className="mt-0.5 mb-0.5">
          {item.children?.map((child) => (
            <NavLink key={child.href} item={child} isOpen={isOpen} isActive={pathname === child.href} indent />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Sidebar ──
export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebarStore();

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-200 shrink-0",
        isOpen ? "w-52" : "w-14"
      )}
    >
      {/* Brand */}
      <div className="flex items-center gap-2 px-3 h-12 shrink-0 border-b border-sidebar-border/40">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] bg-white">
          <span className="text-[8px] font-black text-[#0a0a0a] leading-none tracking-tighter">Ag</span>
        </div>
        {isOpen && (
          <span className="font-semibold text-[13px] tracking-tight text-sidebar-primary">Agentic</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto shrink-0 h-5 w-5 text-sidebar-foreground/20 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground/50"
          onClick={toggle}
        >
          {isOpen ? <ChevronsLeft className="h-3 w-3" /> : <ChevronsRight className="h-3 w-3" />}
        </Button>
      </div>

      {/* Nav — hidden scrollbar */}
      <nav
        className="flex-1 overflow-y-auto px-1.5 py-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`nav::-webkit-scrollbar { display: none; }`}</style>

        {navSections.map((section, sIdx) => (
          <div key={section.label || sIdx}>
            {/* Section separator */}
            {sIdx > 0 && (
              <div className={cn("mt-3 mb-1", isOpen ? "px-2.5" : "px-1.5")}>
                {isOpen ? (
                  <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-sidebar-foreground/15 select-none">
                    {section.label}
                  </p>
                ) : (
                  <div className="border-t border-sidebar-border/30" />
                )}
              </div>
            )}

            <div>
              {section.items.map((item) => {
                if (item.children && item.children.length > 0) {
                  return <CollapsibleNavItem key={item.href} item={item} isOpen={isOpen} pathname={pathname} />;
                }
                return (
                  <NavLink
                    key={item.href}
                    item={item}
                    isOpen={isOpen}
                    isActive={pathname === item.href || (item.href !== "/dashboard" && item.href !== "/approvals" && pathname.startsWith(item.href))}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
