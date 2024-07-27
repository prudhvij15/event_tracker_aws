const express = require("express");
const setupDatabase = require("./db/createTable");
const events = require("./routes/events");
const auth = require("./routes/auth");

const app = express();
app.use(express.json());
(async () => {
  await setupDatabase();

  app.use("/api", events);
  app.use("/api/auth", auth);
  app.listen(5001, () => {
    console.log("Server started at port 5001");
  });
})();
