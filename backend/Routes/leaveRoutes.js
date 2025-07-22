const express = require("express");
const router = express.Router();
const leaveController = require("../Controller/leaveController");
const { protectionMW, howCanDo } = require("../Controller/authController");
const {upload}=require("../utils/cloudinary")
// Employee routes
router.post('/', protectionMW,   upload.single("justificatif") ,leaveController.createLeaveRequest);
router.get('/my-leaves', protectionMW, leaveController.getMyLeaves);

// RH/Admin routes
router.patch('/:id', protectionMW, howCanDo('rh', 'admin'), leaveController.updateLeaveStatus);
router.get('/all', protectionMW, howCanDo('rh', 'admin'), leaveController.getAllLeavesForRH);

module.exports = router;