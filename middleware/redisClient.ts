import Redis from "ioredis";

const redisClient = new Redis({
    host: '192.168.2.186',
    port: 6379,
});

export default redisClient;
