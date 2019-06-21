const Sequelize = require('sequelize');

const sequelize = new Sequelize('EpicBot', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;
