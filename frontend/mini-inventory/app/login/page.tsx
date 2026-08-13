"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

function Barcode({ className = "" }: { className?: string }) {
  const bars = [2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 2, 1];
  return (
    <div className={`flex items-end gap-[2px] ${className}`}>
      {bars.map((w, i) => (
        <div key={i} style={{ width: `${w}px` }} className="h-8 bg-current" />
      ))}
    </div>
  );
}

// function ClipboardIcon() {
//   return (
//     <svg viewBox="0 0 64 72" className="w-14 h-16" fill="none" stroke="currentColor" strokeWidth="2">
//       <rect x="6" y="8" width="52" height="60" rx="3" />
//       <rect x="20" y="2" width="24" height="12" rx="2" />
//       <path d="M14 26h20M14 26l4 5 4-5M14 40h20M14 40l4 5 4-5M14 54h20M14 54l4 5 4-5" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
//   );
// }

// function BoxStack() {
//   return (
//     <svg viewBox="0 0 140 80" className="w-32 h-20" fill="none" stroke="currentColor" strokeWidth="1.5">
//       <path d="M8 50 L30 40 L52 50 L30 60 Z" />
//       <path d="M8 50 V66 L30 76 V60 Z" />
//       <path d="M52 50 V66 L30 76" />
//       <path d="M45 30 L70 20 L95 30 L70 40 Z" />
//       <path d="M45 30 V52 L70 62 V40 Z" />
//       <path d="M95 30 V52 L70 62" />
//       <path d="M92 44 L110 38 L128 44 L110 50 Z" />
//       <path d="M92 44 V58 L110 64 V50 Z" />
//       <path d="M128 44 V58 L110 64" />
//     </svg>
//   );
// }

// function HangingTag() {
//   return (
//     <div className="flex flex-col items-center">
//       <svg width="2" height="28" className="text-[var(--ink-brown)]">
//         <line x1="1" y1="0" x2="1" y2="28" stroke="currentColor" strokeWidth="1.5" />
//       </svg>
//       <svg viewBox="0 0 20 20" className="w-4 h-4 -mt-1 text-[var(--ink-brown)]" fill="none" stroke="currentColor" strokeWidth="1.5">
//         <circle cx="10" cy="10" r="6" />
//       </svg>
//       <div className="border border-[var(--ink-brown)] bg-[var(--kraft-light)] px-3 py-1.5 -mt-1 rotate-1 shadow-sm">
//         <span className="font-mono text-[11px] tracking-widest text-[var(--ink-brown)] whitespace-nowrap">
//           SKU-0000-ADMIN
//         </span>
//       </div>
//     </div>
//   );
// }

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[var(--parchment)]">
      {/* Left: kraft ledger panel */}
     <div className="hidden md:flex flex-col justify-between bg-[var(--ink)] text-[var(--parchment)] p-12 relative overflow-hidden">
  <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full opacity-[0.08] pointer-events-none"
       style={{ background: "radial-gradient(circle, var(--amber), transparent 70%)" }} />

  <div className="relative border-t border-b border-white/15 py-3 flex items-center gap-3">
    <div className="w-2.5 h-2.5 bg-[var(--amber)] rotate-45" />
    <span className="font-mono text-xs tracking-[0.25em] uppercase font-semibold text-[var(--amber)]">
      Stockroom
    </span>
  </div>

  <div className="relative flex items-start justify-between gap-6">
    <div>
      <h1 className="font-display text-5xl font-bold leading-[1.05] mb-5">
        Stock, tracked
        <br />
        with intention.
      </h1>
      <p className="font-body text-[15px] text-white/60 max-w-xs leading-relaxed">
        Every unit logged, every movement traced — built for teams
        who value clarity and control.
      </p>
    </div>
 
  </div>

  <div className="relative flex items-end justify-between border-t border-white/15 pt-6 text-white/70">
    <div className="flex items-end gap-4">
      <svg viewBox="0 0 64 72" className="w-14 h-16" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="6" y="8" width="52" height="60" rx="3" />
        <rect x="20" y="2" width="24" height="12" rx="2" />
        <path d="M14 26h20M14 26l4 5 4-5M14 40h20M14 40l4 5 4-5M14 54h20M14 54l4 5 4-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg viewBox="0 0 140 80" className="w-32 h-20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 50 L30 40 L52 50 L30 60 Z" />
        <path d="M8 50 V66 L30 76 V60 Z" />
        <path d="M52 50 V66 L30 76" />
        <path d="M45 30 L70 20 L95 30 L70 40 Z" />
        <path d="M45 30 V52 L70 62 V40 Z" />
        <path d="M95 30 V52 L70 62" />
        <path d="M92 44 L110 38 L128 44 L110 50 Z" />
        <path d="M92 44 V58 L110 64 V50 Z" />
        <path d="M128 44 V58 L110 64" />
      </svg>
    </div>
    <div className="text-right">
      <Barcode className="text-[var(--amber)] justify-end mb-1" />
      <span className="font-mono text-[10px] tracking-widest">
        Stockroom · Ledger
      </span>
    </div>
  </div>
</div>

      {/* Right: form panel — unchanged */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--slate)]">
              Entry Log · 001
            </span>
            <h2 className="font-display text-3xl font-bold text-[var(--ink)] mt-2">
              Sign in
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block font-mono text-[11px] tracking-[0.15em] uppercase text-[var(--slate)] mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-3.5 py-2.5 bg-white border border-black/10 text-[var(--ink)] font-body text-sm rounded-none focus:outline-none focus:ring-2 focus:ring-[var(--amber)] focus:border-transparent transition-shadow"
              />
            </div>

            <div>
              <label htmlFor="password" className="block font-mono text-[11px] tracking-[0.15em] uppercase text-[var(--slate)] mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-3.5 py-2.5 bg-white border border-black/10 text-[var(--ink)] font-body text-sm rounded-none focus:outline-none focus:ring-2 focus:ring-[var(--amber)] focus:border-transparent transition-shadow"
              />
            </div>

            {error && (
              <p className="font-mono text-[13px] text-red-600 border-l-2 border-red-600 pl-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--ink)] text-[var(--parchment)] font-body text-sm font-medium py-3 mt-2 transition-colors hover:bg-[var(--ink)]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Barcode className="h-3 text-[var(--amber)] scale-y-50" />
                  <span>Verifying</span>
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="mt-8 font-mono text-[11px] tracking-wide text-[var(--slate)] text-center">
  Don&apos;t have an account?{" "}
  <Link href="/register" className="text-[var(--ink)] underline hover:text-[var(--amber)]">
    Sign up
  </Link>
</p>
        </div>
      </div>
    </div>
  );
}