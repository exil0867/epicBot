require('dotenv').config();
const database = require('./database');

database.sync(process.env.DB_HOST, process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, process.env.ACTIVE_USERS_TABLE_NAME);
