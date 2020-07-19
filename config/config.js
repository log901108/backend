const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  development: {
    username: process.env.DBUSER,
    password: process.env.DBPASSWD,
    database: process.env.DBNAME,
    host: process.env.DBHOST,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  },
  test: {
    username: process.env.DBUSER,
    password: process.env.DBPASSWD,
    database: process.env.DBNAME,
    host: process.env.DBHOST,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  },
  production: {
    username: process.env.DBUSER,
    password: process.env.DBPASSWD,
    database: process.env.DBNAME,
    host: process.env.DBHOST,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  },
};
