import { createBrowserRouter } from "react-router";
import { Welcome } from "./pages/Welcome";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Home } from "./pages/Home";
import { CashierDashboard } from "./pages/Cashier";
import { Settings } from "./pages/Settings";
import { ProfileSettings } from "./pages/settings/ProfileSettings";
import { NotificationSettings } from "./pages/settings/NotificationSettings";
import { BudgetSettings } from "./pages/settings/BudgetSettings";
import { HelpSupport } from "./pages/settings/HelpSupport";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminProducts } from "./pages/admin/AdminProducts";
import { AdminInventory } from "./pages/admin/AdminInventory";
import { AdminSales } from "./pages/admin/AdminSales";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminReports } from "./pages/admin/AdminReports";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome />,
  },
  {
    path: "/welcome",
    element: <Welcome />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/cashier",
    element: <CashierDashboard />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/settings/profile",
    element: <ProfileSettings />,
  },
  {
    path: "/settings/notifications",
    element: <NotificationSettings />,
  },
  {
    path: "/settings/budget",
    element: <BudgetSettings />,
  },
  {
    path: "/settings/help",
    element: <HelpSupport />,
  },
  {
    path: "/admin-dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/admin-products",
    element: <AdminProducts />,
  },
  {
    path: "/admin-inventory",
    element: <AdminInventory />,
  },
  {
    path: "/admin-sales",
    element: <AdminSales />,
  },
  {
    path: "/admin-users",
    element: <AdminUsers />,
  },
  {
    path: "/admin-reports",
    element: <AdminReports />,
  },
]);
