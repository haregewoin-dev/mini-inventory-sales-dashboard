"use client"

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";


type Product={

  id: string;
  name: string;
  sku: string;
  category: string | null;
  price: string;
  quantity: number;
  supplier: string | null;
}

type FormState= {
  name: string;
  sku: string;
  category: string;
  price: string;
  quantity: string;
  supplier: string;
}

const emptyForm: FormState = { name: "", sku: "", category: "", price: "", quantity: "", supplier: "" };

export function ProductsView({isAdmin}:{isAdmin:boolean}){
const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

async function loadProducts(){
    setLoading(true);
    try{
        const data = await apiFetch("/api/products")
        setProducts(data.products);
    }catch(err){
        setError((err as Error).message);
    }finally{
        setLoading(false);
    }
    
}
 useEffect(() => {
    loadProducts();
  }, []);


function openCreate(){
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
    setShowForm(true);
}

function openEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      sku: p.sku,
      category: p.category ?? "",
      price: p.price,
      quantity: String(p.quantity),
      supplier: p.supplier ?? "",
    });
    setError(null);
    setShowForm(true);
  }

  async function handleSubmit(e:React.FormEvent){
    e.preventDefault();
    setError(null);


  const duplicate = products.find(
    (p) => p.sku.toLowerCase() === form.sku.toLowerCase() && p.id !== editingId
  );
    if (duplicate) {
      setError(`SKU "${form.sku}" already exists`);
      return;
    }
    if (Number(form.quantity) < 0) {
      setError("Quantity cannot be negative");
      return;
    }
    if (Number(form.price) <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    setSubmitting(true);
    const payload = {
      name: form.name,
      sku: form.sku,
      category: form.category || undefined,
      price: Number(form.price),
      quantity: Number(form.quantity),
      supplier: form.supplier || undefined,
    };


    try{
        if(editingId){
           await apiFetch(`/api/products/${editingId}`, { 
            method: "PATCH", body: JSON.stringify(payload) 
        });
        }else{
            await apiFetch('/api/products',{
                method:"POST",
                body: JSON.stringify(payload)
            });
           
        } 
    
        setShowForm(false);
        await loadProducts();
    }catch(err){
        setError((err as Error).message);
    }finally{
        setSubmitting(false)
    }

  }

    
    
   async function handleDelete(id:string){
    if(!confirm("Delete this product? This cannot be undone.")){
        return;
    }
    try{
        await apiFetch(`/api/products/${id}`, { method: "DELETE" });
        await loadProducts();
    }catch(err){
        alert((err as Error).message)
    }
   }
    const inputClass =
    "w-full px-3.5 py-2.5 bg-white border border-black/10 text-[var(--ink)] font-body text-sm rounded-none focus:outline-none focus:ring-2 focus:ring-[var(--amber)] focus:border-transparent transition-shadow";
  const labelClass = "block font-mono text-[11px] tracking-[0.15em] uppercase text-[var(--slate)] mb-1.5";


  return(
     <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--slate)]">
            Inventory
          </span>
          <h1 className="font-display text-3xl font-bold text-[var(--ink)] mt-2">Products</h1>
        </div>
        <button
          onClick={openCreate}
          className="bg-[var(--ink)] text-[var(--parchment)] font-body text-sm font-medium px-5 py-2.5 hover:bg-[var(--ink)]/90 transition-colors"
        >
          + Add product
        </button>
      </div>

      {showForm && (
        <div className="border border-black/10 bg-white p-6 mb-8">
          <h2 className="font-display text-lg font-bold text-[var(--ink)] mb-5">
            {editingId ? "Edit product" : "New product"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>SKU</label>
              <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Supplier</label>
              <input value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Price</label>
              <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Quantity</label>
              <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required className={inputClass} />
            </div>

            {error && (
              <p className="col-span-2 font-mono text-[13px] text-red-600 border-l-2 border-red-600 pl-3">{error}</p>
            )}

            <div className="col-span-2 flex gap-3 mt-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-[var(--ink)] text-[var(--parchment)] font-body text-sm font-medium px-5 py-2.5 hover:bg-[var(--ink)]/90 transition-colors disabled:opacity-50"
              >
                {submitting ? "Saving..." : editingId ? "Save changes" : "Create product"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="font-body text-sm text-[var(--slate)] px-5 py-2.5 hover:text-[var(--ink)] transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

     <div className="border border-black/10 bg-white overflow-x-auto">
  <table className="w-full text-left min-w-[640px]">
          <thead>
            <tr className="border-b border-black/10">
              <Th>Name</Th>
              <Th>SKU</Th>
              <Th>Category</Th>
              <Th>Price</Th>
              <Th>Qty</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} className="px-5 py-8 text-center font-mono text-xs text-[var(--slate)]">Loading...</td></tr>
            )}
            {!loading && products.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-8 text-center font-mono text-xs text-[var(--slate)]">No products yet.</td></tr>
            )}
            {products.map((p) => (
              <tr key={p.id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.02]">
                <Td className="font-medium">{p.name}</Td>
                <Td className="font-mono text-xs">{p.sku}</Td>
                <Td>{p.category ?? "—"}</Td>
                <Td>${Number(p.price).toFixed(2)}</Td>
                <Td>
                  <span className={p.quantity <= 5 ? "text-[var(--amber)] font-semibold" : ""}>
                    {p.quantity}
                  </span>
                </Td>
                <Td className="text-right whitespace-nowrap">
                  <button onClick={() => openEdit(p)} className="font-mono text-[11px] uppercase text-[var(--slate)] hover:text-[var(--ink)] mr-4">
                    Edit
                  </button>
                  {isAdmin && (
                    <button onClick={() => handleDelete(p.id)} className="font-mono text-[11px] uppercase text-[var(--slate)] hover:text-red-600">
                      Delete
                    </button>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
}

function Th({ children }: { children?: React.ReactNode }) {
  return (
    <th className="px-5 py-3 font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--slate)]">
      {children}
    </th>
  );
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-5 py-3.5 font-body text-sm text-[var(--ink)] ${className}`}>{children}</td>;
}