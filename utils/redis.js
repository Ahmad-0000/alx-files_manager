const redis = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.client.on('error', (error) => console.log(error));
    this.client.ping();
  }

  isAlive() {
    return this.client.ping();
  }

  async get(key) {
    const promisedGet = promisify(this.client.get).bind(this.client);
    return promisedGet(key);
  }

  async set(key, value, duration) {
    const promisedSet= promisify(this.client.set).bind(this.client);
    return promisedSet(key, value, 'EX', duration);
  }

  async del(key) {
    return this.client.del(key);
  }
}

const redisClient = new RedisClient();

module.exports = redisClient;
