const mysql = require("mysql");
const db = require("./dbConn");
const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ${process.env.database}`;
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_name VARCHAR(255) NOT NULL,
  event_date DATE  NOT NULL,
  description TEXT,
  user_id INT NOT NULL,
  notification_time DATE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
)
`;

const createUsersTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE

  )
`;

const setupDatabase = async () => {
  try {
    await db.query(createDatabaseQuery, (err) => {
      if (err) {
        console.error("Error creating database:", err.stack);
        return;
      }
      console.log("Database created or already exists.");

      db.query("USE events", (err) => {
        if (err) {
          console.error("Error switching database:", err.stack);
          return;
        }
        console.log("Switched to the 'events' database.");
        db.query(createUsersTableQuery, (err) => {
          if (err) {
            console.error("Error creating users table:", err.stack);
            return;
          }
          console.log("Users table created or already exists.");
        });

        db.query(createTableQuery, (err) => {
          if (err) {
            console.error("Error creating table:", err.stack);
            return;
          }
          console.log("Table created or already exists.");

          db.query("select * from  events", (err, result) => {
            console.log(result);
          });
        });
      });
    });
  } catch (err) {
    console.error("Error setting up database:", err.stack);
  }
};

module.exports = setupDatabase;
