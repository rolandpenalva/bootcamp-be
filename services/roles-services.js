const pool = require("../db/db");

module.exports = {
  getRoles: async (page, limit) => {
    console.log("getRoles ....");
    const result = await pool().query(
      `select * from db_user_role ` +
        ` LIMIT ${limit} ` +
        ` OFFSET (${page} - 1) * ${limit} `
    );
    await pool.end;
    console.log("getRoles - Result: " + result);
    return result;
  },
  getRoleById: async (id) => {
    console.log("getRoleById ....");
    const result = await pool().query(
      `select * from db_user_role where rol_id=${id}`
    );
    await pool.end;
    console.log("getRoleById - Result: " + result);
    return result;
  },
  createRole: async (role_name, role_description) => {
    console.log("createRole ....");
    const result = await pool().query(
      ` insert into db_user_role (rol_name, rol_description) ` +
        ` values('${role_name}','${role_description}') `
    );
    await pool.end;
    console.log("createRole - Result: " + result);
    return result;
  },
  updateRole: async (role_name, role_description, role_id) => {
    console.log("updateRole ....");
    const query = buildUpdateQuery(role_name, role_description, role_id);
    const result = await pool().query(query);
    await pool.end;
    console.log("updateRole - Result: " + result);
    return result;
  },
};

const buildUpdateQuery = (role_name, role_description, role_id) => {
  let query = ` update db_user_role set `;
  let whereQuery = ` where rol_id = ${role_id} `;
  let restriction = false;

  if (role_name) {
    query = restriction ? query + `,` : query;
    query = query + ` rol_name = '${role_name}' `;
    restriction = true;
  }
  if (role_description) {
    query = restriction ? query + `,` : query;
    query = query + ` rol_description = '${role_description}' `;
    restriction = true;
  }

  query = query + whereQuery;
  return query;
};
