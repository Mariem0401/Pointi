
const express = require("express"); 
const router = express.Router();
const { protectionMW } = require("../Controller/authController");
const { getNotifications,markAllAsRead} = require("../Controller/NotificationController");

router.get("/", protectionMW, getNotifications);
router.patch("/mark-read", protectionMW, markAllAsRead);
// Supprimer une notification



module.exports = router;