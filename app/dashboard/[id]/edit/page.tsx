import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditForm } from "./EditForm";
import { Nav } from "@/components/ui/Nav";
import { Badge } from "@/components/ui/Badge";
import type { ChangeType } from "@/app/generated/prisma";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const entry = await prisma.changelogEntry.findUnique({
        where: { id },
        include: { repo: true, changes: true },
    });

    if (!entry) notFound();

    const latestPublished = await prisma.changelogEntry.findFirst({
        where: {
            repoId: entry.repoId,
            status: "PUBLISHED",
            version: { not: null },
        },
        orderBy: { publishedAt: "desc" },
    });

    const latestVersion = latestPublished?.version || "1.0.0";
    const cleanVersion = latestVersion.replace(/^v/, "");
    const parts = cleanVersion.split(".");
    const major = parseInt(parts[0]) || 1;
    const minor = parseInt(parts[1]) || 0;
    const patch = parseInt(parts[2]) || 0;

    const nextPatch = `${major}.${minor}.${patch + 1}`;
    const nextMinor = `${major}.${minor + 1}.0`;
    const nextMajor = `${major + 1}.0.0`;

    return (
        <div className="min-h-screen" style={{ background: "var(--ds-white)" }}>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <Nav showDashboard />

                <div className="mt-10 mb-6 flex items-start justify-between">
                    <div>
                        <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-muted mb-1">
                            {entry.repo.owner}/{entry.repo.name}
                            {entry.prNumber ? ` . PR #${entry.prNumber}` : ""}
                        </p>
                        <h1 className="text-[24px] font-semibold text-ink">{entry.title}</h1>
                    </div>
                    <span
                        className={`text-[11px] font-semibold px-3 py-1 rounded-full ${entry.status === "DRAFT"
                                ? "bg-[#FEF3E2] text-[#854F0B]"
                                : "bg-[#E5F5E9] text-[#2E7D32]"
                            }`}
                    >
                        {entry.status}
                    </span>
                </div>

                <div className="bg-surface border border-[rgba(53,88,114,0.15)] rounded-lg p-5 mb-6">
                    <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-muted mb-3">
                        AI classified changes
                    </p>
                    <div className="flex flex-col gap-2">
                        {entry.changes.map((c) => (
                            <div key={c.id} className="flex items-start gap-3">
                                <Badge variant={c.type.toLowerCase() as any}>{c.type}</Badge>
                                <p className="text-[13px] text-ink leading-relaxed">{c.summary}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <EditForm
                    entry={entry}
                    nextPatch={nextPatch}
                    nextMinor={nextMinor}
                    nextMajor={nextMajor}
                />
            </div>
        </div>
    );
}