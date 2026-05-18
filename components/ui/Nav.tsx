import Link from "next/link";

export function Nav({ showDashboard = false }: { showDashboard?: boolean }) {
    return (
        <nav className="bg-navy px-5 flex items-center justify-between h-[52px] rounded-lg">
            <Link href="/" className="text-[14px] font-bold text-white tracking-wide">
                changelog.
            </Link>
            <div className="flex items-center gap-5">
                {showDashboard && (
                    <Link href="/dashboard" className="text-[12px] text-white/65 hover:text-white transition">
                        Dashboard
                    </Link>
                )}
            </div>
            {showDashboard && (
                <Link
                    href="/dashboard"
                    className="bg-light text-navy text-[12px] font-bold px-[14px] py-[6px] rounded-[6px]"
                >
                    My changelogs
                </Link>
            )}
        </nav>
    );
}