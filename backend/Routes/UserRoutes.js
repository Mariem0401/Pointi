const express = require("express");
const router = express.Router();
const { protectionMW, signup, login } = require("../Controller/authController");
const userController = require("../Controller/userController");

router.post("/signup", signup);
router.post("/login", login);
router.get("/",userController.getAllUsers , protectionMW );

module.exports = router;
