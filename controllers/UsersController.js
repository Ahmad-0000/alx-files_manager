const crypto = require('crypto');
const DBClient = require('../utils/db');

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
}

module.exports = UsersController;
