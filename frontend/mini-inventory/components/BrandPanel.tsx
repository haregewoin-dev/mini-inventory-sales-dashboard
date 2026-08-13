export function Barcode({ className = "" }: { className?: string }) {
  const bars = [2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 2, 1];
  return (
    <div className={`flex items-end gap-[2px] ${className}`}>
      {bars.map((w, i) => (
        <div key={i} style={{ width: `${w}px` }} className="h-8 bg-current" />
      ))}
    </div>
  );
}

export function BrandPanel() {
  return (
    <div className="hidden md:flex flex-col justify-between bg-[var(--ink)] text-[var(--parchment)] p-12 relative overflow-hidden">
      <div
        className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full opacity-[0.08] pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--amber), transparent 70%)" }}
      />

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
  );
}