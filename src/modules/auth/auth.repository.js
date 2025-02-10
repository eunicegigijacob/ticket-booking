const redisService = require("../../redis/redis.service");


async function createSession(userId, payload) {
  const key = `auth:sessions:${userId}`;

  // Remove existing session if any
  await redisService.remove({ key });

  // Store new session
  await redisService.set({ key, value: payload, ttl: 3600 });
}

async function createRefreshSession(userId, payload) {
  const key = `auth:refreshSessions:${userId}`;

  // Remove existing refresh session
  await redisService.remove({ key });

  // Store new refresh session
  await redisService.set({ key, value: payload, ttl: 86400 });
}

async function deleteSession(userId) {
  const key = `auth:sessions:${userId}`;

  await redisService.remove({ key });

  return true;
}

async function getSession(userId) {
  const key = `auth:sessions:${userId}`;
  const session = await redisService.get({ key });

  if (!session || session === "") return false;

  return session;
}

module.exports = { createSession, createRefreshSession, deleteSession, getSession };
