"use client";

import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-400 px-5 py-5 lg:px-6 lg:py-5">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
