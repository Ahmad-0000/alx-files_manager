const redisClient = require('../utils/redis');
const DBClient = require('../utils/db');

class AppController {
  static getStatus(req, res) {
    res.status(200).send({ redis: redisClient.isAlive(), db: DBClient.isAlive() });
  }

  static async getStats(req, res) {
    res.status(200).send({ users: await DBClient.nbUsers(), files: await DBClient.nbFiles() });
  }
}

module.exports = AppController;
