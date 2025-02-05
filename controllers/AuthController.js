const crypto = require('crypto');
const DBClient = require('../utils/db');
const redisClient = require('../utils/redis');
const { v4: uuid4 } = require('uuid');

class AuthController {
  static async getConnect(req, res) {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      res.status(401).json({error: 'Unauthorized'});
      return;
    }
    const b64Credentials = authHeader.split(' ')[1];
    const buffer = Buffer.from(b64Credentials, 'base64');
    const utf8Credentials = buffer.toString('utf-8');
    const [ email, password ] = utf8Credentials.split(':');
    const algorithm = crypto.createHash('sha1');
    algorithm.update(password);
    const hashedPassword = algorithm.digest('hex');
    const user = await DBClient.findUser({email, password: hashedPassword});
    if (!user) {
      res.status(401).json({error: 'Unauthorized'});
      return;
    }
    const token = uuid4();
    redisClient.set(`auth_${token}`, user._id, 24 * 60 * 60);
    res.status(200).json({token});
  }

  static async getDisconnect(req, res) {
    const token = req.get('X-Token');
    if (!token) {
      res.status(401).json({error: 'Unauthorized'});
      return;
    }
    const _id = await redisClient.get(`auth_${token}`);
    if (!_id) {
      res.status(401).json({error: 'Unauthorized'});
      return;
    }
    const user = await DBClient.findUser({_id});
    await redisClient.del(`auth_${token}`);
    if (!user) {
      res.status(401).json({error: 'Unauthorized'});
    }
    res.status(204).end();
  }
}

module.exports = AuthController;
