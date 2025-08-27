import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const redisPub = new Redis(redisUrl);

export const redisSub = new Redis(redisUrl);
