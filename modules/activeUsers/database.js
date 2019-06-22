const Sequelize = require('sequelize');
const table = require('./table');

exports.run = (dbHost, dbDialect, dbName, dbUser, dbPassword, dbTableName) => {
  const sequelize = new Sequelize('', dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: dbDialect,
    logging: false
  });
  sequelize.query(`SHOW DATABASES LIKE '${dbName}'`).then(databases => {
    if (!Array.isArray(databases[0]) || !databases[0].length) {
      console.log('Couldnt\'t find a databases! Creating one...')
      sequelize.query(`CREATE DATABASE ${dbName}`).then(() => {
        table.sync(dbHost, dbName, dbUser, dbPassword, dbTableName);
      });
      return;
    }
    console.log('Database found!')
    table.sync(dbHost, dbName, dbUser, dbPassword, dbTableName);
  });
}
