// src/services/leaveService.js
export const getLeaveRequests = async () => {
  // Données de simulation - À remplacer par un appel API réel
  return [
    {
      id: 1,
      employee: { id: 1, name: "Jean Dupont" },
      type: "Congé annuel",
      startDate: "2023-06-01",
      endDate: "2023-06-07",
      status: "approved",
      reason: "Vacances"
    },
    {
      id: 2,
      employee: { id: 2, name: "Marie Martin" },
      type: "Maladie",
      startDate: "2023-06-10",
      endDate: "2023-06-12",
      status: "pending",
      reason: "Grippe"
    }
  ];
};

export const getLeaveBalance = async (employeeId) => {
  return {
    annual: 15,
    sick: 10,
    taken: 5
  };
};