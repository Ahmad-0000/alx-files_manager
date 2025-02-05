const crypto = require('crypto');
const DBClient = require('../utils/db');
const redisClient = require('../utils/redis');
const { ObjectId } = require('mongodb');

class UsersController {
  static async postNew(req, res) {
    const { email } = req.body;
    const sha = crypto.createHash('sha1');
    let { password } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Missing email' });
      return;
    }
    if (!password) {
      res.status(400).json({ error: 'Missing password' });
      return;
    }
    if (await DBClient.findUser({ email })) {
      res.status(400).send({ error: 'Already exist' });
      return;
    }
    sha.update(password);
    password = sha.digest('hex');
    await DBClient.newUser({ email, password });
    const result = await DBClient.findUser({ email, password }, { password: 0 });
    delete result.password;
    result.id = result._id;
    delete result._id;
    res.status(201).json(result);
  }

  static async getMe (req, res) {
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
    const user = await DBClient.findUser({ _id : new ObjectId(_id)});
    if (!user) {
      res.status(401).json({error: 'Unauthorized'});
      return;
    }
    delete user.password;
    res.json(user);
  }
}

module.exports = UsersController;
