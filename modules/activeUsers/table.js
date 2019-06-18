require('dotenv').config();
const Sequelize = require('sequelize');


exports.sync = (dbHost, dbName, dbUser, dbPassword, dbTableName) => {
  const instance = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: 'mysql',
    logging: false,
  });
  instance.define(dbTableName, {
    id: {
      type: Sequelize.INTEGER,
      unique: true,
      primaryKey: true
    },
    user_tag: {
      type: Sequelize.STRING,
    },
    has_active_role: {
      type: Sequelize.BOOLEAN
    },
    preactive_data: {
      type: Sequelize.STRING,
    }
  }).sync().then(() => {
    console.log(`Creating/Syncing table: ${dbTableName}`)
  });
};
