import { Worker } from "bullmq";
import { connection } from "@/lib/queue"
import {
    processChangelog,
    type ChangelogJobData,
} from "@/lib/queue/processors/changelog.processor";

console.log("[worker] Starting changelog worker...");

const worker = new Worker<ChangelogJobData>(
    "changelog",
    processChangelog,
    {
        connection,
        concurrency: 3,
    }
);

worker.on("completed", (job) => {
    console.log(`[worker] ✓ Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
    console.error(`[worker] Job ${job?.id} failed:`, err.message);
});

worker.on("error", (err) => {
    console.error("[worker] Worker error:", err);
});

process.on("SIGTERM", async () => {
    console.log("[worker] Shutting down...");
    await worker.close();
    process.exit(0);
});