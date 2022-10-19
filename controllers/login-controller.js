const createError = require("http-errors");
const bcrypt = require("bcrypt");
const {
  getUserByEmail,
  getUserByName,
  updateUser,
  updateUserLastLogin,
} = require("../services/users-services");
const {
  generateAccessToken,
  verifyToken,
} = require("../services/token-services");

module.exports = {
  loginController: async (req, res, next) => {
    try {
      const { user_name, user_password } = req.body.user;
      const userResult = await getUserByName(user_name);
      if (userResult && userResult.rows && userResult.rows.length > 0) {
        console.log(`Password: ${user_password}`);
        console.log(`Password: ${userResult.rows[0].usr_password}`);
        const login = await bcrypt.compareSync(
          user_password,
          userResult.rows[0].usr_password
        );
        console.log(login);
        if (login) {
          const [token, err] = await generateAccessToken(user_name);
          if (err) {
            next(createError(401, "Unauthorized"));
          } else {
            const result = await updateUserLastLogin(user_name);
            if (!result) {
              next(createError(500, "Internal Server Error"));
            }
            console.log(userResult.rows[0].usr_last_login);
            return res.json({
              user_name,
              user_email: userResult.rows[0].usr_email,
              user_rol: userResult.rows[0].usr_rol_id,
              user_last_login: userResult.rows[0].usr_last_login,
              token: token,
            });
          }
        } else {
          next(createError(401, "Unauthorized"));
          return;
        }
      } else {
        next(createError(401, "Unauthorized"));
        return;
      }
    } catch (e) {
      next(e);
      return;
    }
  },
  authenticateToken: async (req, res, next) => {
    try {
      const bearerHeader = req.headers["authorization"];
      if (typeof bearerHeader !== "undefined") {
        const [decoded, err] = await verifyToken(bearerHeader);
        console.log(decoded);
        if (err) {
          next(createError(403, err.message));
          return;
        } else {
          next();
        }
      } else {
        res.sendStatus(403);
      }
    } catch (e) {
      next(e);
      return;
    }
  },
};
