const redis = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor(host = 'localhost', port = 6379) {
    this.client = redis.createClient({ host, port });
    this.client.on('error', (error) => console.log(error));
    this.client.ping();
  }

  isAlive() {
    return this.client.ping();
  }

  async get(key) {
    this.client.get = promisify(this.client.get);
    return this.client.get(key);
  }

  async set(key, value, duration) {
    this.client.set = promisify(this.client.set);
    return this.client.set(key, value, 'EX', duration);
  }

  async del(key) {
    return this.client.del(key);
  }
}

const redisClient = new RedisClient('localhost', 6379);

module.exports = redisClient;
