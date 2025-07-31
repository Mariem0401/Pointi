

const express = require("express");
const { protectionMW, howCanDo} = require("../Controller/authController");
const router = express.Router();
const {
  createDepartement,
  getAllDepartements,
  deleteDepartement,
  updateDepartement
} = require("../Controller/departementController");
console.log("protectionMW:", protectionMW);
console.log("howCanDo:", howCanDo);
console.log("createDepartement:", createDepartement);
// Routes de base
router.post("/", protectionMW , howCanDo("admin","rh") , createDepartement);
router.get("/" , protectionMW , howCanDo("admin","rh") , getAllDepartements);
router.delete("/:id", protectionMW , howCanDo("admin","rh") , deleteDepartement);
router.put("/:id", protectionMW , howCanDo("admin","rh") , updateDepartement);
module.exports = router;
