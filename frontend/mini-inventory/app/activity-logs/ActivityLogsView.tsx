"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Log = {
  id: string;
  action: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  user: { name: string; email: string };
};

export function ActivityLogsView() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Log | null>(null);

  async function loadLogs() {
    setLoading(true);
    try {
      const data = await apiFetch("/api/activity-logs");
      setLogs(data.logs);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

  const inputClass =
    "w-full px-3.5 py-2.5 bg-white border border-black/10 text-[var(--ink)] font-body text-sm rounded-none focus:outline-none focus:ring-2 focus:ring-[var(--amber)] focus:border-transparent";

  return (
    <div>
      <div className="mb-8">
        <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--slate)]">Audit trail</span>
        <h1 className="font-display text-3xl font-bold text-[var(--ink)] mt-2">Activity Logs</h1>
      </div>

      <div className="border border-black/10 bg-white overflow-x-auto">
  <table className="w-full text-left min-w-[640px]">
          <thead>
            <tr className="border-b border-black/10">
              <Th>Action</Th><Th>User</Th><Th>Date</Th><Th></Th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={4} className="px-5 py-8 text-center font-mono text-xs text-[var(--slate)]">Loading...</td></tr>}
            {!loading && logs.length === 0 && <tr><td colSpan={4} className="px-5 py-8 text-center font-mono text-xs text-[var(--slate)]">No activity yet.</td></tr>}
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.02]">
                <Td className="font-mono text-xs">{log.action}</Td>
                <Td>{log.user.name}</Td>
                <Td className="font-mono text-xs">{new Date(log.created_at).toLocaleString()}</Td>
                <Td className="text-right">
                  <button onClick={() => setSelected(log)} className="font-mono text-[11px] uppercase text-[var(--slate)] hover:text-[var(--ink)]">
                    View details
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50" onClick={() => setSelected(null)}>
          <div className="bg-white max-w-lg w-full p-6 border border-black/10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-[var(--ink)]">{selected.action}</h3>
              <button onClick={() => setSelected(null)} className="font-mono text-xs text-[var(--slate)] hover:text-[var(--ink)]">Close</button>
            </div>
            <p className="font-mono text-[11px] text-[var(--slate)] mb-4">
              {selected.user.name} ({selected.user.email}) · {new Date(selected.created_at).toLocaleString()}
            </p>
            <pre className="bg-black/[0.03] border border-black/10 p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(selected.metadata, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

function Th({ children }: { children?: React.ReactNode }) {
  return <th className="px-5 py-3 font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--slate)]">{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-5 py-3.5 font-body text-sm text-[var(--ink)] ${className}`}>{children}</td>;
}