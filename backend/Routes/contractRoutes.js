const express = require('express');
const router = express.Router();
const contractController = require('../Controller/contractController');
const { howCanDo, protectionMW } = require('../Controller/authController');

// Protection sur toutes les routes
router.use(protectionMW);

// Routes pour RH et Admin
router.post('/', howCanDo('RH', 'admin'), contractController.createContract);
router.get('/', howCanDo('RH', 'admin'), contractController.getAllContracts);

// Route accessible à tous les utilisateurs pour leur propre contrat
router.get('/:id/pdf', contractController.getContractPdf);

module.exports = router;