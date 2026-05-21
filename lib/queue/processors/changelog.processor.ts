import { Job } from "bullmq";
import { classifyChanges } from "@/lib/llm/classifier";
import { prisma } from "@/lib/prisma";

export interface ChangelogJobData {
  installationId: string;
  owner:          string;
  repo:           string;
  prNumber:       number;
  commitSha:      string;
  prTitle:        string;
  prDescription:  string;
}

// Dynamically import @octokit/app to leverage ESM resolution and avoid package exports errors under Node/TSX
let AppClass: any = null;
async function getGithubApp() {
  if (!AppClass) {
    const octokitAppModule = await import("@octokit/app");
    AppClass = octokitAppModule.App;
  }
  return new AppClass({
    appId:      process.env.GITHUB_APP_ID!,
    privateKey: process.env.GITHUB_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    webhooks:   { secret: process.env.GITHUB_WEBHOOK_SECRET! },
  });
}

export async function processChangelog(job: Job<ChangelogJobData>) {
  const {
    installationId,
    owner,
    repo,
    prNumber,
    commitSha,
    prTitle,
    prDescription,
  } = job.data;

  // 1. Get an installation-scoped Octokit client
  const githubApp = await getGithubApp();
  const octokit = await githubApp.getInstallationOctokit(
    Number(installationId)
  );

  // 2. Fetch changed files and their diffs
  const { data: files } = await octokit.rest.pulls.listFiles({
    owner,
    repo,
    pull_number: prNumber,
    per_page:    50,
  });

  // 3. Build a clean diff string — skip noise files
  const diffText = files
    .filter(
      (f) => !f.filename.match(/\.(lock|min\.js|map|snap)$/)
    )
    .map(
      (f) =>
        `### ${f.filename} (+${f.additions} -${f.deletions})\n${
          (f.patch ?? "").slice(0, 800)
        }`
    )
    .join("\n\n")
    .slice(0, 12000);

  console.log(
    `[worker] Fetched diff for PR #${prNumber} — ${files.length} files`
  );

  // 4. Classify
  const result = await classifyChanges({
    prTitle,
    prDescription,
    diffText,
  });

  // 5. Upsert repo + save draft
  const dbRepo = await prisma.repo.upsert({
    where:  { owner_name: { owner, name: repo } },
    create: { owner, name: repo, installationId },
    update: {},
  });

  const entry = await prisma.changelogEntry.create({
    data: {
      repoId:    dbRepo.id,
      prNumber,
      commitSha,
      title:     result.entryTitle,
      version:   result.suggestedVersion,
      rawDiff:   diffText,
      aiDraft:   result.changes
        .map((c) => `- **${c.type}**: ${c.summary}`)
        .join("\n"),
      status:  "DRAFT",
      changes: {
        create: result.changes.map((c) => ({
          type:    c.type,
          summary: c.summary,
          files:   c.files,
        })),
      },
    },
  });

  console.log(`[worker] Draft saved: ${entry.id}`);
  return { entryId: entry.id };
}