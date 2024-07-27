const express = require("express");
const AWS = require("aws-sdk");
const router = express.Router();
const db = require("../db/dbConn");

// Initialize AWS Cognito
const cognito = new AWS.CognitoIdentityServiceProvider({
  region: process.env.AWS_REGION,
});

// Signup
router.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;

  const params = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: username,
    Password: password,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
    ],
  };

  try {
    const data = await cognito.signUp(params).promise();

    // Store user information in the database
    const query = `INSERT INTO users (username, email) VALUES (?, ?)`;
    db.query(query, [username, email], (err, results) => {
      if (err) {
        console.error("Error storing user information:", err);
        res.status(500).json({
          error: "Signup successful but failed to store user information",
        });
      } else {
        res.json({ message: "Signup successful", data });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Verifyy
router.post("/verify", async (req, res) => {
  const { username, code } = req.body;

  const params = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: username,
    ConfirmationCode: code,
  };

  try {
    const data = await cognito.confirmSignUp(params).promise();
    res.json({ message: "Email verified successfully", data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Signin
router.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: process.env.COGNITO_CLIENT_ID,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };

  try {
    const data = await cognito.initiateAuth(params).promise();
    res.json({ message: "Signin successful", data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
