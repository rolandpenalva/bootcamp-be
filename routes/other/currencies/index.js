var express = require("express");
var router = express.Router();
const { Pool } = require("pg");
const db = require("../../db/db");

router.get("/", (req, res, next) => {
  if (db()) {
    const pool = new Pool(db());
    pool.connect();
    pool.query("select * from db_currency", (err, rest) => {
      if (err) {
        next(err);
      } else {
        res.send(rest.rows);
      }
      pool.end();
    });
  }
});

router.get("/:id", (req, res, next) => {
  if (db()) {
    const { id } = req.params;
    const pool = new Pool(db());
    pool.connect();
    pool.query(
      "select * from db_currenc where crr_id = $1",
      [id],
      (err, rest) => {
        if (err) {
          next(err);
        } else {
          res.send(rest.rows);
        }
        pool.end();
      }
    );
  }
});

module.exports = router;
