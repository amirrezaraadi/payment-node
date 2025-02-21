const redis = require('redis');

// ایجاد کلاینت Redis
const redisClient = redis.createClient();

// مدیریت خطاها
redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

// اتصال به Redis
(async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis!');
    } catch (err) {
        console.error('Error connecting to Redis:', err.message);
    }
})();

module.exports = redisClient;
