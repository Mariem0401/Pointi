const Contract = require('../Model/Contract');
const User = require('../Model/User');
const pdf = require('html-pdf');
const fs = require('fs');
const path = require('path');
const contractTemplate = require('../templates/contractTemplate');

// Configuration PDF
const pdfOptions = {
  format: 'A4',
  border: { top: '20mm', right: '10mm', bottom: '20mm', left: '10mm' },
  timeout: 60000 // 60 secondes timeout pour la génération
};

// Création de contrat
exports.createContract = async (req, res) => {
  try {
    const { employeeId, contractType, startDate, endDate, position, salary, trialPeriod } = req.body;

    // Validation des données
    if (!employeeId || !contractType || !startDate || !position || !salary) {
      return res.status(400).json({ 
        status: 'fail', 
        message: 'Données manquantes pour la création du contrat' 
      });
    }

    // Vérification des droits
    if (!['RH', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ 
        status: 'fail', 
        message: 'Autorisation refusée' 
      });
    }

    if (employeeId === req.user.id) {
      return res.status(400).json({ 
        status: 'fail', 
        message: 'Vous ne pouvez pas créer votre propre contrat' 
      });
    }

    const employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ 
        status: 'fail', 
        message: 'Employé non trouvé' 
      });
    }

    if (contractType === 'CDD' && (!endDate || new Date(endDate) <= new Date(startDate))) {
      return res.status(400).json({ 
        status: 'fail', 
        message: 'Date de fin invalide pour un CDD' 
      });
    }

    const contractData = {
      employee: employeeId,
      rh: req.user.id,
      contractType,
      startDate,
      endDate: contractType === 'CDD' ? endDate : undefined,
      position,
      salary,
      trialPeriod,
      status: 'actif'
    };

    const newContract = await Contract.create(contractData);

    // === Génération du nom de fichier à partir du nom de l’employé ===
    const sanitizedName = employee.name
      .trim()
      .replace(/\s+/g, '_')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    
    const fileName = `contract_${sanitizedName}.pdf`;
    const pdfDir = path.join(__dirname, '../public/contracts');
    const pdfPath = path.join(pdfDir, fileName);

    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    // Génération HTML du contrat
    const html = contractTemplate({
      employee,
      rh: req.user,
      contract: newContract,
      company: req.company,
      date: new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
    });

    // Génération asynchrone du PDF
    await new Promise((resolve, reject) => {
      pdf.create(html, pdfOptions).toFile(pdfPath, async (err) => {
        if (err) {
          console.error('Erreur génération PDF:', err);
          await Contract.findByIdAndDelete(newContract._id);
          return reject(new Error('Erreur lors de la génération du PDF'));
        }

        newContract.pdfPath = `/contracts/${fileName}`;
        await newContract.save();
        resolve();
      });
    });

    res.status(201).json({
      status: 'success',
      data: {
        contract: newContract,
        pdfUrl: `${req.protocol}://${req.get('host')}${newContract.pdfPath}`
      }
    });

  } catch (err) {
    console.error('Erreur création contrat:', err);
    res.status(500).json({
      status: 'error',
      message: err.message || 'Erreur serveur lors de la création du contrat'
    });
  }
};


// Récupération du PDF
exports.getContractPdf = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate('employee', 'name email')
      .populate('rh', 'name email');

    if (!contract) {
      return res.status(404).json({ 
        status: 'fail', 
        message: 'Contrat non trouvé' 
      });
    }

    // Vérification des droits
    const isAuthorized = req.user.role === 'admin' || 
                         req.user.role === 'RH' || 
                         req.user.id === contract.employee._id.toString();

    if (!isAuthorized) {
      return res.status(403).json({ 
        status: 'fail', 
        message: 'Accès non autorisé' 
      });
    }

    const filePath = path.join(__dirname, `../public${contract.pdfPath}`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ 
        status: 'fail', 
        message: 'Fichier PDF non trouvé' 
      });
    }

    // Envoi du fichier avec le bon Content-Type
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="contrat_${contract.employee.name}.pdf"`);
    res.sendFile(filePath);

  } catch (err) {
    console.error('Erreur récupération PDF:', err);
    res.status(500).json({
      status: 'error',
      message: 'Erreur serveur lors de la récupération du contrat'
    });
  }
};

// Liste des contrats
exports.getAllContracts = async (req, res) => {
  try {
    let query = {};
    
    // Pour les employés normaux, ne montrer que leur contrat
    if (req.user.role === 'employee') {
      query.employee = req.user.id;
    } 
    // Pour les RH, montrer tous les contrats sauf les leurs
    else if (req.user.role === 'RH') {
      query.employee = { $ne: req.user.id };
    }

    const contracts = await Contract.find(query)
      .populate('employee', 'name email position')
      .populate('rh', 'name email')
      .sort({ startDate: -1 });

    res.status(200).json({
      status: 'success',
      results: contracts.length,
      data: { contracts }
    });

  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur serveur lors de la récupération des contrats'
    });
  }
};