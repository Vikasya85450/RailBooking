import Redis from "ioredis";

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD || undefined,
    db: Number(process.env.REDIS_DB) || 0,
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
});

redis.on("connect", () => {
    console.log("✅ Redis Connected");
});

redis.on("error", (err) => {
    console.error("❌ Redis Error:", err.message);
});

class RedisHelper {
    static async get(key) {
        const value = await redis.get(key);
        return value ? JSON.parse(value) : null;
    }

    static async set(key, value, ttl = null) {
        const data = JSON.stringify(value);

        if (ttl) {
            await redis.set(key, data, "EX", ttl);
        } else {
            await redis.set(key, data);
        }

        return true;
    }

    static async del(key) {
        return redis.del(key);
    }

    static async exists(key) {
        return (await redis.exists(key)) === 1;
    }

    static async expire(key, ttl) {
        return redis.expire(key, ttl);
    }

    static async increment(key) {
        return redis.incr(key);
    }

    static async decrement(key) {
        return redis.decr(key);
    }

    static async flushAll() {
        return redis.flushall();
    }

    static async disconnect() {
        await redis.quit();
    }
}

export default RedisHelper;