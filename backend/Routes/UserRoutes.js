const express = require("express");
const router = express.Router();
const { protectionMW, signup, login, howCanDo } = require("../Controller/authController");
const userController = require("../Controller/userController");

router.post("/signup", signup);
router.post("/addEmpl",  protectionMW , howCanDo("admin","rh"), userController.addEmploye);
router.post("/login", login);
router.get("/",userController.getAllUsers , protectionMW );
router.get("/:id/with-contracts", userController.getUserWithContracts);


router.get("/:id", protectionMW, userController.getUserById);

// Modifier un utilisateur
router.put("/:id", protectionMW, howCanDo("admin", "rh"), userController.updateUser);

// Supprimer un utilisateur
router.delete("/:id", protectionMW, howCanDo("admin", "rh"), userController.deleteUser);

module.exports = router;
