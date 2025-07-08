const express = require("express");
const router = express.Router();
const { protectionMW, signup, login, howCanDo } = require("../Controller/authController");
const userController = require("../Controller/userController");

router.post("/signup", signup);
router.post("/addEmpl",  protectionMW , howCanDo("admin","rh"), userController.addEmploye);
router.post("/login", login);
router.get("/",userController.getAllUsers , protectionMW );
router.get("/:id/with-contracts", userController.getUserWithContracts);


module.exports = router;
