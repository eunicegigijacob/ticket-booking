
const  redis = require('redis');
// import { configs } from '../config';


const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
  socket: { keepAlive: 1 },
  pingInterval: 10000,
});

redisClient
  .connect()
  .then(() => console.log('Connected to Redis'))
  .catch((error) => console.log(`Redis connection error: ${error.message}`));

const set = async ({ key, value, ttl }) => {
  try {
    const options = ttl && ttl !== 0 ? { EX: ttl } : undefined;
    return await redisClient.set(key, JSON.stringify(value), options);
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
};
