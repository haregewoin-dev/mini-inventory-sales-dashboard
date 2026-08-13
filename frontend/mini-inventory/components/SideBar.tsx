"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/products", label: "Products", icon: BoxIcon },
  { href: "/sales", label: "Sales", icon: TagIcon },
  { href: "/stock-movements", label: "Stock", icon: ArrowsIcon },
  { href: "/activity-logs", label: "Logs", icon: ClipboardIcon },
];

export function Sidebar({
  userName, userRole, isAdmin = false, onNavigate,
}: { userName: string; userRole: string; isAdmin?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const links = isAdmin ? [...LINKS, { href: "/register", label: "Add User", icon: UserPlusIcon }] : LINKS;

  return (
      <aside className="w-60 shrink-0 h-screen bg-[var(--ink)] text-[var(--parchment)] flex flex-col overflow-y-auto">
      <div className="flex items-center justify-between gap-3 px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-[var(--amber)] rotate-45" />
          <span className="font-mono text-xs tracking-[0.25em] uppercase font-semibold text-[var(--amber)]">
            Stockroom
          </span>
        </div>
        <button onClick={onNavigate} className="md:hidden text-white/60 hover:text-white" aria-label="Close menu">
          <svg viewBox="0 0 20 20" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {links.map((link) => {
          const active = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 font-body text-sm transition-colors ${
                active ? "bg-[var(--amber)] text-[var(--ink)] font-medium" : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-5 border-t border-white/10">
        <div className="px-3 mb-3">
          <span className="font-mono text-[11px] text-white/80 block truncate">{userName}</span>
          <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--amber)]">
            {userRole}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 font-mono text-[11px] tracking-wide uppercase text-white/50 hover:text-red-400 transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2.5" y="2.5" width="6" height="6" /><rect x="11.5" y="2.5" width="6" height="6" />
      <rect x="2.5" y="11.5" width="6" height="6" /><rect x="11.5" y="11.5" width="6" height="6" />
    </svg>
  );
}
function BoxIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2.5 6.5 10 3l7.5 3.5L10 10 2.5 6.5Z" />
      <path d="M2.5 6.5V14L10 17.5V10" /><path d="M17.5 6.5V14L10 17.5" />
    </svg>
  );
}
function TagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M11 2.5H3.5v7.5L11.5 17.5l7-7L11 2.5Z" /><circle cx="7" cy="6.5" r="1.2" />
    </svg>
  );
}
function ArrowsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M4 7h9M13 7l-3-3M13 7l-3 3" /><path d="M16 13H7M7 13l3-3M7 13l3 3" />
    </svg>
  );
}
function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3.5" width="14" height="14" rx="1" /><path d="M6.5 8h7M6.5 11h7M6.5 14h4" strokeLinecap="round" />
    </svg>
  );
}
function UserPlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="7" r="3" /><path d="M2.5 17c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
      <path d="M15.5 7v4M13.5 9h4" strokeLinecap="round" />
    </svg>
  );
}