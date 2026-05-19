import { prisma } from "@/lib/prisma";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
    const entries = await prisma.changelogEntry.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            repo: true,
            changes: true,
        },
    });

    const repos = await prisma.repo.findMany({
        orderBy: { owner: "asc" },
    });

    return <DashboardClient initialEntries={entries} repos={repos} />;
}