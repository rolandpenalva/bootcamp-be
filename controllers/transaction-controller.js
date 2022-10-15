const {
  getTransactions,
  getTransactionById,
  getTransactionsByDates,
  insertNewTransaction,
  insertNewPersonalTransaction,
} = require("../services/transaction-services");
const {
  getProductsByUserId,
  getProductById,
} = require("../services/products-services");
const {
  getTransactionTypeById,
} = require("../services/transactionTypes-services");

const createError = require("http-errors");
module.exports = {
  getTransactionsController: async (req, res, next) => {
    console.log("getTransactionsController ....");
    try {
      const { page, limit } = req.params;
      const result = await getTransactions(page, limit);
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
  getTransactionByIdController: async (req, res, next) => {
    console.log("getTransactionByIdController ....");
    try {
      const { id } = req.params;
      const result = await getTransactionById(id);
      if (result && result.rows && result.rows.length === 0) {
        next(createError(404, "Not Found"));
        return;
      }
      return res.json(result.rows);
    } catch (e) {
      next(e);
    }
  },
  getTransactionsByDatesController: async (req, res, next) => {
    console.log("getTransactionByIdController ....");
    try {
      const { fromDate, toDate, page, limit } = req.params;
      const result = await getTransactionsByDates(
        fromDate,
        toDate,
        page,
        limit
      );
      if (!result) {
        next(createError(500, "Server Internal Error"));
        return;
      }
      return res.json(result.rows);
    } catch (e) {
      next(e);
    }
  },
  processTransactionController: async (req, res, next) => {
    const { user_Id } = req.body;
    const {
      transaction_Type,
      transaction_Name,
      transaction_Description,
      transaction_Amount,
      transaction_Currency,
      transaction_Account_From,
      transaction_Account_To,
      transaction_Move,
    } = req.body.transaction;
    //Check Transaction Type
    const transactionTypeResult = await getTransactionTypeById(
      transaction_Type
    );
    if (
      transactionTypeResult &&
      transactionTypeResult.rows[0].trs_type_id === 1
    ) {
      /* 1 Other */
      console.log("transactionType - Other");
      try {
        const result = await insertNewPersonalTransaction(
          transaction_Type,
          transaction_Name,
          transaction_Description,
          transaction_Amount,
          transaction_Currency,
          transaction_Move
        );
      } catch (e) {
        next(createError(500, "Server Internal Error"));
        return;
      }
    } else if (
      transactionTypeResult &&
      transactionTypeResult.rows[0].trs_type_id === 2
    ) {
      /* 2	Transfer between own Accounts*/
      console.log("transactionType - Transfer between own Accounts");
      const checkAccountsExistsResult = await checkAccountsExists(
        transaction_Account_From,
        transaction_Account_To
      );
      if (checkAccountsExistsResult) {
        const checkOwnerResult = await checkAccountsOwner(
          user_Id,
          transaction_Account_From,
          transaction_Account_To
        );
        if (checkOwnerResult) {
          const checkBalanceResult = await checkAccountFromBalance(
            transaction_Amount,
            transaction_Account_From
          );
          if (checkBalanceResult) {
            try {
              const result = await insertNewTransaction(
                transaction_Type,
                transaction_Name,
                transaction_Description,
                transaction_Amount,
                transaction_Currency,
                transaction_Account_From,
                transaction_Account_To
              );
            } catch (e) {
              next(createError(500, "Server Internal Error"));
              return;
            }
          } else {
            next(createError(400, "Bad Request - Insufficient Funds"));
            return;
          }
        } else {
          next(createError(400, "Bad Request"));
          return;
        }
      } else {
        next(createError(400, "Bad Request - Account not exists"));
        return;
      }
    } else if (
      transactionTypeResult &&
      transactionTypeResult.rows[0].trs_type_id === 3
    ) {
      /* 3	Transfer to a third Person */
      console.log("transactionType - Transfer to a third Person");
      const checkAccountsExistsResult = await checkAccountsExists(
        transaction_Account_From,
        transaction_Account_To
      );
      if (checkAccountsExistsResult) {
        const checkOwnerResult = await checkAccountsOwner(
          user_Id,
          transaction_Account_From,
          null
        );
        if (checkOwnerResult) {
          const checkBalanceResult = await checkAccountFromBalance(
            transaction_Amount,
            transaction_Account_From
          );
          if (checkBalanceResult) {
            try {
              const result = await insertNewTransaction(
                transaction_Type,
                transaction_Name,
                transaction_Description,
                transaction_Amount,
                transaction_Currency,
                transaction_Account_From,
                transaction_Account_To
              );
            } catch (e) {
              next(createError(500, "Server Internal Error"));
              return;
            }
          } else {
            next(createError(400, "Bad Request - Insufficient Funds"));
            return;
          }
        } else {
          next(createError(400, "Bad Request"));
          return;
        }
      } else {
        next(createError(400, "Bad Request - Account not exists"));
        return;
      }
    } else {
      /* Error .... */
      console.log("transactionType - Error");
      next(createError(501, "Not Implemented"));
      return;
    }

    return res.status(200).json({ result: "Transaction Completed" });
  },
};

const checkAccountsOwner = async (
  user_Id,
  transaction_Account_From,
  transaction_Account_To
) => {
  let trs_from = false;
  let trs_to = false;

  const userProducts = await getProductsByUserId(user_Id);
  if (userProducts && userProducts.rows && userProducts.rows.length > 0) {
    userProducts.rows.forEach((product) => {
      console.log(product.prd_id);
      if (product.prd_id === transaction_Account_From) {
        trs_from = true;
      } else if (product.prd_id === transaction_Account_To) {
        trs_to = true;
      }
    });
  }
  return transaction_Account_To
    ? trs_from && trs_to
      ? true
      : false
    : trs_from
    ? true
    : false;
};

const checkAccountFromBalance = async (
  transaction_Amount,
  transaction_Account_From
) => {
  let result = false;
  const account = await getProductById(transaction_Account_From);
  if (account && account.rows && account.rows.length > 0) {
    const accountAmount = account.rows[0].prd_balance;
    if (accountAmount > transaction_Amount) {
      result = true;
    } else result = false;
  }
  return result;
};

const checkAccountsExists = async (
  transaction_Account_From,
  transaction_Account_To
) => {
  let result = false;
  const accountFromExists = await getProductById(transaction_Account_From);
  const accountToExists = await getProductById(transaction_Account_To);

  if (accountFromExists && accountToExists) {
    if (accountFromExists.length > 0 && accountToExists.length > 0) {
      result = true;
    }
  }
  return result;
};
