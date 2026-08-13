export function StatCard({
  label, value, hint, accent,
}: { label: string; value: string; hint?: string; accent?: "amber" }) {
  return (
    <div className="border border-black/10 bg-white p-5">
      <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--slate)]">
        {label}
      </span>
      <div
        className={`font-display text-4xl font-bold mt-2 ${
          accent === "amber" ? "text-[var(--amber)]" : "text-[var(--ink)]"
        }`}
      >
        {value}
      </div>
      {hint && (
        <span className="font-mono text-[10px] text-[var(--slate)]/70 mt-1 block">
          {hint}
        </span>
      )}
    </div>
  );
}