// app/api/webhooks/github/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { changelogQueue } from "@/lib/queue";

export async function POST(req: NextRequest) {
  const body = await req.text(); // raw text — must come before json parse

  // 1. Verify signature
  const sig = req.headers.get("x-hub-signature-256") ?? "";
  const expected =
    "sha256=" +
    createHmac("sha256", process.env.GITHUB_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

  const sigBuffer      = Buffer.from(sig);
  const expectedBuffer = Buffer.from(expected);

  if (
    sigBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(sigBuffer, expectedBuffer)
  ) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event   = req.headers.get("x-github-event");
  const payload = JSON.parse(body);

  // 2. Only handle merged PRs
  if (
    event === "pull_request" &&
    payload.action === "closed" &&
    payload.pull_request?.merged === true
  ) {
    const pr    = payload.pull_request;
    const repo  = payload.repository;
    const owner = repo.owner.login;

    await changelogQueue.add(
      "process-pr",
      {
        type:           "pr",
        installationId: String(payload.installation.id),
        owner:          owner,
        repo:           repo.name,
        prNumber:       pr.number,
        commitSha:      pr.merge_commit_sha,
        // These come from GitHub directly now
        prTitle:        pr.title,
        prDescription:  pr.body ?? "",
        diffText:       "",  // fetched by the worker via Octokit
      },
      {
        jobId:   `pr-${payload.repository.id}-${pr.id}`, // dedup key
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
      }
    );
  }

  return NextResponse.json({ ok: true });
}