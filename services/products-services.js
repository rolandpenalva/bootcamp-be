const pool = require("../db/db");

module.exports = {
  getProducts: async (page, limit) => {
    console.log("getProducts ....");
    const result = await pool().query(
      ` select p.prd_id, p.prd_name, p.prd_alias, p.prd_balance, p.prd_type_id ` +
        ` ,pt.prd_type_name` +
        ` from db_product p, db_product_type pt ` +
        ` where p.prd_type_id=pt.prd_type_id` +
        ` LIMIT ${limit} ` +
        ` OFFSET (${page} - 1) * ${limit} `
    );
    await pool.end;
    console.log("getProducts - Result: " + result);
    return result;
  },
  getProductById: async (id) => {
    console.log("getProductById ....");
    const result = await pool().query(
      ` select p.prd_id, p.prd_name, p.prd_alias, p.prd_balance, p.prd_type_id ` +
        ` ,pt.prd_type_name` +
        ` from db_product p, db_product_type pt ` +
        ` where p.prd_type_id=pt.prd_type_id ` +
        ` and p.prd_id=${id}`
    );
    await pool.end;
    console.log("getProductById - Result: " + result);
    return result;
  },
  getProductsByUserId: async (id) => {
    console.log("getProductsByUserId ......");
    const result = await pool().query(
      ` select p.prd_id, p.prd_name, p.prd_alias, p.prd_balance, p.prd_type_id,p.prd_usr_id, p.prd_status ` +
        ` from db_product p ` +
        ` where p.prd_usr_id=${id}` +
        ` and p.prd_status=1 `
    );
    await pool.end;
    console.log("getProductsByUserId - Result: " + result);
    return result;
  },
  createProduct: async (
    product_name,
    product_alias,
    product_balance,
    product_type,
    product_user_id
  ) => {
    console.log("createProduct ....");
    const result = await pool().query(
      ` insert into db_product (prd_name, prd_alias, prd_balance, prd_type_id, prd_usr_id) ` +
        ` values('${product_name}','${product_alias}',${product_balance}, ${product_type}, ${product_user_id}) `
    );
    await pool.end;
    console.log("createProduct - Result: " + result);
    return result;
  },
  updateProduct: async (product_alias, product_status, id) => {
    console.log("updateUser ....");
    const query = buildUpdateQuery(product_alias, product_status, id);
    const result = await pool().query(query);
    await pool.end;
    console.log("updateUser - Result: " + result);
    return result;
  },
};

const buildUpdateQuery = (product_alias, product_status, id) => {
  let query = ` update db_product set `;
  let whereQuery = ` where prd_id = ${id} `;
  let restriction = false;

  if (product_alias) {
    query = restriction ? query + `,` : query;
    query = query + ` prd_alias = '${product_alias}' `;
    restriction = true;
  }
  if (product_status) {
    query = restriction ? query + `,` : query;
    query = query + ` prd_status = '${product_status}' `;
    restriction = true;
  }

  query = query + whereQuery;
  return query;
};
