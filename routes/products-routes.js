const express = require("express");
const router = express.Router();

const {
  getProductsController,
  getProductByIdController,
  createProductController,
  updateProductController,
} = require("../controllers/products-controller");

router.get("/:page/:limit", getProductsController);
router.get("/:id", getProductByIdController);
router.post("/create", createProductController);
router.put("/update", updateProductController);

module.exports = router;
