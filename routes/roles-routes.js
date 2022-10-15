const express = require("express");
const router = express.Router();

const {
  getRolesController,
  getRoleByIdController,
  createRoleController,
  updateRoleController,
} = require("../controllers/roles-controller");

router.get("/:page/:limit", getRolesController);
router.get("/:id", getRoleByIdController);
router.post("/create", createRoleController);
router.put("/update", updateRoleController);

module.exports = router;
