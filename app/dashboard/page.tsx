import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Nav } from "@/components/ui/Nav";

export default async function DashboardPage() {
    const entries = await prisma.changelogEntry.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            repo: true,
            changes: true,
        },
    });

    const drafts = entries.filter((e) => e.status === "DRAFT");
    const published = entries.filter((e) => e.status === "PUBLISHED");

    return (
        <div className="min-h-screen" style={{ background: "var(--ds-white)" }}>
            <div className="max-w-content mx-auto px-4 py-8">
                <Nav showDashboard />

                <div className="mt-10 mb-8">
                    <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-muted mb-2">
                        Dashboard
                    </p>
                    <h1 className="text-[24px] font-semibold text-ink">Your changelogs</h1>
                    <p className="text-[15px] text-muted mt-1">
                        {drafts.length} draft{drafts.length !== 1 ? "s" : ""} waiting ·{" "}
                        {published.length} published
                    </p>
                </div>

                {drafts.length > 0 && (
                    <div className="mb-10">
                        <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-muted mb-3">
                            Needs review
                        </p>
                        <div className="flex flex-col gap-3">
                            {drafts.map((entry) => (
                                <EntryRow key={entry.id} entry={entry} />
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

                {entries.length === 0 && (
                    <div className="bg-surface border border-[rgba(53,88,114,0.15)] rounded-lg p-10 text-center">
                        <p className="text-[15px] text-muted">No entries yet.</p>
                        <p className="text-[13px] text-muted mt-1">
                            Run{" "}
                            <code className="font-mono bg-surface text-navy px-1 rounded">
                                npx tsx scripts/test-queue.ts
                            </code>{" "}
                            to create your first draft.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function EntryRow({ entry }: { entry: any }) {
    const featureCount = entry.changes.filter((c: any) => c.type === "FEATURE").length;
    const bugfixCount = entry.changes.filter((c: any) => c.type === "BUGFIX").length;
    const breakingCount = entry.changes.filter((c: any) => c.type === "BREAKING").length;

    return (
        <div className="bg-white border border-[rgba(53,88,114,0.15)] rounded-lg px-5 py-4 flex items-center gap-4">
            <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${entry.status === "DRAFT" ? "bg-accent" : "bg-[#4CAF50]"
                    }`}
            />

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] text-muted font-mono">
                        {entry.repo.owner}/{entry.repo.name}
                    </span>
                    {entry.version && (
                        <span className="font-mono text-[11px] bg-surface text-navy px-[6px] py-[1px] rounded">
                            v{entry.version}
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

            <p className="text-[11px] text-muted flex-shrink-0">
                {new Date(entry.createdAt).toLocaleDateString()}
            </p>

            <Link
                href={`/dashboard/${entry.id}/edit`}
                className="bg-navy text-white text-[12px] font-semibold px-[14px] py-[7px] rounded-[8px] flex-shrink-0 hover:opacity-90 transition"
            >
                {entry.status === "DRAFT" ? "Review →" : "View →"}
            </Link>
        </div>
    );
}