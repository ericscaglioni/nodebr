const IDb = require('../base/interfaceDb');
const Sequelize = require('sequelize');
class PostgreSQLConnection {
  static connect() {}
}
class PostgreSQLStrategy extends IDb {
  constructor(connection, schema) {
    super();
    this._connection = connection;
    this._schema = schema;
    
  }

 static async defineModel(connection, schema) {
    const model = connection.define(
      schema.name, schema.schema, schema.options
    )
    await model.sync()
    return model
  }

 static async connect() {
    const connection = new Sequelize(
      'heroes', //database
      'ericscaglioni', // user
      'minhasenhasecreta', //senha
      {
        host: 'localhost',
        dialect: 'postgres',
        // case sensitive
        quoteIdentifiers: false,
        //disable logging
        logging: false
        // dialectOptions: {
        //   ssl: true,
        }
    )
    return connection
  }

  async isConnected() {
    try {
      // await this._connect();
      await this._connection.authenticate();
      return true;
    } catch (error) {
      console.error('fail!', error);
      return false;
    }
  }

  create(item) {
    return this._schema.create(item, { raw: true });
  }

  read(item) {
    return this._schema.findAll({ where: item, raw: true });
  }

  update(id, item, upsert = false) {
    const fn = upsert ? 'upsert' : 'update'
    return this._schema[fn](item, { where: { id } });
  }
  delete(id) {
    const query = id ? { id } : {};
    return this._schema.destroy({ where: query });
  }
}

module.exports = PostgreSQLStrategy;
