const {
  getTransactionTypes,
  getTransactionTypeById,
  createTransactionType,
  updateTransactionType,
} = require("../services/transactionTypes-services");
const { getUserById } = require("../services/users-services");
const createError = require("http-errors");
module.exports = {
  getTransactionTypesController: async (req, res, next) => {
    console.log("getTransactionTypesController ....");
    try {
      const { page, limit } = req.params;
      const result = await getTransactionTypes(page, limit);
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
  getTransactionTypeByIdController: async (req, res, next) => {
    console.log("getTransactionTypeByIdController ....");
    try {
      const { id } = req.params;
      const result = await getTransactionTypeById(id);
      if (result && result.rows && result.rows.length === 0) {
        next(createError(404, "Not Found"));
        return;
      }
      return res.json(result.rows);
    } catch (e) {
      next(e);
    }
  },
  createTransactionTypeController: async (req, res, next) => {
    console.log("createProductTypeController ....");
    try {
      const { user_id } = req.body;
      const { transactionType_name, transactionType_description } =
        req.body.transactionType;
      const userRoleResult = await getUserById(user_id);
      if (
        userRoleResult &&
        userRoleResult.rows &&
        userRoleResult.rows.length > 0 &&
        userRoleResult.rows[0].usr_rol_id === 1 /* Admin role */
      ) {
        const result = await createTransactionType(
          transactionType_name,
          transactionType_description
        );
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
  updateTransactionTypeController: async (req, res, next) => {
    console.log("updateTransactionTypeController ....");
    try {
      const { user_id } = req.body;
      const {
        transactionType_name,
        transactionType_description,
        transactionType_id,
      } = req.body.transactionType;
      const userRoleResult = await getUserById(user_id);
      if (
        userRoleResult &&
        userRoleResult.rows &&
        userRoleResult.rows.length > 0 &&
        userRoleResult.rows[0].usr_rol_id === 1 /* Admin role */
      ) {
        const result = await updateTransactionType(
          transactionType_name,
          transactionType_description,
          transactionType_id
        );
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
