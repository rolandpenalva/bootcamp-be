const pool = require("../db/db");

module.exports = {
  getTransactions: async (page, limit) => {
    console.log("getTransactions ....");
    const result = await pool().query(
      ` SELECT t.trs_id, t.trs_name, t.trs_description, to_char(t.trs_date, 'YYYY-MM-DD HH24:MI:SS') trs_date ` +
        ` , t.trs_amount, t.trs_crr_id,c.crr_code, t.trs_type_id, tt.trs_type_name, t.trs_prd_from,pf.prd_alias pr_from_alias ` +
        ` , t.trs_prd_to, pt.prd_alias prd_to_alias, t.trs_move` +
        ` FROM db_transaction t, db_currency c, db_transaction_type tt, db_product pf, db_product pt ` +
        ` WHERE t.trs_crr_id = c.crr_id ` +
        ` AND t.trs_type_id = tt.trs_type_id ` +
        ` AND t.trs_prd_from = pf.prd_id ` +
        ` AND t.trs_prd_to = pt.prd_id ` +
        ` ORDER BY trs_date DESC ` +
        ` LIMIT ${limit} ` +
        ` OFFSET (${page} - 1) * ${limit} `
    );
    await pool.end;
    console.log("getTransactions - Result: " + result);
    return result;
  },
  getTransactionById: async (id) => {
    console.log("getTransactionById ....");
    const result = await pool().query(
      ` SELECT t.trs_id, t.trs_name, t.trs_description, to_char(t.trs_date, 'YYYY-MM-DD HH24:MI:SS') trs_date ` +
        ` , t.trs_amount, t.trs_crr_id,c.crr_code, t.trs_type_id, tt.trs_type_name, t.trs_prd_from,pf.prd_alias pr_from_alias ` +
        ` , t.trs_prd_to, pt.prd_alias prd_to_alias, t.trs_move` +
        ` FROM db_transaction t, db_currency c, db_transaction_type tt, db_product pf, db_product pt ` +
        ` WHERE t.trs_crr_id = c.crr_id ` +
        ` AND t.trs_type_id = tt.trs_type_id ` +
        ` AND t.trs_prd_from = pf.prd_id ` +
        ` AND t.trs_prd_to = pt.prd_id ` +
        ` AND t.trs_id = ${id} ` +
        ` ORDER BY trs_date DESC `
    );
    await pool.end;
    console.log("getTransactionById - Result: " + result);
    return result;
  },
  getTransactionsByDates: async (fromDate, toDate, page, limit) => {
    console.log("getTransactionByDates ....");
    const result = await pool().query(
      ` SELECT t.trs_id, t.trs_name, t.trs_description, to_char(t.trs_date, 'YYYY-MM-DD HH24:MI:SS') trs_date ` +
        ` , t.trs_amount, t.trs_crr_id,c.crr_code, t.trs_type_id, tt.trs_type_name, t.trs_prd_from,pf.prd_alias pr_from_alias ` +
        ` , t.trs_prd_to, pt.prd_alias prd_to_alias, t.trs_move` +
        ` FROM db_transaction t, db_currency c, db_transaction_type tt, db_product pf, db_product pt ` +
        ` WHERE t.trs_crr_id = c.crr_id ` +
        ` AND t.trs_type_id = tt.trs_type_id ` +
        ` AND t.trs_prd_from = pf.prd_id ` +
        ` AND t.trs_prd_to = pt.prd_id ` +
        ` AND t.trs_type_id <> 1 ` +
        ` AND t.trs_date >= TO_TIMESTAMP('${fromDate}','YYYY-MM-DD HH24:MI:SS') ` +
        ` AND t.trs_date <= TO_TIMESTAMP('${toDate}','YYYY-MM-DD HH24:MI:SS')` +
        ` UNION ` +
        ` SELECT t.trs_id, t.trs_name, t.trs_description, to_char(t.trs_date, 'YYYY-MM-DD HH24:MI:SS') trs_date ` +
        ` , t.trs_amount, t.trs_crr_id,c.crr_code, t.trs_type_id, tt.trs_type_name, null trs_prd_from, null pr_from_alias ` +
        ` , t.trs_prd_to, null prd_to_alias, t.trs_move` +
        ` FROM db_transaction t, db_currency c, db_transaction_type tt ` +
        ` WHERE t.trs_crr_id = c.crr_id ` +
        ` AND t.trs_type_id = tt.trs_type_id ` +
        ` AND t.trs_type_id = 1 ` +
        ` AND t.trs_date >= TO_TIMESTAMP('${fromDate}','YYYY-MM-DD HH24:MI:SS') ` +
        ` AND t.trs_date <= TO_TIMESTAMP('${toDate}','YYYY-MM-DD HH24:MI:SS')` +
        ` ORDER BY trs_date DESC ` +
        ` LIMIT ${limit} ` +
        ` OFFSET (${page} - 1) * ${limit} `
    );
    await pool.end;
    console.log("getTransactionByDates - Result: " + result);
    return result;
  },
  insertNewTransaction: async (
    transaction_Type,
    transaction_Name,
    transaction_Description,
    transaction_Amount,
    transaction_Currency,
    transaction_Account_From,
    transaction_Account_To
  ) => {
    console.log("insertNewTransaction ....");
    const result = await pool().query(
      ` DO $$ ` +
        ` BEGIN ` +
        ` insert into db_transaction (trs_name ` +
        ` , trs_description, trs_amount, trs_crr_id` +
        ` , trs_type_id, trs_prd_from, trs_prd_to, trs_move) ` +
        ` values('${transaction_Name}','${transaction_Description}'` +
        ` ,${transaction_Amount}, ${transaction_Currency} ` +
        ` ,${transaction_Type}, ${transaction_Account_From} ` +
        ` ,${transaction_Account_To},'ACC');  ` +
        ` update db_product set prd_balance = ` +
        ` (select prd_balance - ${transaction_Amount} where prd_id = ${transaction_Account_From} ) ` +
        ` where prd_id = ${transaction_Account_From}; ` +
        ` insert into db_transaction (trs_name ` +
        ` , trs_description, trs_amount, trs_crr_id ` +
        ` , trs_type_id, trs_prd_from, trs_prd_to, trs_move) ` +
        ` values('${transaction_Name}','${transaction_Description}'` +
        ` ,${transaction_Amount}, ${transaction_Currency} ` +
        ` ,${transaction_Type}, ${transaction_Account_From} ` +
        ` ,${transaction_Account_To},'DEB');  ` +
        ` update db_product set prd_balance = ` +
        ` (select prd_balance + ${transaction_Amount} where prd_id = ${transaction_Account_To} ) ` +
        ` where prd_id = ${transaction_Account_To}; ` +
        ` EXCEPTION WHEN OTHERS THEN ` +
        ` RAISE EXCEPTION 'My custom exception: %','Something when wrong'; ` +
        ` END $$`
    );
    await pool.end;
    console.log("insertNewTransaction - Result: " + JSON.stringify(result));
    return result;
  },
  insertNewPersonalTransaction: async (
    transaction_Type,
    transaction_Name,
    transaction_Description,
    transaction_Amount,
    transaction_Currency,
    transaction_move
  ) => {
    console.log("insertNewPersonalTransaction ....");
    const result = await pool().query(
      ` DO $$ ` +
        ` BEGIN ` +
        ` insert into db_transaction (trs_name ` +
        ` , trs_description, trs_amount, trs_crr_id` +
        ` , trs_type_id, trs_move) ` +
        ` values('${transaction_Name}','${transaction_Description}'` +
        ` ,${transaction_Amount}, ${transaction_Currency} ` +
        ` ,${transaction_Type},'${transaction_move}');  ` +
        ` EXCEPTION WHEN OTHERS THEN ` +
        ` RAISE EXCEPTION 'My custom exception: %','Something when wrong'; ` +
        ` END $$`
    );
    await pool.end;
    console.log("insertNewTransaction - Result: " + JSON.stringify(result));
    return result;
  },
  updateTransaction: async (transaction_description, transaction_id) => {
    console.log("updateTransaction ....");

    const result = await pool().query(
      ` update db_transaction set trs_description='${transaction_description}'` +
        ` where trs_id=${transaction_id}`
    );
    await pool.end;
    console.log("updateTransaction - Result: " + result);
    return result;
  },
};
