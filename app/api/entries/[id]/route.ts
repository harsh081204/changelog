import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { title, version, content } = await req.json();

    const entry = await prisma.changelogEntry.update({
        where: { id },
        data: {
            title,
            version: version || null,
            aiDraft: content,
        },
    });

    return NextResponse.json({ ok: true, entry });
}