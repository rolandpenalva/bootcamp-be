const pool = require("../db/db");

module.exports = {
  getCurrencies: async (page, limit) => {
    console.log("getCurrencies ....");
    const result = await pool().query(
      `select * from db_currency ` +
        ` LIMIT ${limit} ` +
        ` OFFSET (${page} - 1) * ${limit} `
    );
    await pool.end;
    console.log("getCurrencies - Result: " + result);
    console.log("Test......");
    return result;
  },
  getCurrencyById: async (id) => {
    console.log("getCurrency ....");
    const result = await pool().query(
      `select * from db_currency where crr_id=${id}`
    );
    await pool.end;
    console.log("getCurrency - Result: " + result);
    return result;
  },
  createCurrency: async (currency_code, currency_description) => {
    console.log("createCurrency ....");
    const result = await pool().query(
      ` insert into db_currency (crr_code, crr_description) ` +
        ` values('${currency_code}','${currency_description}') `
    );
    await pool.end;
    console.log("createCurrency - Result: " + result);
    return result;
  },
  updateCurrency: async (currency_code, currency_description, currency_id) => {
    console.log("updateCurrency ....");
    const query = buildUpdateQuery(
      currency_code,
      currency_description,
      currency_id
    );
    const result = await pool().query(query);
    await pool.end;
    console.log("updateCurrency - Result: " + result);
    return result;
  },
};

const buildUpdateQuery = (currency_code, currency_description, currency_id) => {
  let query = ` update db_currency set `;
  let whereQuery = ` where crr_id = ${currency_id} `;
  let restriction = false;

  if (currency_code) {
    query = restriction ? query + `,` : query;
    query = query + ` crr_code = '${currency_code}' `;
    restriction = true;
  }
  if (currency_description) {
    query = restriction ? query + `,` : query;
    query = query + ` crr_description = '${currency_description}' `;
    restriction = true;
  }

  query = query + whereQuery;
  return query;
};
