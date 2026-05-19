"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function EditForm({
    entry,
    nextPatch,
    nextMinor,
    nextMajor,
}: {
    entry: any;
    nextPatch: string;
    nextMinor: string;
    nextMajor: string;
}) {
    const router = useRouter();
    const [title, setTitle] = useState(entry.title);
    const [version, setVersion] = useState(entry.version ?? "");
    const [content, setContent] = useState(entry.published ?? entry.aiDraft ?? "");
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [showDiff, setShowDiff] = useState(true);
    const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

    async function handleSave() {
        setSaving(true);
        await fetch(`/api/entries/${entry.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, version, content }),
        });
        setSaving(false);
    }

    async function handlePublish() {
        setPublishing(true);
        await fetch(`/api/entries/${entry.id}/publish`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, version, content }),
        });
        setPublishing(false);
        router.push(`/${entry.repo.owner}/${entry.repo.name}`);
    }

    function renderDiffLine(line: string, index: number) {
        let bg = "transparent";
        let text = "text-[#EDF4F9]/80";
        if (line.startsWith("+") && !line.startsWith("+++")) {
            bg = "bg-[#2E7D32]/10";
            text = "text-[#A5D6A7] font-semibold";
        } else if (line.startsWith("-") && !line.startsWith("---")) {
            bg = "bg-[#D32F2F]/10";
            text = "text-[#EF9A9A] font-semibold";
        } else if (line.startsWith("@@")) {
            text = "text-[#7AAACE]";
        }
        return (
            <div key={index} className={`px-2 py-0.5 rounded-sm font-mono text-[12px] leading-relaxed whitespace-pre-wrap ${bg} ${text}`}>
                {line}
            </div>
        );
    }

    function parseMarkdown(text: string) {
        return text.split("\n").map((line, idx) => {
            if (line.startsWith("### ")) {
                return <h3 key={idx} className="text-[15px] font-bold text-ink mt-4 mb-2">{line.replace("### ", "")}</h3>;
            }
            if (line.startsWith("## ")) {
                return <h2 key={idx} className="text-[17px] font-bold text-ink mt-5 mb-2">{line.replace("## ", "")}</h2>;
            }
            if (line.startsWith("# ")) {
                return <h1 key={idx} className="text-[20px] font-bold text-ink mt-6 mb-3">{line.replace("# ", "")}</h1>;
            }
            if (line.startsWith("- ") || line.startsWith("* ")) {
                return <li key={idx} className="text-[14px] text-ink ml-4 list-disc leading-relaxed mt-1">{line.substring(2)}</li>;
            }
            if (line.trim() === "") {
                return <div key={idx} className="h-2" />;
            }
            return <p key={idx} className="text-[14px] text-ink leading-relaxed">{line}</p>;
        });
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-end">
                <button
                    onClick={() => setShowDiff(!showDiff)}
                    className="bg-surface border border-[rgba(53,88,114,0.15)] text-navy hover:bg-[rgba(53,88,114,0.08)] text-[12px] font-semibold px-4 py-2 rounded-md transition"
                >
                    {showDiff ? "Hide Git Diff" : "Show Git Diff"}
                </button>
            </div>

            <div className={`grid grid-cols-1 ${showDiff ? "lg:grid-cols-2" : ""} gap-6 items-start`}>
                {showDiff && (
                    <div className="bg-[#1C2E3A] border border-[rgba(53,88,114,0.15)] rounded-lg overflow-hidden flex flex-col h-[650px]">
                        <div className="px-4 py-3 bg-[#132029] border-b border-[rgba(247,248,240,0.1)] flex items-center justify-between">
                            <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#7AAACE]">
                                Raw Git Diff
                            </span>
                            <span className="text-[11px] font-mono text-white/50">
                                {entry.rawDiff ? `${entry.rawDiff.split("\n").length} lines` : "No changes"}
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-0.5">
                            {entry.rawDiff ? (
                                entry.rawDiff.split("\n").map((line: string, idx: number) => renderDiffLine(line, idx))
                            ) : (
                                <p className="text-[13px] text-[#5A7A8E] text-center mt-20">No source diff available.</p>
                            )}
                        </div>
                    </div>
                )}

                <div className="bg-white border border-[rgba(53,88,114,0.15)] rounded-lg overflow-hidden flex flex-col h-[650px]">
                    <div className="px-5 py-4 border-b border-[rgba(53,88,114,0.15)] flex flex-col gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <label className="text-[11px] text-muted block mb-1 uppercase tracking-wider font-semibold">Title</label>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-surface border border-[rgba(53,88,114,0.15)] rounded-[8px] px-3 py-2 text-[14px] text-ink outline-none focus:border-navy transition"
                                />
                            </div>
                            <div>
                                <label className="text-[11px] text-muted block mb-1 uppercase tracking-wider font-semibold">Version</label>
                                <input
                                    value={version}
                                    onChange={(e) => setVersion(e.target.value)}
                                    className="w-full bg-surface border border-[rgba(53,88,114,0.15)] rounded-[8px] px-3 py-2 text-[14px] font-mono text-ink outline-none focus:border-navy transition"
                                />
                            </div>
                        </div>

                        <div>
                            <span className="text-[10px] text-muted block mb-2 uppercase tracking-wider font-semibold">
                                SemVer suggestions based on previous version {entry.version || "1.0.0"}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setVersion(nextPatch)}
                                    className="bg-surface hover:bg-[rgba(53,88,114,0.08)] border border-[rgba(53,88,114,0.15)] text-navy text-[11px] font-mono px-2.5 py-1 rounded transition"
                                >
                                    {nextPatch} Patch
                                </button>
                                <button
                                    onClick={() => setVersion(nextMinor)}
                                    className="bg-surface hover:bg-[rgba(53,88,114,0.08)] border border-[rgba(53,88,114,0.15)] text-navy text-[11px] font-mono px-2.5 py-1 rounded transition"
                                >
                                    {nextMinor} Minor
                                </button>
                                <button
                                    onClick={() => setVersion(nextMajor)}
                                    className="bg-surface hover:bg-[rgba(53,88,114,0.08)] border border-[rgba(53,88,114,0.15)] text-navy text-[11px] font-mono px-2.5 py-1 rounded transition"
                                >
                                    {nextMajor} Major
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="px-5 py-2 border-b border-[rgba(53,88,114,0.15)] flex items-center justify-between bg-surface/30">
                            <span className="text-[11px] text-muted uppercase tracking-wider font-semibold">Changelog Editor</span>
                            <div className="flex gap-1 bg-surface p-0.5 rounded-md border border-[rgba(53,88,114,0.08)]">
                                <button
                                    onClick={() => setActiveTab("write")}
                                    className={`px-3 py-1 rounded-sm text-[11px] font-semibold transition ${activeTab === "write" ? "bg-white text-navy shadow-sm" : "text-muted hover:text-navy"}`}
                                >
                                    Write
                                </button>
                                <button
                                    onClick={() => setActiveTab("preview")}
                                    className={`px-3 py-1 rounded-sm text-[11px] font-semibold transition ${activeTab === "preview" ? "bg-white text-navy shadow-sm" : "text-muted hover:text-navy"}`}
                                >
                                    Preview
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 min-h-0 p-5 overflow-y-auto">
                            {activeTab === "write" ? (
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full h-full bg-surface border border-[rgba(53,88,114,0.15)] rounded-[8px] px-3 py-2 text-[14px] text-ink font-mono outline-none focus:border-navy transition resize-none leading-relaxed"
                                    placeholder="Describe the changes in detail..."
                                />
                            ) : (
                                <div className="prose max-w-none flex flex-col gap-1.5 pb-6">
                                    {content.trim() ? parseMarkdown(content) : <p className="text-[13px] text-muted italic">Nothing to preview.</p>}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="px-5 py-4 border-t border-[rgba(53,88,114,0.15)] flex gap-3 justify-end bg-surface/10">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-surface text-navy text-[13px] font-semibold px-4 py-2 rounded-[8px] border border-[rgba(53,88,114,0.15)] hover:bg-[rgba(53,88,114,0.08)] transition disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Save Draft"}
                        </button>
                        <button
                            onClick={handlePublish}
                            disabled={publishing || entry.status === "PUBLISHED"}
                            className="bg-navy text-white text-[13px] font-semibold px-4 py-2 rounded-[8px] hover:opacity-90 transition disabled:opacity-50"
                        >
                            {publishing
                                ? "Publishing..."
                                : entry.status === "PUBLISHED"
                                    ? "Already published"
                                    : "Publish"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}