import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Nav } from "@/components/ui/Nav";
import type { ChangeType } from "@/app/generated/prisma";

const changeLabels: Record<ChangeType, string> = {
    FEATURE: "New",
    BUGFIX: "Fixed",
    BREAKING: "Breaking",
    INTERNAL: "Internal",
};

const changeBadge: Record<ChangeType, "feature" | "bugfix" | "breaking" | "internal"> = {
    FEATURE: "feature",
    BUGFIX: "bugfix",
    BREAKING: "breaking",
    INTERNAL: "internal",
};

export default async function ChangelogPage({
    params,
}: {
    params: Promise<{ owner: string; repo: string }>;
}) {
    const resolvedParams = await params;
    const repo = await prisma.repo.findUnique({
        where: { owner_name: { owner: resolvedParams.owner, name: resolvedParams.repo } },
        include: {
            entries: {
                where: { status: "PUBLISHED" },
                orderBy: { publishedAt: "desc" },
                include: {
                    changes: {
                        where: { type: { not: "INTERNAL" } },
                    },
                },
            },
        },
    });

    if (!repo) notFound();

    return (
        <div className="min-h-screen" style={{ background: "var(--ds-white)" }}>
            <div className="max-w-content mx-auto px-4 py-8">
                <Nav />

                <div className="mt-10 mb-10">
                    <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-muted mb-2">
                        Changelog
                    </p>
                    <h1 className="text-[24px] font-semibold text-ink">
                        {resolvedParams.owner}/{resolvedParams.repo}
                    </h1>
                    <p className="text-[15px] text-muted mt-1">
                        {repo.entries.length} release{repo.entries.length !== 1 ? "s" : ""}
                    </p>
                </div>

                {repo.entries.length === 0 ? (
                    <div className="bg-surface border border-[rgba(53,88,114,0.15)] rounded-lg p-8 text-center">
                        <p className="text-[15px] text-muted">No releases published yet.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-8">
                        {repo.entries.map((entry) => (
                            <div
                                key={entry.id}
                                className="bg-white border border-[rgba(53,88,114,0.15)] rounded-lg overflow-hidden"
                            >
                                <div className="px-6 py-4 border-b border-[rgba(53,88,114,0.15)] flex items-center gap-3">
                                    {entry.version && (
                                        <span className="font-mono text-[13px] bg-surface text-navy px-[6px] py-[2px] rounded">
                                            v{entry.version}
                                        </span>
                                    )}
                                    <h2 className="text-[15px] font-semibold text-ink flex-1">
                                        {entry.title}
                                    </h2>
                                    {entry.publishedAt && (
                                        <time className="text-[11px] text-muted">
                                            {new Date(entry.publishedAt).toLocaleDateString("en-US", {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </time>
                                    )}
                                </div>

                                <div className="px-6 py-4 flex flex-col gap-3">
                                    {(["FEATURE", "BUGFIX", "BREAKING"] as ChangeType[]).map((type) => {
                                        const items = entry.changes.filter((c) => c.type === type);
                                        if (!items.length) return null;
                                        return (
                                            <div key={type}>
                                                <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-muted mb-2">
                                                    {changeLabels[type]}
                                                </p>
                                                <ul className="flex flex-col gap-1">
                                                    {items.map((c) => (
                                                        <li key={c.id} className="flex items-start gap-2 text-[14px] text-ink">
                                                            <span className="text-muted mt-[2px]">—</span>
                                                            <span>{c.summary}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        );
                                    })}
                                </div>

                                {entry.prNumber && (
                                    <div className="px-6 pb-4">
                                        <a
                                            href={`https://github.com/${resolvedParams.owner}/${resolvedParams.repo}/pull/${entry.prNumber}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[12px] text-navy hover:underline"
                                        >
                                            View PR #{entry.prNumber} ↗
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}