"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function EditForm({ entry }: { entry: any }) {
    const router = useRouter();
    const [title, setTitle] = useState(entry.title);
    const [version, setVersion] = useState(entry.version ?? "");
    const [content, setContent] = useState(
        // Convert stored aiDraft to editable text
        entry.published ?? entry.aiDraft
    );
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);

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

    return (
        <div className="bg-white border border-[rgba(53,88,114,0.15)] rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-[rgba(53,88,114,0.15)]">
                <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-muted mb-3">
                    Edit before publishing
                </p>

                {/* Title */}
                <div className="mb-3">
                    <label className="text-[11px] text-muted block mb-1">Title</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-surface border border-[rgba(53,88,114,0.15)] rounded-[8px] px-3 py-2 text-[14px] text-ink outline-none focus:border-navy transition"
                    />
                </div>

                {/* Version */}
                <div>
                    <label className="text-[11px] text-muted block mb-1">
                        Version{" "}
                        <span className="text-muted/60">(AI suggested: {entry.version})</span>
                    </label>
                    <input
                        value={version}
                        onChange={(e) => setVersion(e.target.value)}
                        placeholder="e.g. 1.3.0"
                        className="w-full bg-surface border border-[rgba(53,88,114,0.15)] rounded-[8px] px-3 py-2 text-[14px] font-mono text-ink outline-none focus:border-navy transition"
                    />
                </div>
            </div>

            {/* Content editor */}
            <div className="px-5 py-4">
                <label className="text-[11px] text-muted block mb-2">
                    Changelog content
                </label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={10}
                    className="w-full bg-surface border border-[rgba(53,88,114,0.15)] rounded-[8px] px-3 py-2 text-[14px] text-ink font-mono outline-none focus:border-navy transition resize-none leading-relaxed"
                />
                <p className="text-[11px] text-muted mt-1">
                    Edit the AI draft above. This is what appears on the public page.
                </p>
            </div>

            {/* Actions */}
            <div className="px-5 py-4 border-t border-[rgba(53,88,114,0.15)] flex gap-3 justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-surface text-navy text-[13px] font-semibold px-4 py-2 rounded-[8px] hover:opacity-80 transition disabled:opacity-50"
                >
                    {saving ? "Saving..." : "Save draft"}
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
                            : "Publish →"}
                </button>
            </div>
        </div>
    );
}