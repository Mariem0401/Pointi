import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages de base
import Login from './pages/Login';
import DashboardHome from './pages/DashboardHome';
import MainLayout from './components/layout/MainLayout';

// Gestion des employés
import Employees from './pages/employees/Employees';
import NewEmployee from './pages/employees/NewEmployee';
import Contracts from './pages/employees/Contracts';
import NewContractForm from './pages/employees/NewContract';

// Pointage
import DailyAttendance from './pages/attendance/Daily';
import MonthlyAttendance from './pages/attendance/Monthly';
import Schedules from './pages/attendance/Schedules';

// Congés
import LeaveRequests from './pages/leave/Requests';
import LeaveBalance from './pages/leave/Balance';
import LeaveCalendar from './pages/leave/Calendar';
import NewRequest from './pages/leave/NewRequest';

// Deparments 
import Departments from './pages/departments/Departments';
import DepartmentDetail from './pages/departments/DepartmentDetail';
import NewDepartment from './pages/departments/NewDepartment';
import EditDepartment from './pages/departments/EditDepartment';
import Teams from './pages/departments/Teams';
import NewTeam from './pages/departments/NewTeam';
import TeamDetail from './pages/departments/TeamDetail';
// Paie
import PayrollCalculate from './pages/payroll/Calculate';
import PayrollHistory from './pages/payroll/History';
import PayrollSlips from './pages/payroll/Slips';

// Rapports
import ReportPerformance from './pages/reports/Performance';
import ReportAttendance from './pages/reports/Attendance';
import ReportCosts from './pages/reports/Costs';
import AllContracts from './pages/employees/Contracts';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page de connexion */}
        <Route path="/" element={<Login />} />

        {/* Toutes les pages protégées sont sous MainLayout */}
        <Route element={<MainLayout />}>
          {/* Accueil */}
          <Route path="/dashboard" element={<DashboardHome />} />

          {/* Employés */}
          <Route path="/dashboard/employees" element={<Employees />} />
          <Route path="/dashboard/employees/new" element={<NewEmployee />} />
          <Route path="/dashboard/employees/contracts" element={<AllContracts />} />
          <Route path="/dashboard/employees/new-contracts" element={<NewContractForm />} />
          {/* Temps & Présence */}
          <Route path="/dashboard/attendance/daily" element={<DailyAttendance />} />
          <Route path="/dashboard/attendance/monthly" element={<MonthlyAttendance />} />
          <Route path="/dashboard/schedules" element={<Schedules />} />

          {/* Congés */}
          <Route path="/dashboard/leave/requests" element={<LeaveRequests />} />
          <Route path="/dashboard/leave/balance" element={<LeaveBalance />} />
          <Route path="/dashboard/leave/calendar" element={<LeaveCalendar />} />
          <Route path="/dashboard/leave/new-request" element={<NewRequest />} /> 

          {/* Paie */}
          <Route path="/dashboard/payroll/calculate" element={<PayrollCalculate />} />
          <Route path="/dashboard/payroll/history" element={<PayrollHistory />} />
          <Route path="/dashboard/payroll/slips" element={<PayrollSlips />} />

          {/* Rapports */}
          <Route path="/dashboard/reports/performance" element={<ReportPerformance />} />
          <Route path="/dashboard/reports/attendance" element={<ReportAttendance />} />
          <Route path="/dashboard/reports/costs" element={<ReportCosts />} />
             
            {/* Départements et Équipes - NOUVELLES ROUTES */}
           <Route path="/dashboard/departments" element={<Departments />} />
          <Route path="/dashboard/departments/new" element={<NewDepartment />} />
          <Route path="/dashboard/departments/:id" element={<DepartmentDetail />} />
          <Route path="/dashboard/departments/:id/edit" element={<EditDepartment />} />
          <Route path="/dashboard/departments/:id/teams" element={<Teams />} />
          <Route path="/dashboard/departments/:id/teams/new" element={<NewTeam />} />
          <Route path="/dashboard/departments/:id/teams/:teamId" element={<TeamDetail />} />
          {/* Fallback 404 */}
          <Route path="*" element={<div className="p-10 text-red-600 text-xl">404 - Page non trouvée</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;