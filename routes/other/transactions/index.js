var express = require("express");
var router = express.Router();
const { Client } = require("pg");
const db = require("../../db/db");

router.get("/", (req, res, next) => {
  if (db()) {
    const client = new Client(db());
    client.connect();
    client.query("select * from db_transaction", (err, rest) => {
      if (err) {
        next(err);
      } else {
        res.send(rest.rows);
      }
      client.end();
    });
  }
});

router.get("/:id", (req, res, next) => {
  if (db()) {
    const { id } = req.params;
    const client = new Client(db());

    client.connect();
    client.query(
      "select * from db_transaction where trs_id = $1",
      [id],
      (err, rest) => {
        if (err) {
          next(err);
        } else {
          res.send(rest.rows);
        }
        client.end();
      }
    );
  }
});

router.get("/:fromDate/:toDate/:page/:limit", (req, res, next) => {
  if (db()) {
    const { fromDate, toDate, page, limit } = req.params;
    const client = new Client(db());
    client.connect();
    client.query(
      " SELECT trs_id, trs_name, trs_description, to_char(trs_date, 'YYYY-MM-DD HH24:MI:SS') trs_date, trs_amount, trs_crr_id, trs_type_id " +
        " , trs_prd_from, trs_prd_to, trs_move" +
        " FROM db_transaction " +
        " WHERE trs_date >= TO_TIMESTAMP($1,'YYYY-MM-DD HH24:MI:SS') " +
        " AND trs_date <= TO_TIMESTAMP($2,'YYYY-MM-DD HH24:MI:SS')" +
        " ORDER BY trs_date DESC " +
        " LIMIT $4 " +
        " OFFSET ($3 - 1) * $4 ",
      [fromDate, toDate, page, limit],
      (err, rest) => {
        if (err) {
          next(err);
        } else {
          res.send(rest.rows);
        }
        client.end();
      }
    );
  }
});

module.exports = router;
