const express = require("express");
const db = require("../db/dbConn");
const router = express.Router();

router.post("/events", (req, res) => {
  const { event_name, event_date } = req.body;

  const query = `INSERT INTO events (event_name, event_date) VALUES (?, DATE(?))`;
  db.query(query, [event_name, event_date], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error storing event");
    } else {
      res.send(`Event stored successfully`);
    }
  });
});

module.exports = router;
