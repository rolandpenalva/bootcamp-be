const express = require("express");
const router = express.Router();

const {
  getTransactionTypesController,
  getTransactionTypeByIdController,
  createTransactionTypeController,
  updateTransactionTypeController,
} = require("../controllers/transactionTypes-controller");

router.get("/:page/:limit", getTransactionTypesController);
router.get("/:id", getTransactionTypeByIdController);
router.post("/create", createTransactionTypeController);
router.put("/update", updateTransactionTypeController);

module.exports = router;
