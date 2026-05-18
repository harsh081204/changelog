type Variant = "feature" | "bugfix" | "breaking" | "internal" | "tech" | "draft" | "published";

const styles: Record<Variant, string> = {
    feature: "bg-[#E5F5E9]   text-[#2E7D32]",
    bugfix: "bg-[#EDF4F9]   text-[#355872]",
    breaking: "bg-[#FEF3E2]   text-[#854F0B]",
    internal: "bg-[#F1EFE8]   text-[#5A7A8E]",
    tech: "bg-[#EDF4F9]   text-[#355872]",
    draft: "bg-[#EDF4F9]   text-[#5A7A8E]",
    published: "bg-[#E5F5E9]   text-[#2E7D32]",
};

export function Badge({ variant, children }: { variant: Variant; children: React.ReactNode }) {
    return (
        <span className={`inline-block px-[10px] py-[3px] rounded-full text-[11px] font-semibold ${styles[variant]}`}>
            {children}
        </span>
    );
}