// Path: ../Controller/departementController.js (This is where this code should reside)

const Departement = require("../Model/Departement"); // Make sure this path is correct for your project structure

// Create a department
exports.createDepartement = async (req, res) => {
  try {
    const departement = await Departement.create(req.body);
    res.status(201).json({ status: "success", data: departement });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// Get all departments
exports.getAllDepartements = async (req, res) => {
  try {
    const departements = await Departement.find();
    res.status(200).json({ status: "success", data: departements });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// Delete a department
exports.deleteDepartement = async (req, res) => {
  try {
    await Departement.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: "success", message: "Supprimé avec succès" });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};