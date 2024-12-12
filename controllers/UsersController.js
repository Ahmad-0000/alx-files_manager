const crypto = require('crypto');
const DBClient = require('../utils/db');

class UsersController {
  static async postNew(req, res) {
    const { email } = req.body;
    const sha = crypto.createHash('sha1');
    let { password } = req.body;
    if (!email) {
      res.status(400).send({ error: 'Missing email' });
    }
    if (!password) {
      res.status(400).json({ error: 'Missing password' });
    }
    if (await DBClient.findUser({ email })) {
      res.status(400).json({ error: 'Already exist' });
    }
    sha.update(password);
    password = sha.digest('hex');
    await DBClient.newUser({ email, password });
    let result = await DBClient.findUser({ email, password }, { password: 0 });
    result = await result.next();
    res.status(201).json(result);
  }
}

module.exports = UsersController;
