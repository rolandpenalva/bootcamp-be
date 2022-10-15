const {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
} = require("../services/roles-services");
const { getUserById } = require("../services/users-services");
const createError = require("http-errors");
module.exports = {
  getRolesController: async (req, res, next) => {
    console.log("getRolesController ....");
    try {
      const { page, limit } = req.params;
      const result = await getRoles(page, limit);
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
  getRoleByIdController: async (req, res, next) => {
    console.log("getRoleByIdController ....");
    try {
      const { id } = req.params;
      const result = await getRoleById(id);
      if (result && result.rows && result.rows.length === 0) {
        next(createError(404, "Not Found"));
        return;
      }
      return res.json(result.rows);
    } catch (e) {
      next(e);
    }
  },
  createRoleController: async (req, res, next) => {
    console.log("createRoleController ....");
    try {
      const { user_id } = req.body;
      const { role_name, role_description } = req.body.role;
      const userRoleResult = await getUserById(user_id);
      if (
        userRoleResult &&
        userRoleResult.rows &&
        userRoleResult.rows.length > 0 &&
        userRoleResult.rows[0].usr_rol_id === 1 /* Admin role */
      ) {
        const result = await createRole(role_name, role_description);
      } else {
        next(createError(401, "Unauthorized"));
        return;
      }
    } catch (e) {
      next(e);
      return;
    }
    return res.status(200).json({ result: "Process Completed" });
  },
  updateRoleController: async (req, res, next) => {
    console.log("updateRoleController ....");
    try {
      const { user_id } = req.body;
      const { role_name, role_description, role_id } = req.body.role;
      const userRoleResult = await getUserById(user_id);
      if (
        userRoleResult &&
        userRoleResult.rows &&
        userRoleResult.rows.length > 0 &&
        userRoleResult.rows[0].usr_rol_id === 1 /* Admin role */
      ) {
        const result = await updateRole(role_name, role_description, role_id);
      } else {
        next(createError(401, "Unauthorized"));
        return;
      }
    } catch (e) {
      next(e);
      return;
    }
    return res.status(200).json({ result: "Process Completed" });
  },
};
