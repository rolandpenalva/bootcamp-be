const express = require("express");
const router = express.Router();

const {
  getUsersController,
  getUserByIdController,
  createUserController,
  updateUserController,
} = require("../controllers/users-controller");

router.get("/:page/:limit", getUsersController);
router.get("/:id", getUserByIdController);
router.post("/create", createUserController);
router.put("/update", updateUserController);

module.exports = router;
