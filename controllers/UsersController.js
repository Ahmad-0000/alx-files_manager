const DBClient = require('../utils/db');
const crypto = require('crypto');
const shasum = crypto.createHash('sha1')

class UsersController {
  static async postNew(req, res) {
    const { email } = req.body;
    let { password } = req.body;
    if (!email) {
      res.status(400).send({ error: 'Missing email' });
    }
    if (!password) {
      res.status(400).send({ error: 'Missing password' });
    }
    if (await DBClient.findUser({ email })) {
      res.status(400).send({ error: 'Already exist' });
    }
    shasum.update(password);
    await DBClient.newUser({ email, password: shasum.digest('hex') });
    const result = await DBClient.findUser({ email, password }, { password: 0, _id: 1 });
    res.status(201).send(result);
  }
}

module.exports = UserController;
