import expressRedisCache from 'express-redis-cache';
import redis from './clients/redis.js';

const cache = expressRedisCache({
  client: redis,
  expire: 60,
});

export default cache;
