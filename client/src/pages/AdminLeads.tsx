import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";

export default function AdminLeads() {
  const { user, loading } = useAuth();
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: leads, isLoading, refetch } = trpc.leads.list.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  const deleteMutation = trpc.leads.delete.useMutation({
    onSuccess: () => {
      setDeleteId(null);
      refetch();
    },
  });

  // CSV export
  const exportCSV = () => {
    if (!leads || leads.length === 0) return;
    const header = "Name,Email,Source,Date Captured";
    const rows = leads.map(l =>
      `"${l.name.replace(/"/g, '""')}","${l.email}","${l.source}","${new Date(l.createdAt).toLocaleString()}"`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `oracle-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = (leads ?? []).filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0806] flex items-center justify-center">
        <p className="text-[#c9a84c] font-serif italic">Loading…</p>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#0a0806] flex flex-col items-center justify-center gap-4">
        <p className="text-[#c9a84c] font-serif text-xl">Access restricted to administrators.</p>
        <Link href="/" className="text-[#c9a84c]/60 underline text-sm">Return to Oracle</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0806] text-[#e8d5a3] font-serif">
      {/* Header */}
      <div className="border-b border-[#c9a84c]/20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-[#c9a84c]/50 hover:text-[#c9a84c] text-sm transition-colors">
            ← Oracle
          </Link>
          <span className="text-[#c9a84c]/30">|</span>
          <Link href="/admin/courses" className="text-[#c9a84c]/50 hover:text-[#c9a84c] text-sm transition-colors">
            Courses
          </Link>
        </div>
        <h1 className="text-[#c9a84c] tracking-widest text-sm uppercase">Email Leads</h1>
        <div className="flex items-center gap-3">
          <span className="text-[#c9a84c]/50 text-sm">
            {leads ? `${leads.length} total` : "—"}
          </span>
          <button
            onClick={exportCSV}
            disabled={!leads || leads.length === 0}
            className="px-4 py-1.5 border border-[#c9a84c]/40 text-[#c9a84c] text-xs tracking-widest uppercase hover:bg-[#c9a84c]/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#1a1208] border border-[#c9a84c]/20 text-[#e8d5a3] px-4 py-2.5 text-sm placeholder-[#c9a84c]/30 focus:outline-none focus:border-[#c9a84c]/50"
          />
        </div>

        {/* Table */}
        {isLoading ? (
          <p className="text-[#c9a84c]/50 italic text-center py-12">Loading leads…</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#c9a84c]/40 italic text-lg">
              {search ? "No leads match your search." : "No leads captured yet."}
            </p>
            {!search && (
              <p className="text-[#c9a84c]/30 text-sm mt-2">
                Leads appear here after visitors complete the Oracle email capture.
              </p>
            )}
          </div>
        ) : (
          <div className="border border-[#c9a84c]/20 overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_2fr_1fr_1fr_auto] gap-4 px-4 py-3 bg-[#c9a84c]/5 border-b border-[#c9a84c]/20 text-[#c9a84c]/60 text-xs tracking-widest uppercase">
              <span>Name</span>
              <span>Email</span>
              <span>Source</span>
              <span>Date</span>
              <span></span>
            </div>

            {/* Rows */}
            {filtered.map(lead => (
              <div
                key={lead.id}
                className="grid grid-cols-[1fr_2fr_1fr_1fr_auto] gap-4 px-4 py-3 border-b border-[#c9a84c]/10 hover:bg-[#c9a84c]/5 transition-colors items-center"
              >
                <span className="text-sm truncate">{lead.name}</span>
                <span className="text-sm text-[#c9a84c]/80 truncate">{lead.email}</span>
                <span className="text-xs text-[#c9a84c]/50 capitalize">{lead.source}</span>
                <span className="text-xs text-[#c9a84c]/40">
                  {new Date(lead.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit", month: "short", year: "numeric"
                  })}
                </span>
                <button
                  onClick={() => setDeleteId(lead.id)}
                  className="text-red-500/40 hover:text-red-400 text-xs transition-colors px-2"
                  title="Delete lead"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {filtered.length > 0 && (
          <p className="text-[#c9a84c]/30 text-xs mt-4 text-right">
            Showing {filtered.length} of {leads?.length ?? 0} leads
          </p>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#1a1208] border border-[#c9a84c]/30 p-8 max-w-sm w-full text-center">
            <p className="text-[#c9a84c] font-serif text-lg mb-2">Remove this lead?</p>
            <p className="text-[#c9a84c]/50 text-sm mb-6">This cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteId(null)}
                className="px-6 py-2 border border-[#c9a84c]/30 text-[#c9a84c]/60 text-sm hover:bg-[#c9a84c]/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate({ id: deleteId })}
                disabled={deleteMutation.isPending}
                className="px-6 py-2 bg-red-900/40 border border-red-500/30 text-red-400 text-sm hover:bg-red-900/60 transition-colors disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Removing…" : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
