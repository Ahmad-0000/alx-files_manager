const DBClient = require('../utils/db');

class UserController {
  static async postNew(req, res) {
    const { email } = req.body;
    const { password } = req.body;
    if (!email) {
      res.status(400).send({ error: 'Missing email' });
    }
    if (!password) {
      res.status(400).send({ error: 'Missing password' });
    }
    if (await DBClient.findUser({ email })) {
      res.status(400).send({ error: 'Already exist' });
    }
    await DBClient.newUser({ email, password });
    const result = await DBClient.findUser({ email, password }, { password: 0, _id: 1 });
    res.status(201).send(result);
  }
}

module.exports = UserController;
