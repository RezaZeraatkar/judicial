require("dotenv").config();
const mysql = require("mysql2");
const cron = require("node-cron");
const backupDatabase = require("../../utils/backupDB");

const dboptions = {
  connectionLimit: 10,
  password: process.env.PASSWORD,
  user: process.env.USER,
  database: process.env.DB_NAME,
  host: process.env.HST,
  port: process.env.DB_PORT,
  timezone: "Asia/Tehran", // Set the time zone to Tehran
  // schema: {
  //   tableName: "sessions",
  //   columnNames: {
  //     session_id: "session_id",
  //     expires: "expires",
  //     data: "data",
  //   },
  // },
};

const pool = mysql.createPool(dboptions);

// Ping database to check for common exception errors.
pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Database connection was closed.");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("Database has too many connections.");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("Database connection was refused.");
    }
  } else {
    console.log("DB connection successfully stablished!");
    // Schedule the backup to run every day at 11 AM
    // * * * * *
    // | | | | |
    // | | | | +----- Day of the Week (0 - 7) (Sunday is 0 or 7)
    // | | | +------- Month (1 - 12)
    // | | +--------- Day of the Month (1 - 31)
    // | +----------- Hour (0 - 23)
    // +------------- Minute (0 - 59)
    // if (process.env.NODE_ENV === "production") {
    cron.schedule("00 11 * * *", () => {
      // console.log("test");
      backupDatabase(connection);
    });
    // }
  }

  if (connection) pool.releaseConnection(connection);
});

module.exports = pool.promise();
