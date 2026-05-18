import {Job} from "bullmq";
import { classifyChanges } from "@/lib/llm/classifier";
import { prisma } from "@/lib/prisma";

export interface ChangelogJobData{
  type:           "pr" | "push";
  installationId: string;
  owner:          string;
  repo:           string;
  prNumber?:      number;
  commitSha?:     string;
  prTitle:        string;
  prDescription:  string;
  diffText:       string; 
}

export async function processChangelog(job: Job<ChangelogJobData>) {
    const {
        owner,
        repo,
        prNumber,
        commitSha,
        prTitle,
        prDescription,
        diffText,
        installationId,       
    } = job.data;

    console.log(`[worker] Processing job ${job.id} - ${owner}/${repo} PR#${prNumber}`);

    const result = await classifyChanges({ prTitle, prDescription, diffText });

    console.log(`[worker] Classified: "${result.entryTitle}" (${result.suggestedVersion})`);

      const dbRepo = await prisma.repo.upsert({
    where:  { owner_name: { owner, name: repo } },
    create: {
      owner,
      name: repo,
      installationId,
    },
    update: {},
  });

  const entry = await prisma.changelogEntry.create({
    data: {
      repoId:    dbRepo.id,
      prNumber:  prNumber ?? null,
      commitSha: commitSha ?? null,
      title:     result.entryTitle,
      version:   result.suggestedVersion,
      rawDiff:   diffText,
      aiDraft:   result.changes
        .map(c => `- **${c.type}**: ${c.summary}`)
        .join("\n"),
      status:  "DRAFT",
      changes: {
        create: result.changes.map(c => ({
          type:    c.type,
          summary: c.summary,
          files:   c.files,
        })),
      },
    },
  });

  console.log(`[worker] Saved draft entry: ${entry.id}`);
  return { entryId: entry.id };
}