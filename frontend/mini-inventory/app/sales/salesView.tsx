"use client"

import { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"

type Product = { id: string; name: string; sku: string; quantity: number; price: string };
type Sale = {
  id: string;
  quantity: number;
  sale_price: string;
  total_amount: string;
  sale_date: string;
  product: { name: string; sku: string };
  user: { name: string };
};


export function SalesView(){
    const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

   async function loadAll() {
    setLoading(true);
    try {
      const [productsData, salesData] = await Promise.all([
        apiFetch("/api/products"),
        apiFetch("/api/sales"),
      ]);
      setProducts(productsData.products);
      setSales(salesData.sales);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }
   useEffect(() => {
    loadAll();
  }, []);
  
  const selectedProduct = products.find((p) => p.id === productId);
  const qtyNum = Number(quantity);
  const exceedsStock = selectedProduct ? qtyNum > selectedProduct.quantity : false;
  const estimatedTotal = selectedProduct ? (Number(selectedProduct.price) * qtyNum).toFixed(2) : "0.00";


   async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!productId) {
      setError("Select a product");
      return;
    }
    if (qtyNum <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }
    if (exceedsStock) {
      setError(`Only ${selectedProduct?.quantity} units available`);
      return;
    }

    setSubmitting(true);
    try {
      await apiFetch("/api/sales", {
        method: "POST",
        body: JSON.stringify({ product_id: productId, quantity: qtyNum }),
      });
      setSuccess(true);
      setProductId("");
      setQuantity("1");
      await loadAll();
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
      <div className="mb-8">
        <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--slate)]">
          Transactions
        </span>
        <h1 className="font-display text-3xl font-bold text-[var(--ink)] mt-2">Sales</h1>
      </div>

      {/* Record sale form */}
      <div className="border border-black/10 bg-white p-6 mb-10">
        <h2 className="font-display text-lg font-bold text-[var(--ink)] mb-5">Record a sale</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className={labelClass}>Product</label>
            <select value={productId} onChange={(e) => setProductId(e.target.value)} className={inputClass}>
              <option value="">Select a product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id} disabled={p.quantity === 0}>
                  {p.name} — {p.sku} ({p.quantity} in stock)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Quantity</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className={inputClass}
            />
            {selectedProduct && (
              <span
                className={`font-mono text-[11px] mt-1 block ${
                  exceedsStock ? "text-red-600" : "text-[var(--slate)]"
                }`}
              >
                {exceedsStock
                  ? `Exceeds available stock (${selectedProduct.quantity})`
                  : `${selectedProduct.quantity} available · Est. total: $${estimatedTotal}`}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting || exceedsStock || !productId}
            className="bg-[var(--ink)] text-[var(--parchment)] font-body text-sm font-medium px-5 py-2.5 hover:bg-[var(--ink)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-[42px]"
          >
            {submitting ? "Recording..." : "Record sale"}
          </button>
        </form>

        {error && (
          <p className="mt-4 font-mono text-[13px] text-red-600 border-l-2 border-red-600 pl-3">{error}</p>
        )}
        {success && (
          <p className="mt-4 font-mono text-[13px] text-[var(--stock-green)] border-l-2 border-[var(--stock-green)] pl-3">
            Sale recorded.
          </p>
        )}
      </div>

      {/* Sales history */}
      <div>
        <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--slate)] mb-3 block">
          History
        </span>
        <div className="border border-black/10 bg-white overflow-x-auto">
  <table className="w-full text-left min-w-[640px]">
            <thead>
              <tr className="border-b border-black/10">
                <Th>Product</Th>
                <Th>Qty</Th>
                <Th>Total</Th>
                <Th>Sold by</Th>
                <Th>Date</Th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={5} className="px-5 py-8 text-center font-mono text-xs text-[var(--slate)]">Loading...</td></tr>
              )}
              {!loading && sales.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-8 text-center font-mono text-xs text-[var(--slate)]">No sales recorded yet.</td></tr>
              )}
              {sales.map((s) => (
                <tr key={s.id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.02]">
                  <Td className="font-medium">{s.product.name} <span className="text-[var(--slate)] font-mono text-xs">({s.product.sku})</span></Td>
                  <Td>{s.quantity}</Td>
                  <Td>${Number(s.total_amount).toFixed(2)}</Td>
                  <Td>{s.user.name}</Td>
                  <Td className="font-mono text-xs">{new Date(s.sale_date).toLocaleDateString()}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

)
}
function Th({ children }: { children?: React.ReactNode }) {
  return <th className="px-5 py-3 font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--slate)]">{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-5 py-3.5 font-body text-sm text-[var(--ink)] ${className}`}>{children}</td>;
}