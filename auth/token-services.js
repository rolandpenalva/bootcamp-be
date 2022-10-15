const jwt = require("async-jsonwebtoken");

module.exports = {
  generateAccessToken: async (user_name) => {
    console.log("generateAccessToken ...... ");
    console.log(user_name);
    console.log(process.env.TOKEN_SECRET_PHRASE);
    const [token, err] = await jwt.sign(
      { id: user_name },
      process.env.TOKEN_SECRET_PHRASE,
      { expiresIn: 3600 }
    );
    return [token, err];
  },
  verifyToken: async (authorization) => {
    console.log("verifyToken ......");
    const authHeader = authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return null;
    const [decoded, err] = await jwt.verify(
      token,
      process.env.TOKEN_SECRET_PHRASE
    );
    return [decoded, err];
  },
};
