const mysql = require("mysql");
const db = require("./dbConn");
const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ${process.env.database}`;
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    event_date DATETIME NOT NULL,
    description TEXT
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
