var express = require("express");
var router = express.Router();
const { Client } = require("pg");
const db = require("../../db/db");

router.get("/", (req, res, next) => {
  if (db()) {
    const client = new Client(db());
    client.connect();
    client.query("select * from db_transaction_type", (err, rest) => {
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
      "select * from db_transaction_type where trs_type_id = $1",
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

module.exports = router;
