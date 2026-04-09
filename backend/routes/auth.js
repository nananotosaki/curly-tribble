const express = require("express");
const router = express.Router();
const authCheck = require("../middleware/authCheck");
const userCheck = require("../middleware/userCheck");
const controller = require("../controllers/authcontroller");

// returns token
router.post("/login", controller.login);

router.post(
  "/register",
  [userCheck.checkDuplicateUsernameOrEmail],
  controller.register
);

router.get("/getUserData", [authCheck.verifyToken], controller.getUserData);

module.exports = router;