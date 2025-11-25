// src/services/queueService.js
import Queue from "bull";
import { sendEmail } from "./emailService.js";

const notificationQueue = new Queue("notification-queue", process.env.REDIS_URL);

// Add job to queue
export const addJob = async (data) => {
  await notificationQueue.add(data);
};

// Process jobs
notificationQueue.process(async (job) => {
  console.log("Processing job:", job.data);
  await sendEmail(job.data);
});

export { notificationQueue };
