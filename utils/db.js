const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    this.host = process.env.DB_HOST || '127.0.0.1';
    this.port = process.env.DB_PORT || 27017;
    this.dbName = process.env.DB_DATABASE || 'files_manager';
    this.client = MongoClient(`mongodb://${this.host}:${this.port}`, {
      useUnifiedTopology: true,
    });
    this.client.connect();
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    const database = this.client.db(this.dbName);
    const usersColllection = database.collection('users');
    return usersColllection.find({}).count();
  }

  async nbFiles() {
    const database = this.client.db(this.dbName);
    const filesCollection = database.collection('files');
    return filesCollection.find({}).count();
  }

  async findUser(attributes, options) {
    const database = this.client.db(this.dbName);
    const usersCollection = database.collection('users');
    if (options) {
      return usersCollection.aggregate([
        {
          $project: {
            id: '$_id',
            email: 1,
          },
        },
        {
          $project: {
            _id: 0,
          },
        },
      ]);
    }
    return usersCollection.findOne(attributes);
  }

  async newUser(obj) {
    const database = this.client.db(this.dbName);
    const usersCollection = database.collection('users');
    if (await this.findUser(obj)) {
      return false;
    }
    return usersCollection.insertOne(obj);
  }
}

const dbClient = new DBClient();

module.exports = dbClient;
