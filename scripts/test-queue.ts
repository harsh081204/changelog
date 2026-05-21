import { changelogQueue } from "../lib/queue";
import { prisma } from "../lib/prisma";
import type { ChangelogJobData } from "../lib/queue/processors/changelog.processor";

async function main() {
  // Read arguments from command line or environment
  const args = process.argv.slice(2);
  
  const installationId = args[0] || process.env.TEST_GITHUB_INSTALLATION_ID;
  const owner = args[1] || process.env.TEST_GITHUB_OWNER;
  const repo = args[2] || process.env.TEST_GITHUB_REPO;
  const prNumber = Number(args[3] || process.env.TEST_GITHUB_PR_NUMBER);

  if (!installationId || !owner || !repo || !prNumber || isNaN(prNumber)) {
    console.error(`
❌ Error: Missing required GitHub variables.
Since the worker is now fully connected to the active GitHub App API, you must provide real parameters.

Usage:
  npx tsx scripts/test-queue.ts <installationId> <owner> <repo> <prNumber>

Example:
  npx tsx scripts/test-queue.ts 56789012 octocat Spoon-Knife 1

Alternatively, set these environment variables in your .env:
  TEST_GITHUB_INSTALLATION_ID="your-install-id"
  TEST_GITHUB_OWNER="your-github-username"
  TEST_GITHUB_REPO="your-github-repo"
  TEST_GITHUB_PR_NUMBER="your-pr-number"
    `);
    process.exit(1);
  }

  const testJob: ChangelogJobData = {
    installationId,
    owner,
    repo,
    prNumber,
    commitSha: "abc1234567890def",
    prTitle: "Simulated Webhook Pull Request",
    prDescription: "This pull request was queued by the developer testing script.",
  };

  // Seed the required parent Installation record to satisfy foreign key constraints
  await prisma.installation.upsert({
    where: { id: testJob.installationId },
    create: {
      id: testJob.installationId,
      githubInstallId: Number(installationId),
      accountLogin: testJob.owner,
    },
    update: {},
  });
  
  console.log(`✓ Seeded parent Installation: ${testJob.installationId}`);
  console.log(`Adding PR #${prNumber} from ${owner}/${repo} to the queue...`);

  const jobId = `pr-${prNumber}`;
  const existingJob = await changelogQueue.getJob(jobId);
  if (existingJob) {
    await existingJob.remove();
    console.log(`Removed existing job: ${jobId}`);
  }

  const job = await changelogQueue.add("process-pr", testJob, {
    jobId, 
  });

  console.log(`🚀 Job added to BullMQ: ${job.id}`);
  console.log("\nNow start the worker in a separate terminal to process it:");
  console.log("  pnpm worker");

  process.exit(0);
}

main().catch(console.error);