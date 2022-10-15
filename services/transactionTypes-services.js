const pool = require("../db/db");

module.exports = {
  getTransactionTypes: async (page, limit) => {
    console.log("getTransactionTypes ....");
    const result = await pool().query(
      `select * from db_transaction_type ` +
        ` LIMIT ${limit} ` +
        ` OFFSET (${page} - 1) * ${limit} `
    );
    await pool.end;
    console.log("getTransactionTypes - Result: " + result);
    return result;
  },
  getTransactionTypeById: async (id) => {
    console.log("getTransactionTypesById ....");
    const result = await pool().query(
      `select * from db_transaction_type where trs_type_id=${id}`
    );
    await pool.end;
    console.log("getTransactionTypesById - Result: " + result);
    return result;
  },
  createTransactionType: async (
    transactionType_name,
    transactionType_description
  ) => {
    console.log("createTransactionType ....");
    const result = await pool().query(
      ` insert into db_transaction_type (trs_type_name, trs_type_description) ` +
        ` values('${transactionType_name}','${transactionType_description}') `
    );
    await pool.end;
    console.log("createTransactionType - Result: " + result);
    return result;
  },
  updateTransactionType: async (
    transactionType_name,
    transactionType_description,
    transactionType_id
  ) => {
    console.log("updateTransactionType ....");
    const query = buildUpdateQuery(
      transactionType_name,
      transactionType_description,
      transactionType_id
    );
    const result = await pool().query(query);
    await pool.end;
    console.log("updateTransactionType - Result: " + result);
    return result;
  },
};

const buildUpdateQuery = (
  transactionType_name,
  transactionType_description,
  transactionType_id
) => {
  let query = ` update db_transaction_type set `;
  let whereQuery = ` where trs_type_id = ${transactionType_id} `;
  let restriction = false;

  if (transactionType_name) {
    query = restriction ? query + `,` : query;
    query = query + ` trs_type_name = '${transactionType_name}' `;
    restriction = true;
  }
  if (transactionType_description) {
    query = restriction ? query + `,` : query;
    query = query + ` trs_type_description = '${transactionType_description}' `;
    restriction = true;
  }

  query = query + whereQuery;
  return query;
};
