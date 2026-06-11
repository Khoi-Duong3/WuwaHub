import Redis from 'ioredis'

// Singleton pattern — prevents new connections on every hot reload
const globalForRedis = global as unknown as { redis: Redis }

export const redis = globalForRedis.redis ?? new Redis({
  host: process.env.REDIS_HOST ?? 'localhost',
  port: Number(process.env.REDIS_PORT) ?? 6379,
})

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis