"use client"

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Product = { id: string; name: string; sku: string };
type Movement = {
  id: string;
  change_type: "RESTOCK" | "SALE" | "ADJUSTMENT";
  quantity_change: number;
  note: string | null;
  created_at: string;
  product: { name: string; sku: string };
  user: { name: string };
};

const TYPES = ["RESTOCK", "ADJUSTMENT"] as const;

export function StockMovementsView() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterProduct, setFilterProduct] = useState("");
  const [filterType, setFilterType] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [formProductId, setFormProductId] = useState("");
  const [formType, setFormType] = useState<(typeof TYPES)[number]>("RESTOCK");
  const [formQty, setFormQty] = useState("");
  const [formNote, setFormNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function loadMovements() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterProduct) params.set("productId", filterProduct);
      if (filterType) params.set("type", filterType);
      const data = await apiFetch(`/api/stock-movements?${params.toString()}`);
      setMovements(data.movements);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }
  async function loadProducts() {
    const data = await apiFetch("/api/products");
    setProducts(data.products);
  }

  useEffect(() => {
    loadProducts();
  }, []);
useEffect(() => {
    loadMovements();

  }, [filterProduct, filterType]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const qty = Number(formQty);
    const signedQty = formType === "RESTOCK" ? Math.abs(qty) : qty;

    if (!formProductId) return setError("Select a product");
    if (qty === 0) return setError("Quantity change cannot be zero");
     setSubmitting(true);
    try {
      await apiFetch("/api/stock-movements", {
        method: "POST",
        body: JSON.stringify({
          product_id: formProductId,
          change_type: formType,
          quantity_change: signedQty,
          note: formNote || undefined,
        }),
      });
      setShowForm(false);
      setFormProductId("");
      setFormQty("");
      setFormNote("");
      await loadMovements();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }
  const inputClass =
    "w-full px-3.5 py-2.5 bg-white border border-black/10 text-[var(--ink)] font-body text-sm rounded-none focus:outline-none focus:ring-2 focus:ring-[var(--amber)] focus:border-transparent transition-shadow";
  const labelClass = "block font-mono text-[11px] tracking-[0.15em] uppercase text-[var(--slate)] mb-1.5";
return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--slate)]">Audit trail</span>
          <h1 className="font-display text-3xl font-bold text-[var(--ink)] mt-2">Stock Movements</h1>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="bg-[var(--ink)] text-[var(--parchment)] font-body text-sm font-medium px-5 py-2.5 hover:bg-[var(--ink)]/90 transition-colors"
        >
          + Manual adjustment
        </button>
      </div>

      {showForm && (
        <div className="border border-black/10 bg-white p-6 mb-8">
          <h2 className="font-display text-lg font-bold text-[var(--ink)] mb-5">Record adjustment</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Product</label>
              <select value={formProductId} onChange={(e) => setFormProductId(e.target.value)} className={inputClass}>
                <option value="">Select a product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} — {p.sku}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Type</label>
              <select value={formType} onChange={(e) => setFormType(e.target.value as typeof formType)} className={inputClass}>
                <option value="RESTOCK">Restock (+)</option>
                <option value="ADJUSTMENT">Adjustment (+/-)</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>
                Quantity {formType === "ADJUSTMENT" ? "(use negative for loss/damage)" : ""}
              </label>
              <input type="number" value={formQty} onChange={(e) => setFormQty(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Note</label>
              <input value={formNote} onChange={(e) => setFormNote(e.target.value)} className={inputClass} placeholder="e.g. Supplier delivery, damaged in transit" />
            </div>

            {error && <p className="col-span-2 font-mono text-[13px] text-red-600 border-l-2 border-red-600 pl-3">{error}</p>}

            <div className="col-span-2 flex gap-3 mt-2">
              <button type="submit" disabled={submitting} className="bg-[var(--ink)] text-[var(--parchment)] font-body text-sm font-medium px-5 py-2.5 hover:bg-[var(--ink)]/90 transition-colors disabled:opacity-50">
                {submitting ? "Saving..." : "Record adjustment"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="font-body text-sm text-[var(--slate)] px-5 py-2.5 hover:text-[var(--ink)]">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex gap-3 mb-4">
        <select value={filterProduct} onChange={(e) => setFilterProduct(e.target.value)} className={`${inputClass} max-w-xs`}>
          <option value="">All products</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name} — {p.sku}</option>
          ))}
        </select>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className={`${inputClass} max-w-[180px]`}>
          <option value="">All types</option>
          <option value="RESTOCK">Restock</option>
          <option value="SALE">Sale</option>
          <option value="ADJUSTMENT">Adjustment</option>
        </select>
      </div>

      <div className="border border-black/10 bg-white overflow-x-auto">
      <table className="w-full text-left min-w-[640px]">
          <thead>
            <tr className="border-b border-black/10">
              <Th>Product</Th><Th>Type</Th><Th>Change</Th><Th>By</Th><Th>Note</Th><Th>Date</Th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="px-5 py-8 text-center font-mono text-xs text-[var(--slate)]">Loading...</td></tr>}
            {!loading && movements.length === 0 && <tr><td colSpan={6} className="px-5 py-8 text-center font-mono text-xs text-[var(--slate)]">No movements found.</td></tr>}
            {movements.map((m) => (
              <tr key={m.id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.02]">
                <Td className="font-medium">{m.product.name} <span className="text-[var(--slate)] font-mono text-xs">({m.product.sku})</span></Td>
                <Td><TypeBadge type={m.change_type} /></Td>
                <Td className={m.quantity_change < 0 ? "text-red-600" : "text-[var(--stock-green)]"}>
                  {m.quantity_change > 0 ? "+" : ""}{m.quantity_change}
                </Td>
                <Td>{m.user.name}</Td>
                <Td className="text-[var(--slate)]">{m.note ?? "—"}</Td>
                <Td className="font-mono text-xs">{new Date(m.created_at).toLocaleString()}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    RESTOCK: "text-[var(--stock-green)] border-[var(--stock-green)]/40",
    SALE: "text-[var(--slate)] border-[var(--slate)]/40",
    ADJUSTMENT: "text-[var(--amber)] border-[var(--amber)]/40",
  };
  return (
    <span className={`font-mono text-[10px] tracking-widest uppercase border px-1.5 py-0.5 ${colors[type]}`}>
      {type}
    </span>
  );
}
function Th({ children }: { children?: React.ReactNode }) {
  return <th className="px-5 py-3 font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--slate)]">{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-5 py-3.5 font-body text-sm text-[var(--ink)] ${className}`}>{children}</td>;
}