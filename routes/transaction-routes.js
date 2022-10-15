const express = require("express");
const router = express.Router();

const {
  getTransactionsController,
  getTransactionByIdController,
  getTransactionsByDatesController,
  processTransactionController,
} = require("../controllers/transaction-controller");

router.get("/:page/:limit", getTransactionsController);
router.get("/:id", getTransactionByIdController);
router.get("/:fromDate/:toDate/:page/:limit", getTransactionsByDatesController);
router.post("/process", processTransactionController);

module.exports = router;
