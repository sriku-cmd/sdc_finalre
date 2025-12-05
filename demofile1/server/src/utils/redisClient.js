const redis = require('redis');

const client = redis.createClient({
    url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`
});

client.on('error', (err) => console.log('Redis Client Error', err));
client.on('connect', () => console.log('Redis Client Connected'));

(async () => {
    try {
        await client.connect();
    } catch (err) {
        console.log('Redis Connection Failed:', err);
    }
})();

module.exports = client;
