import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/AppShell";
import { StatCard } from "./StatsCard";
import Link from "next/link";

const LOW_STOCK_THRESHOLD = 5; // matches the amber highlight used in ProductsView

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: { session } } = await supabase.auth.getSession();
  const authHeader = { Authorization: `Bearer ${session?.access_token}` };
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [meRes, productsRes, salesRes] = await Promise.all([
    fetch(`${base}/api/me`, { headers: authHeader, cache: "no-store" }),
    fetch(`${base}/api/products`, { headers: authHeader, cache: "no-store" }),
    fetch(`${base}/api/sales`, { headers: authHeader, cache: "no-store" }),
  ]);

  if (!meRes.ok) redirect("/login");

  const { user: dbUser } = await meRes.json();
  const isAdmin = dbUser.role === "ADMIN";

  const { products } = productsRes.ok ? await productsRes.json() : { products: [] };
  const { sales } = salesRes.ok ? await salesRes.json() : { sales: [] };

  const totalProducts = products.length;
  const totalSales = sales.length;
  const lowStockCount = products.filter((p: { quantity: number }) => p.quantity <= LOW_STOCK_THRESHOLD).length;

  return (
    <AppShell userName={dbUser.name} userRole={dbUser.role} isAdmin={isAdmin}>
      <div className="mb-8 md:mb-10">
        <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--slate)]">
          Overview
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--ink)] mt-2">
          Welcome back, {dbUser.name?.split(" ")[0] ?? "there"}.
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 md:mb-12">
        <StatCard label="Total Products" value={String(totalProducts)} hint="In inventory" />
        <StatCard label="Total Sales" value={String(totalSales)} hint="Transactions recorded" />
        <StatCard
          label="Low Stock Alerts"
          value={String(lowStockCount)}
          hint={lowStockCount > 0 ? `≤ ${LOW_STOCK_THRESHOLD} units remaining` : "All stock healthy"}
          accent={lowStockCount > 0 ? "amber" : undefined}
        />
      </div>

      <div>
        <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--slate)] mb-3 block">
          Quick actions
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <QuickLink href="/products" title="Manage products" desc="View, add, and edit inventory items." />
          <QuickLink href="/sales" title="Record a sale" desc="Log a transaction and update stock." />
          <QuickLink href="/stock-movements" title="Stock movements" desc="Review inbound/outbound history." />
          {isAdmin && (
            <QuickLink href="/register" title="Add a team member" desc="Create a new STAFF or ADMIN account." adminOnly />
          )}
        </div>
      </div>
    </AppShell>
  );
}

function QuickLink({
  href, title, desc, adminOnly = false,
}: { href: string; title: string; desc: string; adminOnly?: boolean }) {
  return (
    <Link href={href} className="block border border-black/10 bg-white p-5 hover:border-[var(--amber)] transition-colors">
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-body text-sm font-semibold text-[var(--ink)]">{title}</span>
        {adminOnly && (
          <span className="font-mono text-[9px] tracking-widest uppercase text-[var(--amber)] border border-[var(--amber)]/40 px-1.5 py-0.5">
            Admin
          </span>
        )}
      </div>
      <p className="font-body text-[13px] text-[var(--slate)]">{desc}</p>
    </Link>
  );
}