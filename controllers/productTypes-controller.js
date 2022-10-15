const {
  getProductTypes,
  getProductTypeById,
  createProductType,
  updateProductType,
} = require("../services/productTypes-services");
const { getUserById } = require("../services/users-services");
const createError = require("http-errors");
module.exports = {
  getProductTypesController: async (req, res, next) => {
    console.log("getProductTypesController ....");
    try {
      const { page, limit } = req.params;
      const result = await getProductTypes(page, limit);
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
  getProductTypeByIdController: async (req, res, next) => {
    console.log("getProductTypeByIdController ....");
    try {
      const { id } = req.params;
      const result = await getProductTypeById(id);
      if (result && result.rows && result.rows.length === 0) {
        next(createError(404, "Not Found"));
        return;
      }
      return res.json(result.rows);
    } catch (e) {
      next(e);
    }
  },
  createProductTypeController: async (req, res, next) => {
    console.log("createProductTypeController ....");
    try {
      const { user_id } = req.body;
      const { productType_name, productType_description } =
        req.body.productType;
      const userRoleResult = await getUserById(user_id);
      if (
        userRoleResult &&
        userRoleResult.rows &&
        userRoleResult.rows.length > 0 &&
        userRoleResult.rows[0].usr_rol_id === 1 /* Admin role */
      ) {
        const result = await createProductType(
          productType_name,
          productType_description
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
  updateProductTypeController: async (req, res, next) => {
    console.log("updateProductTypeController ....");
    try {
      const { user_id } = req.body;
      const { productType_name, productType_description, productType_id } =
        req.body.productType;
      const userRoleResult = await getUserById(user_id);
      if (
        userRoleResult &&
        userRoleResult.rows &&
        userRoleResult.rows.length > 0 &&
        userRoleResult.rows[0].usr_rol_id === 1 /* Admin role */
      ) {
        const result = await updateProductType(
          productType_name,
          productType_description,
          productType_id
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
