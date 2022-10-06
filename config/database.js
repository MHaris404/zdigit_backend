

// require("dotenv").config()

const DB_HOST = process.env.DB_HOST
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_DATABASE = process.env.DB_DATABASE
const DB_PORT = process.env.DB_PORT

module.exports = {
      host: 'sodabaz.com',
      port: 3306,
      user: 'sodabaz_ebox_2',
      password: 'sodabaz_ebox_2',
      database: 'sodabaz_ebox_erp',
      connectTimeout : 60 * 60 * 1000,
      acquireTimeout : 60 * 60 * 1000,
      multipleStatements: true,
      waitForConnections: true,
      connectionLimit: 100,
};
