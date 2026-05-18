import Link from "next/link";
import { Nav } from "@/components/ui/Nav";

export default function Home() {
    return (
        <div className="min-h-screen" style={{ background: "var(--ds-white)" }}>
            <div className="max-w-content mx-auto px-4 py-8 flex flex-col gap-12">
                <Nav showDashboard />

                <div className="bg-surface border border-[rgba(53,88,114,0.15)] rounded-lg p-8 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-navy flex items-center justify-center font-bold text-[24px] text-light flex-shrink-0">
                        CL
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <div className="text-[10px] font-semibold tracking-[0.12em] uppercase text-muted mb-1">AI-powered GitHub Companion</div>
                        <h1 className="text-[28px] font-bold text-ink leading-tight mb-2">
                            Automate your product changelogs.
                        </h1>
                        <p className="text-[14px] text-muted leading-relaxed">
                            changelog. listens to GitHub PR merges, groups changes by type, and writes high-quality drafts using advanced AI. Spend zero time manually drafting release notes.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-[rgba(53,88,114,0.15)] rounded-lg p-6 flex flex-col gap-6">
                        <div className="text-[10px] font-semibold tracking-[0.12em] uppercase text-muted">How it works</div>
                        
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-2.5 h-2.5 rounded-full bg-navy flex-shrink-0 mt-1"></div>
                                <div className="w-[1px] flex-1 bg-[rgba(53,88,114,0.15)] mt-2"></div>
                            </div>
                            <div>
                                <div className="text-[13px] font-bold text-ink">1. Merges Trigger Hooks</div>
                                <div className="text-[12px] text-navy font-semibold">GitHub Webhooks</div>
                                <div className="text-[12px] text-muted mt-1 leading-relaxed">
                                    When a pull request merges, BullMQ queues a background job.
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-2.5 h-2.5 rounded-full bg-mid flex-shrink-0 mt-1"></div>
                                <div className="w-[1px] flex-1 bg-[rgba(53,88,114,0.15)] mt-2"></div>
                            </div>
                            <div>
                                <div className="text-[13px] font-bold text-ink">2. AI Classification</div>
                                <div className="text-[12px] text-navy font-semibold">Groq Claude/Llama</div>
                                <div className="text-[12px] text-muted mt-1 leading-relaxed">
                                    Changes are classified as New, Fixed, or Breaking, and a release summary draft is generated.
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-2.5 h-2.5 rounded-full bg-mid flex-shrink-0 mt-1"></div>
                            </div>
                            <div>
                                <div className="text-[13px] font-bold text-ink">3. Review & Publish</div>
                                <div className="text-[12px] text-navy font-semibold">Interactive Editor</div>
                                <div className="text-[12px] text-muted mt-1 leading-relaxed">
                                    Approve and polish the changelog in the dashboard, then publish it instantly.
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="bg-white border border-[rgba(53,88,114,0.15)] rounded-lg p-6 flex flex-col gap-4">
                            <div className="text-[10px] font-semibold tracking-[0.12em] uppercase text-muted">System Performance</div>
                            <div className="flex flex-col gap-4">
                                <div>
                                    <div className="flex justify-between text-[12px] font-semibold text-ink mb-1">
                                        <span>AI categorization accuracy</span>
                                        <span className="text-navy">95%</span>
                                    </div>
                                    <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                                        <div className="h-full bg-navy rounded-full" style={{ width: "95%" }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-[12px] font-semibold text-ink mb-1">
                                        <span>Webhook latency</span>
                                        <span className="text-navy">&lt; 150ms</span>
                                    </div>
                                    <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                                        <div className="h-full bg-navy rounded-full" style={{ width: "90%" }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-[12px] font-semibold text-ink mb-1">
                                        <span>Generation speed</span>
                                        <span className="text-navy">&lt; 2s</span>
                                    </div>
                                    <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                                        <div className="h-full bg-navy rounded-full" style={{ width: "85%" }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-navy rounded-lg p-6 text-white flex flex-col gap-4">
                            <div className="text-[11px] font-semibold tracking-wider uppercase text-white/50">
                                Get Started
                            </div>
                            <p className="text-[13px] text-[#9CD5FF] leading-relaxed">
                                Ready to experience modern release logs? Navigate to your dashboard or run our queue simulator to inject mock pull requests.
                            </p>
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/dashboard"
                                    className="bg-[#9CD5FF] text-navy text-[13px] font-bold px-4 py-2 rounded-md hover:bg-white transition text-center"
                                >
                                    Go to Dashboard
                                </Link>
                                <a
                                    href="https://github.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="border border-white/30 text-[13px] font-semibold px-4 py-2 rounded-md hover:border-white transition text-center"
                                >
                                    Documentation
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-[rgba(53,88,114,0.15)] rounded-lg p-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[12px]">
                    <div className="text-muted">
                        Built with Next.js, Prisma 7, PostgreSQL, and BullMQ.
                    </div>
                    <div className="flex gap-4">
                        <a href="#" className="text-navy hover:underline">Privacy</a>
                        <a href="#" className="text-navy hover:underline">Terms</a>
                        <a href="#" className="text-navy hover:underline">Support</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
