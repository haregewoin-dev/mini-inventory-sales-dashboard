"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/products", label: "Products" },
  { href: "/sales", label: "Sales" },
  { href: "/stock-movements", label: "Stock" },
  { href: "/activity-logs", label: "Logs" },
];

export function QuickNav({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const links = isAdmin ? [...LINKS, { href: "/register", label: "Add User" }] : LINKS;

  return (
    <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-8 pb-4 border-b border-black/10">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`font-mono text-[11px] tracking-[0.1em] uppercase transition-colors ${
            pathname === link.href
              ? "text-[var(--ink)] font-semibold"
              : "text-[var(--slate)] hover:text-[var(--ink)]"
          }`}
        >
          {link.label}
        </Link>
      ))}
      <button
        onClick={handleLogout}
        className="font-mono text-[11px] tracking-[0.1em] uppercase text-[var(--slate)] hover:text-red-600 transition-colors ml-auto"
      >
        Sign out
      </button>
    </nav>
  );
}