const Attendance = require("../Model/Attendance");
const LeaveRequest = require("../Model/leaveRequestModel");
const User = require("../Model/User");
const Contract = require('../Model/Contract');
const moment = require('moment-timezone');

exports.calculateMonthlySalary = async (req, res) => {
  try {
    const { name } = req.query; // Only name is optional in query
    const timezone = "Africa/Casablanca"; // Set your timezone

    // Automatically get current month/year from system
    const now = moment().tz(timezone);
    const currentMonth = now.month() + 1; // moment.js months are 0-11
    const currentYear = now.year();

    // Date range for current month
    const start = now.clone().startOf('month');
    const end = now.clone().endOf('month');

    // Find employee(s)
    const query = { role: "employe" };
    if (name) query.name = new RegExp(name, 'i'); // Filter by name if provided

    const employees = await User.find(query);
    if (!employees.length) {
      return res.status(404).json({
        status: "fail",
        message: name ? `No employee found with name like '${name}'` : "No employees found"
      });
    }

    // Get all required data in parallel (optimized)
    const employeeIds = employees.map(e => e._id);
    const [contracts, attendances, leaves] = await Promise.all([
      Contract.find({ employee: { $in: employeeIds }, status: "actif" }),
      Attendance.find({ 
        userId: { $in: employeeIds },
        date: { $gte: start.toDate(), $lte: end.toDate() }
      }),
      LeaveRequest.find({
        employee: { $in: employeeIds },
        status: "acceptée",
        $or: [
          { startDate: { $lte: end.toDate() }, endDate: { $gte: start.toDate() } },
          { startDate: { $gte: start.toDate(), $lte: end.toDate() } }
        ]
      })
    ]);

    // Process each employee
    const results = employees.map(employee => {
      const contract = contracts.find(c => c.employee.equals(employee._id));
      if (!contract || !contract.salary) {
        return {
          employe: employee.name,
          error: "No active contract found",
          month: currentMonth,
          year: currentYear
        };
      }

      // Calculate working days (exclude weekends)
      let workingDays = 0;
      let currentDay = start.clone();
      while (currentDay.isSameOrBefore(end)) {
        if (currentDay.day() !== 0 && currentDay.day() !== 6) workingDays++;
        currentDay.add(1, 'day');
      }

      // Employee's attendances and leaves
      const empAttendances = attendances
        .filter(a => a.userId.equals(employee._id))
        .map(a => moment(a.date).tz(timezone).startOf('day').format("YYYY-MM-DD"));

      const empLeaves = leaves.filter(l => l.employee.equals(employee._id));

      // Justified absence days
      let justifiedDays = [];
      empLeaves.forEach(leave => {
        let day = moment(leave.startDate).tz(timezone).startOf('day');
        const lastDay = moment(leave.endDate).tz(timezone).startOf('day');
        while (day.isSameOrBefore(lastDay)) {
          if (day.day() !== 0 && day.day() !== 6) {
            justifiedDays.push(day.format("YYYY-MM-DD"));
          }
          day.add(1, 'day');
        }
      });

      // Calculate presence/absence
      const presentDays = [...new Set(empAttendances)]; // Unique dates
      const justifiedUniqueDays = [...new Set(justifiedDays)];
      
      let unjustifiedAbsences = 0;
      currentDay = start.clone();
      while (currentDay.isSameOrBefore(end)) {
        if (currentDay.day() !== 0 && currentDay.day() !== 6) {
          const dateStr = currentDay.format("YYYY-MM-DD");
          if (!presentDays.includes(dateStr) && !justifiedUniqueDays.includes(dateStr)) {
            unjustifiedAbsences++;
          }
        }
        currentDay.add(1, 'day');
      }

      // Salary calculation
      const penaltyPerDay = contract.salary / workingDays;
      const totalPenalty = penaltyPerDay * unjustifiedAbsences;
      const salaireNet = contract.salary - totalPenalty;

      return {
        employe: employee.name,
        month: currentMonth,
        year: currentYear,
        salaireMensuel: contract.salary,
        joursOuvrables: workingDays,
        joursPresents: presentDays.length,
        joursConges: justifiedUniqueDays.length,
        absencesNonJustifiees: unjustifiedAbsences,
        penalite: totalPenalty.toFixed(2),
        salaireNet: salaireNet.toFixed(2)
      };
    });

    res.status(200).json({
      status: "success",
      data: results
    });

  } catch (error) {
    console.error("Salary calculation error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message
    });
  }
};