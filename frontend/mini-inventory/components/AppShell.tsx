"use client";

import { useState } from "react";
import { Sidebar } from "./SideBar";

export function AppShell({
  userName, userRole, isAdmin, children,
}: { userName: string; userRole: string; isAdmin: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[var(--parchment)]">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-30 flex items-center justify-between bg-[var(--ink)] text-[var(--parchment)] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[var(--amber)] rotate-45" />
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--amber)]">Stockroom</span>
        </div>
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="p-1">
          <svg viewBox="0 0 20 20" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M3 5h14M3 10h14M3 15h14" />
          </svg>
        </button>
      </div>

      {/* Overlay behind drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar: static on desktop, slide-in drawer on mobile/tablet */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-50 transition-transform duration-200 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar userName={userName} userRole={userRole} isAdmin={isAdmin} onNavigate={() => setOpen(false)} />
      </div>

      <main className="flex-1 min-w-0 px-4 sm:px-6 md:px-10 py-6 md:py-10 mt-14 md:mt-0">
        {children}
      </main>
    </div>
  );
}