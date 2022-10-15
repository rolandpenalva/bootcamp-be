const express = require("express");
const router = express.Router();

const {
  getProductTypesController,
  getProductTypeByIdController,
  createProductTypeController,
  updateProductTypeController,
} = require("../controllers/productTypes-controller");

router.get("/:page/:limit", getProductTypesController);
router.get("/:id", getProductTypeByIdController);
router.post("/create", createProductTypeController);
router.put("/update", updateProductTypeController);

module.exports = router;
