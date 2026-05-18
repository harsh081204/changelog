import { Queue } from "bullmq";
import Redis from "ioredis";

export const connection = new Redis(process.env.REDIS_URL!, {
    maxRetriesPerRequest: null,
});

export const changelogQueue = new Queue("changelog", {
    connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential", 
            delay: 5000,
        },
        removeOnComplete: {count: 100},
        removeOnFail: {count: 50},
    },
});