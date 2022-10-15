const {
  getCurrencies,
  getCurrencyById,
  createCurrency,
  updateCurrency,
} = require("../services/currencies-services");
const { getUserById } = require("../services/users-services");
const createError = require("http-errors");

module.exports = {
  getCurrenciesController: async (req, res, next) => {
    console.log("getCurrenciesController ....");
    try {
      const { page, limit } = req.params;
      const result = await getCurrencies(page, limit);
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
  getCurrencyByIdController: async (req, res, next) => {
    console.log("getCurrencyByIdController ....");
    try {
      const { id } = req.params;
      const result = await getCurrencyById(id);
      console.log("getCurrencyByIdController: " + result);
      if (result && result.rows && result.rows.length === 0) {
        console.log("Error");
        next(createError(404, "Not Found"));
        return;
      }
      return res.json(result.rows);
    } catch (e) {
      console.log("Error: " + e.message);
      next(e);
    }
  },
  createCurrencyController: async (req, res, next) => {
    console.log("createCurrencyController ....");
    try {
      const { user_id } = req.body;
      const { currency_code, currency_description } = req.body.currency;
      const userRoleResult = await getUserById(user_id);
      if (
        userRoleResult &&
        userRoleResult.rows &&
        userRoleResult.rows.length > 0 &&
        userRoleResult.rows[0].usr_rol_id === 1 /* Admin role */
      ) {
        const result = await createCurrency(
          currency_code,
          currency_description
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
  updateCurrencyController: async (req, res, next) => {
    console.log("updateCurrencyController ....");
    try {
      const { user_id } = req.body;
      const { currency_code, currency_description, currency_id } =
        req.body.currency;
      const userRoleResult = await getUserById(user_id);
      if (
        userRoleResult &&
        userRoleResult.rows &&
        userRoleResult.rows.length > 0 &&
        userRoleResult.rows[0].usr_rol_id === 1 /* Admin role */
      ) {
        const result = await updateCurrency(
          currency_code,
          currency_description,
          currency_id
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
