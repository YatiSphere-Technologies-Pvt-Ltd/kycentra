"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Search } from "lucide-react";
import { currentUser } from "@/features/workbench/data/mock-data";

export function TopBar() {
  return (
    <header className="flex h-12 items-center justify-between border-b border-border bg-card px-5 shrink-0">
      {/* Left spacer */}
      <div className="w-8" />

      {/* Center — search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/40" />
          <input
            type="text"
            placeholder="Search entities, cases, regulations..."
            className="h-8 w-full rounded-md border border-border bg-muted/20 pl-8 pr-14 text-[12px] placeholder:text-muted-foreground/35 focus:outline-none focus:ring-1 focus:ring-foreground/20 focus:border-foreground/20 transition-colors"
            aria-label="Global search"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:inline-flex h-4.5 items-center gap-0.5 rounded border border-border bg-muted px-1.5 text-[9px] font-medium text-muted-foreground/50">
            <span className="text-[10px]">⌘</span>K
          </kbd>
        </div>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-1.5 w-8 justify-end">
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8"
          aria-label={`${currentUser.unreadNotifications} unread notifications`}
        >
          <Bell className="h-3.5 w-3.5" />
          {currentUser.unreadNotifications > 0 && (
            <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-foreground text-[8px] font-bold text-background">
              {currentUser.unreadNotifications}
            </span>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" className="relative h-8 w-8 rounded-full p-0" />}
          >
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-[10px] font-semibold bg-foreground text-background">
                SC
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <div className="px-2 py-1.5">
              <p className="text-[12px] font-semibold">{currentUser.name}</p>
              <p className="text-[11px] text-muted-foreground">{currentUser.role}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
