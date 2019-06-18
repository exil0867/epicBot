const Sequelize = require('sequelize');
const table = require('./table.js');

exports.sync = (dbHost, dbName, dbUser, dbPassword, dbTableName) => {
  const instance = new Sequelize('', dbUser, dbPassword, {
    host: dbHost,
    dialect: 'mysql',
    logging: false,
  });
  instance.query(`SHOW DATABASES LIKE '${dbName}'`).then(databases => {
    if (!Array.isArray(databases[0]) || !databases[0].length) {
      console.log('Couldnt\'t find a databases! Creating one...')
      instance.query(`CREATE DATABASE ${dbName}`).then(() => {
        table.sync(dbHost, dbName, dbUser, dbPassword, dbTableName);
      });
      return;
    }
    console.log('Database found!')
    table.sync(dbHost, dbName, dbUser, dbPassword, dbTableName);
  });
}
