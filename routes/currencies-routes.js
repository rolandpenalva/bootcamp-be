const express = require("express");
const router = express.Router();

const {
  getCurrenciesController,
  getCurrencyByIdController,
  createCurrencyController,
  updateCurrencyController,
} = require("../controllers/currencies-controller");

router.get("/:page/:limit", getCurrenciesController);
router.get("/:id", getCurrencyByIdController);
router.post("/create", createCurrencyController);
router.put("/update", updateCurrencyController);

module.exports = router;
