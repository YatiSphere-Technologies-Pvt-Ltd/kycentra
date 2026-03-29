"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navSections } from "@/config/navigation";
import { useSidebarStore } from "@/stores/sidebar-store";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronsLeft, ChevronsRight, LogOut } from "lucide-react";
import type { NavItem } from "@/types";

/* ─── Nav Link ─── */
function NavLink({ item, isOpen, isActive }: { item: NavItem; isOpen: boolean; isActive: boolean }) {
  const Icon = item.icon;

  const link = (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-2.5 rounded-md px-2.5 text-[12px] transition-all duration-150",
        isOpen ? "py-1.5" : "py-1.5 justify-center",
        isActive
          ? "bg-white/8 text-white font-medium"
          : "text-white/40 hover:bg-white/4 hover:text-white/70"
      )}
    >
      {Icon && (
        <Icon
          className={cn(
            "shrink-0 transition-colors duration-150",
            isOpen ? "h-3.75 w-3.75" : "h-4 w-4",
            isActive ? "text-white" : "text-white/30 group-hover:text-white/50"
          )}
        />
      )}
      {isOpen && (
        <>
          <span className="truncate flex-1">{item.title}</span>
          {item.badge && (
            <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-[3px] bg-white/15 px-1 text-[9px] font-bold text-white/80 leading-none tabular-nums">
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  );

  if (!isOpen) {
    return (
      <Tooltip>
        <TooltipTrigger render={<span />}>{link}</TooltipTrigger>
        <TooltipContent side="right" className="text-[11px]">
          {item.title}
          {item.badge && <span className="ml-1.5 text-[9px] opacity-60">({item.badge})</span>}
        </TooltipContent>
      </Tooltip>
    );
  }

  return link;
}

/* ─── Sidebar ─── */
export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebarStore();

  const isItemActive = (item: NavItem) => {
    if (item.href === "/dashboard") return pathname === "/dashboard";
    if (item.href === "/approvals") return pathname === "/approvals";
    return pathname === item.href || pathname.startsWith(item.href);
  };

  return (
    <aside
      className={cn(
        "flex flex-col bg-[#0c0c0c] transition-all duration-200 shrink-0 border-r border-white/4",
        isOpen ? "w-50" : "w-13"
      )}
    >
      {/* ─── Brand ─── */}
      <div className={cn("flex items-center shrink-0 h-12 border-b border-white/6", isOpen ? "px-3 gap-2.5" : "px-0 justify-center")}>
        <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
          <div className="h-5.5 w-5.5 rounded-[4px] bg-white flex items-center justify-center shrink-0">
            <span className="text-[7px] font-black text-[#0c0c0c] leading-none tracking-tighter">Ag</span>
          </div>
          {isOpen && (
            <span className="text-[13px] font-semibold text-white/90 tracking-tight">Agentic</span>
          )}
        </Link>
        {isOpen && (
          <button
            onClick={toggle}
            className="ml-auto h-5 w-5 flex items-center justify-center rounded text-white/15 hover:text-white/40 hover:bg-white/4 transition-colors"
          >
            <ChevronsLeft className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* ─── Navigation ─── */}
      <nav
        className={cn("flex-1 overflow-y-auto py-2", isOpen ? "px-2" : "px-1.5")}
        style={{ scrollbarWidth: "none" }}
      >
        {navSections.map((section, sIdx) => (
          <div key={section.label || sIdx}>
            {sIdx > 0 && (
              <div className={cn("my-2.5", isOpen ? "mx-1" : "mx-1")}>
                {isOpen ? (
                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white/12 select-none px-1.5 mb-1">
                    {section.label}
                  </p>
                ) : (
                  <div className="border-t border-white/6" />
                )}
              </div>
            )}

            <div className="space-y-px">
              {section.items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  isOpen={isOpen}
                  isActive={isItemActive(item)}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* ─── Collapsed expand button ─── */}
      {!isOpen && (
        <div className="px-1.5 py-2 border-t border-white/6">
          <button
            onClick={toggle}
            className="w-full h-7 flex items-center justify-center rounded text-white/15 hover:text-white/40 hover:bg-white/4 transition-colors"
          >
            <ChevronsRight className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* ─── User footer ─── */}
      {isOpen && (
        <div className="px-2 py-2.5 border-t border-white/6">
          <div className="flex items-center gap-2 px-1.5 py-1.5 rounded-md hover:bg-white/4 transition-colors cursor-pointer">
            <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <span className="text-[8px] font-bold text-white/60">SC</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-medium text-white/60 truncate">Sarah Chen</div>
              <div className="text-[9px] text-white/25 truncate">Sr. Compliance Analyst</div>
            </div>
            <LogOut className="h-3 w-3 text-white/15 shrink-0" />
          </div>
        </div>
      )}
    </aside>
  );
}
