const express = require("express");
const db = require("../db/dbConn");
const router = express.Router();
const verifyToken = require("./middleware");

router.post("/events", verifyToken, (req, res) => {
  const { event_name, event_date, description } = req.body;
  const user_id = req.user.sub; // Extract user_id from the token's `sub` field

  // Calculate notification_time
  const eventDateTime = new Date(event_date);
  const notificationTime = new Date(
    eventDateTime.getTime() - 12 * 60 * 60 * 1000
  );

  const insertEventQuery = `INSERT INTO events (event_name, event_date, description, user_id, notification_time) VALUES (?, ?, ?, ?, ?)`;

  // Insert the event
  db.query(
    insertEventQuery,
    [event_name, event_date, description, user_id, notificationTime],
    (err, results) => {
      if (err) {
        console.error("Error inserting event:", err);
        return res.status(500).send("Error inserting event");
      }
      res.send("Event stored successfully");
    }
  );
});

module.exports = router;
