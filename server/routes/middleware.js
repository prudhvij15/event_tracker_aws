const AWS = require("aws-sdk");
const cognito = new AWS.CognitoIdentityServiceProvider({
  region: process.env.AWS_REGION,
});
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

const client = jwksClient({
  jwksUri: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  //   console.log(token);
  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  jwt.verify(
    token.split(" ")[1],
    getKey,
    { algorithms: ["RS256"] },
    (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
      }
      req.user = decoded;
      next();
    }
  );
};

module.exports = verifyToken;
