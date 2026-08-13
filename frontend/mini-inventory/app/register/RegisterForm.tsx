"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { BrandPanel } from "@/components/BrandPanel";
// import { QuickNav } from "@/components/QuickNav";
import Link from "next/link";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"STAFF" | "ADMIN">("STAFF");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      await apiFetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ name, email, password, role }),
      });
      setSuccess(true);
      setName(""); setEmail(""); setPassword(""); setRole("STAFF");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full px-3.5 py-2.5 bg-white border border-black/10 text-[var(--ink)] font-body text-sm rounded-none focus:outline-none focus:ring-2 focus:ring-[var(--amber)] focus:border-transparent transition-shadow";
  const labelClass =
    "block font-mono text-[11px] tracking-[0.15em] uppercase text-[var(--slate)] mb-1.5";

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[var(--parchment)]">
      <BrandPanel />

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* <QuickNav isAdmin /> */}

          <div className="mb-10">
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--slate)]">
              Entry Log · New
            </span>
            <h2 className="font-display text-3xl font-bold text-[var(--ink)] mt-2">
              Add a member
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={labelClass}>Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Temporary password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value as "STAFF" | "ADMIN")} className={inputClass}>
                <option value="STAFF">Staff</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {error && <p className="font-mono text-[13px] text-red-600 border-l-2 border-red-600 pl-3">{error}</p>}
            {success && (
              <p className="font-mono text-[13px] text-[var(--stock-green)] border-l-2 border-[var(--stock-green)] pl-3">
                Account created.
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--ink)] text-[var(--parchment)] font-body text-sm font-medium py-3 mt-2 transition-colors hover:bg-[var(--ink)]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>
          <p className="mt-8 font-mono text-[11px] tracking-wide text-[var(--slate)] text-center">
  already have an account?{" "}
  <Link href="/login" className="text-[var(--ink)] underline hover:text-[var(--amber)]">
    Sign in
  </Link>
</p>
        </div>
      </div>
    </div>
  );
}