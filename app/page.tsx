"use client";

import React from "react";
import Link from "next/link";
import { Nav } from "@/components/ui/Nav";
import { 
  GitPullRequest, 
  Sparkles, 
  Layers, 
  ArrowRight,
  Zap
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen text-ink flex flex-col font-sans antialiased" style={{ background: "var(--ds-white)" }}>
      <div className="max-w-[840px] w-full mx-auto px-4 py-8 flex flex-col gap-16 flex-grow">
        
        {/* Navigation header */}
        <Nav showDashboard />

        {/* Hero Section */}
        <header className="relative flex flex-col items-center text-center gap-6 mt-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[12px] font-semibold tracking-wide">
            <Zap className="w-3.5 h-3.5" />
            <span>AI-Powered GitHub Companion</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight max-w-[680px] leading-tight text-navy">
            Automate your product changelogs.
          </h1>

          <p className="text-[15px] md:text-[16px] text-muted max-w-[580px] leading-relaxed">
            changelog. listens to GitHub PR merges, parses Git diffs, classifies technical impact, and auto-generates high-quality markdown drafts using advanced LLMs.
          </p>

          <div className="flex items-center gap-4 mt-2">
            <Link
              href="/dashboard"
              className="group flex items-center justify-center gap-2 bg-navy text-white text-[13px] font-bold px-6 py-3 rounded-lg shadow hover:bg-ink transition duration-200"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </header>

        {/* High-Fidelity Static Illustration: Live Changelog Entry Card */}
        <section className="w-full">
          <div className="bg-white border border-[rgba(53,88,114,0.15)] rounded-xl overflow-hidden shadow-sm hover:border-[rgba(53,88,114,0.25)] transition duration-300">
            {/* Header pane of entry */}
            <div className="px-6 py-4 border-b border-[rgba(53,88,114,0.12)] bg-surface/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[12px] font-bold bg-navy text-white px-2.5 py-0.5 rounded-full">
                  v1.2.0
                </span>
                <h2 className="text-[15px] font-bold text-ink">
                  Relational GitHub Installation Integration
                </h2>
              </div>
              <time className="text-[10px] font-bold text-muted tracking-wider uppercase">
                May 20, 2026
              </time>
            </div>

            {/* Structured change categories */}
            <div className="px-6 py-6 flex flex-col gap-6">
              
              {/* Feature Category */}
              <div className="pl-4 border-l-2 border-navy">
                <span className="text-[9px] font-extrabold tracking-widest uppercase text-navy bg-navy/10 px-2 py-0.5 rounded mb-2.5 inline-block">
                  New
                </span>
                <ul className="flex flex-col gap-2">
                  <li className="text-[13px] text-ink leading-relaxed font-semibold">
                    Adds secure Google OAuth2 login provider configuration using NextAuth.
                  </li>
                  <li className="text-[13px] text-ink leading-relaxed font-semibold">
                    Introduces a top-level Installation model to manage GitHub App scopes globally.
                  </li>
                </ul>
              </div>

              {/* Bugfix Category */}
              <div className="pl-4 border-l-2 border-mid">
                <span className="text-[9px] font-extrabold tracking-widest uppercase text-muted bg-surface px-2 py-0.5 rounded mb-2.5 inline-block">
                  Fixed
                </span>
                <ul className="flex flex-col gap-2">
                  <li className="text-[13px] text-ink leading-relaxed font-semibold">
                    Resolves visual layouts shifts and flashing loading states on button transitions.
                  </li>
                </ul>
              </div>

              {/* Breaking Category */}
              <div className="pl-4 border-l-2 border-accent">
                <span className="text-[9px] font-extrabold tracking-widest uppercase text-accent bg-accent/10 px-2 py-0.5 rounded mb-2.5 inline-block">
                  Breaking
                </span>
                <ul className="flex flex-col gap-2">
                  <li className="text-[13px] text-ink leading-relaxed font-semibold">
                    Alters standard Repository table schema to require relational installationId.
                  </li>
                </ul>
              </div>

            </div>

            {/* Bottom details card info */}
            <div className="px-6 pb-5 flex items-center justify-between border-t border-[rgba(53,88,114,0.06)] pt-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface text-navy font-mono text-[11px] font-semibold rounded border border-[rgba(53,88,114,0.1)]">
                <GitPullRequest className="w-3.5 h-3.5 text-navy" />
                <span>Pull Request #42 on GitHub</span>
              </div>
              <span className="text-[11px] text-muted italic font-medium">Auto-generated via Groq SDK</span>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-white border border-[rgba(53,88,114,0.15)] rounded-xl p-6 md:p-8 flex flex-col gap-6 shadow-sm">
          <div>
            <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-muted">Core Pipeline</span>
            <h2 className="text-[18px] font-bold text-navy mt-1">How it works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-2">
            
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-navy mt-1 flex-shrink-0"></div>
                <div className="w-[1px] flex-grow bg-[rgba(53,88,114,0.15)] mt-2 hidden md:block"></div>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[13px] font-bold text-ink flex items-center gap-1.5">
                  <span>1. Hook Trigger</span>
                </h3>
                <span className="text-[10px] font-mono text-navy uppercase font-semibold">GitHub Webhooks</span>
                <p className="text-[12px] text-muted mt-1 leading-relaxed font-medium">
                  Merging a PR triggers a secure webhook, queuing background processing tasks asynchronously.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-mid mt-1 flex-shrink-0"></div>
                <div className="w-[1px] flex-grow bg-[rgba(53,88,114,0.15)] mt-2 hidden md:block"></div>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[13px] font-bold text-ink flex items-center gap-1.5">
                  <span>2. AI Analysis</span>
                </h3>
                <span className="text-[10px] font-mono text-navy uppercase font-semibold">Groq Classifier</span>
                <p className="text-[12px] text-muted mt-1 leading-relaxed font-medium">
                  The LLM engine parses Git code diffs and metadata, auto-generating SemVer updates and summaries.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-accent mt-1 flex-shrink-0"></div>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[13px] font-bold text-ink flex items-center gap-1.5">
                  <span>3. Publish Release</span>
                </h3>
                <span className="text-[10px] font-mono text-navy uppercase font-semibold">TipTap WYSIWYG</span>
                <p className="text-[12px] text-muted mt-1 leading-relaxed font-medium">
                  Review and customize changelog drafts in your protected workspace, then publish to public timelines immediately.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Footer */}
        <footer className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[12px] py-4 border-t border-[rgba(53,88,114,0.1)]">
          <div className="text-muted font-medium">
            Built with Next.js, Prisma 7, PostgreSQL, and BullMQ.
          </div>
          <div className="text-navy font-semibold">
            changelog.
          </div>
        </footer>

      </div>
    </div>
  );
}
