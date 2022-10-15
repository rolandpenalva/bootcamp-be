const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
} = require("../services/products-services");
const { getProductTypeById } = require("../services/productTypes-services");
const { getUserById } = require("../services/users-services");
const createError = require("http-errors");
module.exports = {
  getProductsController: async (req, res, next) => {
    console.log("getProductsController ....");
    try {
      const { page, limit } = req.params;
      const result = await getProducts(page, limit);
      console.log(result);
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
  getProductByIdController: async (req, res, next) => {
    console.log("getProductByIdController ....");
    try {
      const { id } = req.params;
      const result = await getProductById(id);
      console.log("Result: " + result);
      if (result && result.rows && result.rows.length === 0) {
        next(createError(404, "Not Found"));
        return;
      }
      return res.json(result.rows);
    } catch (e) {
      next(e);
    }
  },
  createProductController: async (req, res, next) => {
    console.log("createProductController ....");
    try {
      const { user_id } = req.body;
      const { product_alias, product_balance, product_type, product_user_id } =
        req.body.product;
      const userRoleResult = await getUserById(user_id);
      console.log("createProductController ...");
      if (
        userRoleResult &&
        userRoleResult.rows &&
        userRoleResult.rows.length > 0 &&
        userRoleResult.rows[0].usr_rol_id === 1 /* Admin role */
      ) {
        const productTypeResult = await getProductTypeById(product_type);
        let name;
        if (
          productTypeResult &&
          productTypeResult.rows &&
          productTypeResult.rows.length > 0
        ) {
          name = productTypeResult.rows[0].prd_type_name;
          const result = await createProduct(
            name,
            product_alias,
            product_balance,
            product_type,
            product_user_id
          );
        } else {
          next(createError(404, "Bad Request"));
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
    return res.status(200).json({ result: "Process Completed" });
  },
  updateProductController: async (req, res, next) => {
    console.log("updateProductController ....");
    try {
      let pass;
      const { user_id } = req.body;
      const { product_alias, product_status, product_id } = req.body.product;
      if (product_status) {
        const userRoleResult = await getUserById(user_id);
        if (
          userRoleResult &&
          userRoleResult.rows &&
          userRoleResult.rows.length > 0 &&
          userRoleResult.rows[0].usr_rol_id === 1 /* Admin role */
        ) {
          const result = await updateProduct(
            product_alias,
            product_status,
            product_id
          );
        } else {
          next(createError(401, "Unauthorized"));
          return;
        }
      } else {
        const result = await updateProduct(product_alias, null, product_id);
      }
    } catch (e) {
      next(e);
      return;
    }
    return res.status(200).json({ result: "Process Completed" });
  },
};
