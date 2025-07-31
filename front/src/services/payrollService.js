// src/services/payrollService.js
export const getPaySlips = async () => {
  // Simulation de données - À remplacer par un appel API réel
  return [
    {
      id: 1,
      employee: { name: "Jean Dupont", matricule: "EMP001" },
      period: "2023-06-01",
      grossSalary: 3500,
      deductions: 500,
      netSalary: 3000,
      status: "paid"
    },
    // Ajoutez d'autres bulletins si nécessaire
  ];
};

export const downloadPaySlip = async (id, format) => {
  // Simulation de téléchargement
  console.log(`Téléchargement du bulletin ${id} en format ${format}`);
  // Implémentez ici la logique réelle de téléchargement
};