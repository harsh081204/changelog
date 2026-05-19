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
            <div className="max-w-3xl mx-auto px-4 py-8">
                <Nav />

                <div className="mt-10 mb-10 text-center sm:text-left">
                    <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-muted mb-2">
                        Public Changelog
                    </p>
                    <h1 className="text-[28px] font-bold text-ink tracking-tight">
                        {resolvedParams.owner}/{resolvedParams.repo}
                    </h1>
                    <p className="text-[14px] text-muted mt-1">
                        {repo.entries.length} release{repo.entries.length !== 1 ? "s" : ""} published
                    </p>
                </div>

                {repo.entries.length === 0 ? (
                    <div className="bg-surface border border-[rgba(53,88,114,0.15)] rounded-lg p-10 text-center">
                        <p className="text-[14px] text-muted">No releases published yet.</p>
                    </div>
                ) : (
                    <div className="relative before:content-[''] before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[rgba(53,88,114,0.15)]">
                        <div className="flex flex-col gap-10">
                            {repo.entries.map((entry) => (
                                <div key={entry.id} className="relative pl-10">
                                    <div className="absolute left-[14px] top-2.5 w-3 h-3 rounded-full bg-white border-2 border-navy ring-4 ring-[#F7F8F0]" />

                                    <div className="bg-white border border-[rgba(53,88,114,0.15)] rounded-lg overflow-hidden hover:border-[rgba(53,88,114,0.3)] transition shadow-sm">
                                        <div className="px-6 py-4 border-b border-[rgba(53,88,114,0.15)] bg-surface/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <div className="flex items-center gap-3">
                                                {entry.version && (
                                                    <span className="font-mono text-[12px] font-bold bg-navy text-white px-2.5 py-0.5 rounded-full">
                                                        v{entry.version}
                                                    </span>
                                                )}
                                                <h2 className="text-[15px] font-semibold text-ink">
                                                    {entry.title}
                                                </h2>
                                            </div>
                                            {entry.publishedAt && (
                                                <time className="text-[11px] font-semibold text-muted tracking-wider uppercase">
                                                    {new Date(entry.publishedAt).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })}
                                                </time>
                                            )}
                                        </div>

                                        <div className="px-6 py-5 flex flex-col gap-5">
                                            {(["FEATURE", "BUGFIX", "BREAKING"] as ChangeType[]).map((type) => {
                                                const items = entry.changes.filter((c) => c.type === type);
                                                if (!items.length) return null;
                                                
                                                let categoryBorderColor = "border-navy";
                                                if (type === "BUGFIX") categoryBorderColor = "border-mid";
                                                if (type === "BREAKING") categoryBorderColor = "border-accent";

                                                return (
                                                    <div key={type} className={`pl-4 border-l-2 ${categoryBorderColor}`}>
                                                        <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-muted mb-2">
                                                            {changeLabels[type]}
                                                        </p>
                                                        <ul className="flex flex-col gap-1.5">
                                                            {items.map((c) => (
                                                                <li key={c.id} className="text-[14px] text-ink leading-relaxed">
                                                                    {c.summary}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {entry.prNumber && (
                                            <div className="px-6 pb-5 flex">
                                                <a
                                                    href={`https://github.com/${resolvedParams.owner}/${resolvedParams.repo}/pull/${entry.prNumber}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface text-navy font-mono text-[11px] font-semibold rounded-md border border-[rgba(53,88,114,0.1)] hover:bg-[rgba(53,88,114,0.08)] transition"
                                                >
                                                    Pull Request #{entry.prNumber} on GitHub
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}