const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || 27017;
    this.dbName = process.env.DB_DATABASE || 'files_manager';
    this.client = MongoClient(`mongodb://${this.host}:${this.port} || '27017'`, {
      useNewUrlParser: true,
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
      return usersCollection.findOne(attributes, options);
    }
    return usersCollection.findOne(attributes);
  }

  async newUser(obj) {
    const database = this.client.db(this.dbName);
    const usersCollection = database.collection('users');
    if (await this.findUser(obj)) {
      return false;
    }
    return usersCollection.insert(obj);
  }
}

const dbClient = new DBClient();

module.exports = dbClient;
