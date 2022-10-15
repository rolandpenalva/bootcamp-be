const {
  getUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
} = require("../services/users-services");
const createError = require("http-errors");
const bcrypt = require("bcrypt");
module.exports = {
  getUsersController: async (req, res, next) => {
    console.log("getUsersController ....");
    try {
      const { page, limit } = req.params;
      const result = await getUsers(page, limit);
      if (result && result.rows && result.rows.length === 0) {
        console.log("Error...");
        next(createError(404, "Not Found"));
        return;
      }
      return res.json(result.rows);
    } catch (e) {
      next(e);
    }
  },
  getUserByIdController: async (req, res, next) => {
    console.log("getUserByIdController ....");
    try {
      const { id } = req.params;
      const result = await getUserById(id);
      if (result && result.rows && result.rows.length === 0) {
        next(createError(404, "Not Found"));
        return;
      }
      return res.json(result.rows);
    } catch (e) {
      next(e);
    }
  },
  getUserByEmailController: async (req, res, next) => {
    console.log("getUserByEmailController ....");
    try {
      const { email } = req.params;
      const result = await getUserByEmail(email);
      if (result && result.rows && result.rows.length === 0) {
        next(createError(404, "Not Found"));
        return;
      }
      return res.json(result.rows);
    } catch (e) {
      next(e);
    }
  },
  createUserController: async (req, res, next) => {
    console.log("createUserController ....");
    try {
      const { user_name, user_password, user_rol, user_email } = req.body.user;
      console.log("user_password: " + user_password);
      const pass = await bcrypt.hashSync(user_password, 10);
      const result = await createUser(user_name, pass, user_rol, user_email);
    } catch (e) {
      next(e);
      return;
    }
    return res.status(200).json({ result: "Process Completed" });
  },
  updateUserController: async (req, res, next) => {
    console.log("updateUserController ....");
    try {
      let pass;
      const { user_name, user_password, user_role, user_status, user_id } =
        req.body.user;
      if (user_password) {
        pass = await bcrypt.hashSync(user_password, 10);
      }

      const result = await updateUser(
        user_name,
        pass,
        user_role,
        user_status,
        user_id
      );
    } catch (e) {
      next(e);
      return;
    }
    return res.status(200).json({ result: "Process Completed" });
  },
};
