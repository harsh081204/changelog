"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function Nav({ showDashboard = false }: { showDashboard?: boolean }) {
  const { data: session } = useSession();

  return (
    <nav className="bg-[#355872] px-5 flex items-center justify-between
      h-[52px] rounded-lg">
      <Link href="/" className="text-[14px] font-bold text-[#F7F8F0]
        tracking-wide">
        changelog.
      </Link>

      <div className="flex items-center gap-4">
        {showDashboard && session && (
          <>
            <span className="text-[12px] text-white/60">
              {session.user?.name}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-[12px] text-white/60 hover:text-white transition"
            >
              Sign out
            </button>
          </>
        )}
        {showDashboard && (
          <Link
            href="/dashboard"
            className="bg-[#9CD5FF] text-[#355872] text-[12px] font-bold
              px-[14px] py-[6px] rounded-[6px]"
          >
            My changelogs
          </Link>
        )}
      </div>
    </nav>
  );
}