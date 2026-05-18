import { changelogQueue } from "../lib/queue";
import { prisma } from "../lib/prisma";
import type { ChangelogJobData } from "../lib/queue/processors/changelog.processor";

const testJob: ChangelogJobData = {
  type:           "pr",
  installationId: "fake-install-123",
  owner:          "testuser",
  repo:           "my-app",
  prNumber:       42,
  commitSha:      "abc123",
  prTitle:        "Add dark mode and fix sidebar contrast",
  prDescription:  "Users can now toggle dark mode in settings. Also fixes poor contrast on the sidebar nav in light mode.",
  diffText: `
### src/settings/theme.ts (+38 -0)
+ export type Theme = "light" | "dark" | "system"
+
+ export function setTheme(theme: Theme) {
+   document.documentElement.setAttribute("data-theme", theme)
+   localStorage.setItem("theme", theme)
+ }
+
+ export function getTheme(): Theme {
+   return (localStorage.getItem("theme") as Theme) ?? "system"
+ }

### src/components/Sidebar.tsx (+5 -3)
- className="text-gray-400"
+ className="text-gray-600 dark:text-gray-300"
  `.trim(),
};

async function main() {
  // Seed the required parent Installation record to satisfy foreign key constraints
  await prisma.installation.upsert({
    where: { id: testJob.installationId },
    create: {
      id: testJob.installationId,
      githubInstallId: 12345, // Dummy githubInstallId
      accountLogin: testJob.owner,
    },
    update: {},
  });
  console.log(`Seeded parent Installation: ${testJob.installationId}`);

  console.log("Adding job to queue...");

  const jobId = `pr-${testJob.prNumber}`;
  const existingJob = await changelogQueue.getJob(jobId);
  if (existingJob) {
    await existingJob.remove();
    console.log(`Removed existing job: ${jobId}`);
  }

  const job = await changelogQueue.add("process-pr", testJob, {
    jobId, 
  });

  console.log(`Job added: ${job.id}`);
  console.log("Now start the worker to process it:");
  console.log("  npx tsx worker.ts");

  process.exit(0);
}

main().catch(console.error);