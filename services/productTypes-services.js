const pool = require("../db/db");

module.exports = {
  getProductTypes: async (page, limit) => {
    console.log("getProductTypes ....");
    const result = await pool().query(
      `select * from db_product_type ` +
        ` LIMIT ${limit} ` +
        ` OFFSET (${page} - 1) * ${limit} `
    );
    await pool.end;
    console.log("getProductTypes - Result: " + result);
    return result;
  },
  getProductTypeById: async (id) => {
    console.log("getProductTypeById ....");
    const result = await pool().query(
      `select * from db_product_type where prd_type_id=${id}`
    );
    await pool.end;
    console.log("getProductTypeById - Result: " + result);
    return result;
  },
  createProductType: async (productType_name, productType_description) => {
    console.log("createProductType ....");
    const result = await pool().query(
      ` insert into db_product_type (prd_type_name, prd_type_description) ` +
        ` values('${productType_name}','${productType_description}') `
    );
    await pool.end;
    console.log("createProductType - Result: " + result);
    return result;
  },
  updateProductType: async (
    productType_name,
    productType_description,
    productType_id
  ) => {
    console.log("updateProductType ....");
    const query = buildUpdateQuery(
      productType_name,
      productType_description,
      productType_id
    );
    const result = await pool().query(query);
    await pool.end;
    console.log("updateProductType - Result: " + result);
    return result;
  },
};

const buildUpdateQuery = (
  productType_name,
  productType_description,
  productType_id
) => {
  let query = ` update db_product_type set `;
  let whereQuery = ` where prd_type_id = ${productType_id} `;
  let restriction = false;

  if (productType_name) {
    query = restriction ? query + `,` : query;
    query = query + ` prd_type_name = '${productType_name}' `;
    restriction = true;
  }
  if (productType_description) {
    query = restriction ? query + `,` : query;
    query = query + ` prd_type_description = '${productType_description}' `;
    restriction = true;
  }

  query = query + whereQuery;
  return query;
};
