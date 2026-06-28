import React, { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  Warehouse, 
  TrendingUp, 
  Users, 
  FileText,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin-dashboard' },
    { icon: Package, label: 'Products', path: '/admin-products' },
    { icon: Warehouse, label: 'Inventory', path: '/admin-inventory' },
    { icon: TrendingUp, label: 'Sales', path: '/admin-sales' },
    { icon: Users, label: 'Users', path: '/admin-users' },
    { icon: FileText, label: 'Reports', path: '/admin-reports' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/welcome');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1f14] via-[#1b4d2e] to-[#0a1f14]">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-full bg-[#2d5a3f] flex items-center justify-center"
      >
        {sidebarOpen ? (
          <X className="w-6 h-6 text-[#fdf5e6]" />
        ) : (
          <Menu className="w-6 h-6 text-[#fdf5e6]" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 backdrop-blur-md bg-gradient-to-b from-[#1b4d2e]/80 to-[#2d5a3f]/60 border-r border-[#fdf5e6]/20 transition-transform duration-300 z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-[#fdf5e6]/20">
          <h2 className="text-[#fdf5e6]">Cart Sense</h2>
          <p className="text-[#fdf5e6]/60 text-sm">Admin Panel</p>
        </div>

        <nav className="p-4 flex-1">
          <div className="space-y-2">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={index}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#2d5a3f] text-[#fdf5e6]'
                      : 'text-[#fdf5e6]/70 hover:bg-[#2d5a3f]/50 hover:text-[#fdf5e6]'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-[#fdf5e6]/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#fdf5e6]/70 hover:bg-red-900/30 hover:text-red-400 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 p-4 lg:p-8">
        {children}
      </main>
    </div>
  );
}
