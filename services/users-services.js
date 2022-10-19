const pool = require("../db/db");

module.exports = {
  getUsers: async (page, limit) => {
    console.log("getUsers ....");
    const result = await pool().query(
      `select u.usr_id, u.usr_name, u.usr_password, to_char(u.usr_creation, 'YYYY-MM-DD HH24:MI:SS') usr_creation ` +
        ` ,u.usr_rol_id, r.rol_name, u.usr_email, to_char(u.usr_last_login, 'YYYY-MM-DD HH24:MI:SS') usr_last_login , u.usr_status ` +
        ` from db_user u, db_user_role r ` +
        ` where u.usr_rol_id = r.rol_id` +
        ` LIMIT ${limit} ` +
        ` OFFSET (${page} - 1) * ${limit} `
    );
    await pool.end;
    console.log("getUsers - Result: " + result);
    return result;
  },
  getUserById: async (id) => {
    console.log("getUserById ....");
    const result = await pool().query(
      `select u.usr_id, u.usr_name, u.usr_password, to_char(u.usr_creation, 'YYYY-MM-DD HH24:MI:SS') usr_creation ` +
        ` ,u.usr_rol_id, r.rol_name, u.usr_email, to_char(u.usr_last_login, 'YYYY-MM-DD HH24:MI:SS') usr_last_login , u.usr_status ` +
        ` from db_user u, db_user_role r ` +
        ` where u.usr_rol_id = r.rol_id` +
        ` and u.usr_id=${id}`
    );
    await pool.end;
    console.log("getUserById - Result: " + result);
    return result;
  },
  createUser: async (user_name, user_password, user_rol, user_email) => {
    console.log("createUser ....");
    const result = await pool().query(
      ` insert into db_user (usr_name, usr_password, usr_rol_id, usr_email) ` +
        ` values('${user_name}','${user_password}',${user_rol}, '${user_email}') `
    );
    await pool.end;
    console.log("createUser - Result: " + result);
    return result;
  },
  getUserByEmail: async (user_email) => {
    console.log("getUserByEmail ....");
    console.log(
      ` select usr_name, usr_email, usr_password ` +
        ` from db_user ` +
        ` where usr_email like '${user_email}'`
    );
    const result = await pool().query(
      ` select usr_name, usr_email, usr_password ` +
        ` from db_user ` +
        ` where usr_email like '${user_email}%'`
    );

    await pool.end;
    console.log("getUserByEmail - Result: " + result);
    return result;
  },
  getUserByName: async (user_name) => {
    console.log("getUserByName ....");
    console.log(
      ` select u.usr_name, u.usr_email, u.usr_password, u.usr_rol_id, to_char(u.usr_last_login, 'YYYY-MM-DD HH24:MI:SS') usr_last_login ` +
        ` from db_user u ` +
        ` where u.usr_name like '${user_name}'`
    );
    const result = await pool().query(
      ` select u.usr_name, u.usr_email, u.usr_password, u.usr_rol_id, to_char(u.usr_last_login, 'YYYY-MM-DD HH24:MI:SS') usr_last_login ` +
        ` from db_user u ` +
        ` where u.usr_name like '${user_name}'`
    );

    await pool.end;
    console.log("getUserByName - Result: " + result);
    return result;
  },
  updateUser: async (
    user_name,
    user_password,
    user_role,
    user_status,
    user_id
  ) => {
    console.log("updateUser ....");
    const query = buildUpdateQuery(
      user_name,
      user_password,
      user_role,
      user_status,
      user_id
    );
    const result = await pool().query(query);
    await pool.end;
    console.log("updateUser - Result: " + result);
    return result;
  },
  updateUserLastLogin: async (user_id) => {
    console.log("updateLastLogin ....");
    const query = ` update db_user set usr_last_login = NOW() where usr_name like '${user_id}' `;
    const result = await pool().query(query);
    await pool.end;
    console.log("updateLastLogin - Result: " + result);
    return result;
  },
};

const buildUpdateQuery = (
  user_name,
  user_password,
  user_role,
  user_status,
  user_id
) => {
  let query = ` update db_user set `;
  let whereQuery = ` where usr_id = ${user_id} `;
  let restriction = false;

  if (user_name) {
    query = restriction ? query + `,` : query;
    query = query + ` usr_name = '${user_name}' `;
    restriction = true;
  }
  if (user_password) {
    query = restriction ? query + `,` : query;
    query = query + ` usr_password = '${user_password}' `;
    restriction = true;
  }
  if (user_role) {
    query = restriction ? query + `,` : query;
    query = query + ` usr_rol = ${user_role} `;
    restriction = true;
  }
  if (user_status) {
    query = restriction ? query + `,` : query;
    query = query + ` usr_status = ${user_status} `;
    restriction = true;
  }

  query = query + whereQuery;
  return query;
};
