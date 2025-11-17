import Queue from "bull";

export const notificationQueue = new Queue("notifications", process.env.REDIS_URL);

export const addJob = async (data) => {
  await notificationQueue.add(data);
};

notificationQueue.process(async (job) => {
  console.log("Processing async job:", job.data);
});
