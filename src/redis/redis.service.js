const Redis = require("ioredis");

const redisClient = new Redis(process.env.REDIS_URL, {
  keepAlive: 1,
  pingInterval: 10000,
  enableReadyCheck: false, 
  maxRetriesPerRequest: null, 
});


redisClient.on("connect", () => {
  console.log("Connected to Redis (ioredis)");
});

redisClient.on("error", (error) => {
  console.log(`Redis connection error: ${error.message}`);
});

const set = async ({ key, value, ttl }) => {
  try {
    const stringValue = JSON.stringify(value);
    if (ttl && ttl !== 0) {
      return await redisClient.set(key, stringValue, "EX", ttl);
    }
    return await redisClient.set(key, stringValue);
  } catch (error) {
    console.log(`REDIS SET ERROR: ${error.message}`);
    return false;
  }
};

const get = async ({ key }) => {
  try {
    const result = await redisClient.get(key);
    return result ? JSON.parse(result) : false;
  } catch (error) {
    console.log(`REDIS GET ERROR: ${error.message}`);
    return false;
  }
};

const remove = async ({ key }) => {
  try {
    return await redisClient.del(key);
  } catch (error) {
    console.log(`REDIS REMOVE ERROR: ${error.message}`);
    return false;
  }
};

module.exports = {
  set,
  get,
  remove,
  redisClient,
};
