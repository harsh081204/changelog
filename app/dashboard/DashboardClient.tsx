"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Nav } from "@/components/ui/Nav";

export function DashboardClient({
    initialEntries,
    repos,
}: {
    initialEntries: any[];
    repos: any[];
}) {
    const [entries, setEntries] = useState(initialEntries);
    const [activeRepoId, setActiveRepoId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [publishingIds, setPublishingIds] = useState<Record<string, boolean>>({});

    async function handleQuickPublish(id: string) {
        const entry = entries.find((e) => e.id === id);
        if (!entry) return;

        setPublishingIds((prev) => ({ ...prev, [id]: true }));

        const res = await fetch(`/api/entries/${id}/publish`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: entry.title,
                version: entry.version || "1.0.0",
                content: entry.published ?? entry.aiDraft,
            }),
        });

        if (res.ok) {
            const data = await res.json();
            setEntries((prev) =>
                prev.map((e) =>
                    e.id === id
                        ? { ...e, status: "PUBLISHED", publishedAt: data.entry.publishedAt }
                        : e
                )
            );
        }

        setPublishingIds((prev) => ({ ...prev, [id]: false }));
    }

    const filteredEntries = entries.filter((entry) => {
        const matchesRepo = activeRepoId === null || entry.repoId === activeRepoId;
        const matchesSearch =
            searchQuery.trim() === "" ||
            entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (entry.version && entry.version.toLowerCase().includes(searchQuery.toLowerCase())) ||
            entry.repo.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.repo.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesRepo && matchesSearch;
    });

    const drafts = filteredEntries.filter((e) => e.status === "DRAFT");
    const published = filteredEntries.filter((e) => e.status === "PUBLISHED");

    return (
        <div className="min-h-screen" style={{ background: "var(--ds-white)" }}>
            <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">
                <Nav showDashboard />

                <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-muted mb-2">
                            Dashboard
                        </p>
                        <h1 className="text-[24px] font-semibold text-ink">Your changelogs</h1>
                        <p className="text-[14px] text-muted mt-1">
                            {drafts.length} draft{drafts.length !== 1 ? "s" : ""} waiting review .{" "}
                            {published.length} published
                        </p>
                    </div>

                    <div className="w-full md:w-80">
                        <input
                            type="text"
                            placeholder="Filter by title, version, or repository..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-[rgba(53,88,114,0.15)] rounded-[8px] px-3 py-2 text-[13px] text-ink outline-none focus:border-navy transition"
                        />
                    </div>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[rgba(53,88,114,0.15)] scrollbar-none">
                    <button
                        onClick={() => setActiveRepoId(null)}
                        className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition whitespace-nowrap ${activeRepoId === null
                                ? "bg-navy text-white"
                                : "bg-surface text-navy hover:bg-[rgba(53,88,114,0.08)]"
                            }`}
                    >
                        All codebase logs
                    </button>
                    {repos.map((repo) => (
                        <button
                            key={repo.id}
                            onClick={() => setActiveRepoId(repo.id)}
                            className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition whitespace-nowrap ${activeRepoId === repo.id
                                    ? "bg-navy text-white"
                                    : "bg-surface text-navy hover:bg-[rgba(53,88,114,0.08)]"
                                }`}
                        >
                            {repo.owner}/{repo.name}
                        </button>
                    ))}
                </div>

                {drafts.length > 0 && (
                    <div>
                        <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-muted mb-3">
                            Needs review
                        </p>
                        <div className="flex flex-col gap-3">
                            {drafts.map((entry) => (
                                <EntryRow
                                    key={entry.id}
                                    entry={entry}
                                    onQuickPublish={handleQuickPublish}
                                    isPublishing={publishingIds[entry.id]}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {published.length > 0 && (
                    <div>
                        <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-muted mb-3">
                            Published
                        </p>
                        <div className="flex flex-col gap-3">
                            {published.map((entry) => (
                                <EntryRow key={entry.id} entry={entry} />
                            ))}
                        </div>
                    </div>
                )}

                {filteredEntries.length === 0 && (
                    <div className="bg-surface border border-[rgba(53,88,114,0.15)] rounded-lg p-10 text-center">
                        <p className="text-[14px] text-muted">No changelogs match your filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function EntryRow({
    entry,
    onQuickPublish,
    isPublishing,
}: {
    entry: any;
    onQuickPublish?: (id: string) => void;
    isPublishing?: boolean;
}) {
    const featureCount = entry.changes.filter((c: any) => c.type === "FEATURE").length;
    const bugfixCount = entry.changes.filter((c: any) => c.type === "BUGFIX").length;
    const breakingCount = entry.changes.filter((c: any) => c.type === "BREAKING").length;

    return (
        <div className="bg-white border border-[rgba(53,88,114,0.15)] rounded-lg px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-[rgba(53,88,114,0.3)] transition">
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${entry.status === "DRAFT" ? "bg-accent animate-pulse" : "bg-[#2E7D32]"
                        }`}
                />

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[11px] text-muted font-mono">
                            {entry.repo.owner}/{entry.repo.name}
                        </span>
                        {entry.version && (
                            <span className="font-mono text-[11px] bg-surface text-navy px-[6px] py-[1px] rounded">
                                v{entry.version}
                            </span>
                        )}
                        {entry.prNumber && (
                            <span className="text-[11px] text-muted font-mono">
                                PR #{entry.prNumber}
                            </span>
                        )}
                    </div>
                    <p className="text-[14px] font-semibold text-ink truncate">{entry.title}</p>
                    <div className="flex gap-2 mt-2">
                        {featureCount > 0 && <Badge variant="feature">{featureCount} new</Badge>}
                        {bugfixCount > 0 && <Badge variant="bugfix">{bugfixCount} fixed</Badge>}
                        {breakingCount > 0 && <Badge variant="breaking">{breakingCount} breaking</Badge>}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-[rgba(53,88,114,0.08)]">
                <p className="text-[11px] text-muted">
                    {new Date(entry.createdAt).toLocaleDateString()}
                </p>

                <div className="flex items-center gap-2">
                    {entry.status === "DRAFT" && onQuickPublish && (
                        <button
                            onClick={() => onQuickPublish(entry.id)}
                            disabled={isPublishing}
                            className="bg-surface text-navy hover:bg-[rgba(53,88,114,0.08)] text-[12px] font-semibold px-4 py-2 rounded-md transition disabled:opacity-50"
                        >
                            {isPublishing ? "Publishing..." : "Quick Publish"}
                        </button>
                    )}
                    <Link
                        href={`/dashboard/${entry.id}/edit`}
                        className="bg-navy text-white text-[12px] font-semibold px-4 py-2 rounded-md hover:opacity-90 transition whitespace-nowrap"
                    >
                        {entry.status === "DRAFT" ? "Review" : "View"}
                    </Link>
                </div>
            </div>
        </div>
    );
}
