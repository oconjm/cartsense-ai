import React, { useEffect, useState } from "react";
import axios from "axios";

import { AdminLayout } from "../../components/AdminLayout";
import { GlassCard } from "../../components/GlassCard";

import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  AlertCircle,
} from "lucide-react";

interface Stats {
  users: number;
  products: number;
  revenue: number;
  orders: number;
}

interface Activity {
  id: number;
  user: string;
  action: string;
  time: string;
}

interface LowStockItem {
  id: number;
  name: string;
  stock: number;
}

export function AdminDashboard() {
  // ===================== API PATH =====================
  const API = "http://localhost/CartSense/cart-sense-api/";

  const [stats, setStats] = useState<Stats>({
    users: 0,
    products: 0,
    revenue: 0,
    orders: 0,
  });

  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (): Promise<void> => {
    try {
      setLoading(true);

      // FETCH ALL DATA (PARALLEL)
      const [
        usersRes,
        productsRes,
        ordersRes,
        revenueRes,
        activityRes,
        lowStockRes,
      ] = await Promise.all([
        axios.get(`${API}/get_users_count.php`),
        axios.get(`${API}/get_products_count.php`),
        axios.get(`${API}/get_orders_count.php`),
        axios.get(`${API}/get_revenue.php`),
        axios.get(`${API}/get_recent_activity.php`),
        axios.get(`${API}/get_low_stock.php`),
      ]);

      // DEBUG
      console.log("USERS:", usersRes.data);
      console.log("PRODUCTS:", productsRes.data);
      console.log("ORDERS:", ordersRes.data);
      console.log("REVENUE:", revenueRes.data);
      console.log("ACTIVITY:", activityRes.data);
      console.log("LOW STOCK:", lowStockRes.data);

      // ===================== STATS =====================
      setStats({
        users: Number(usersRes?.data?.total) || 0,
        products: Number(productsRes?.data?.total) || 0,
        orders: Number(ordersRes?.data?.total) || 0,
        revenue: Number(revenueRes?.data?.total) || 0,
      });

      // ===================== ACTIVITY =====================
      setRecentActivity(
        Array.isArray(activityRes.data) ? activityRes.data : [],
      );

      // ===================== LOW STOCK =====================
      setLowStockItems(Array.isArray(lowStockRes.data) ? lowStockRes.data : []);
    } catch (error) {
      console.error("Dashboard Error:", error);

      setStats({
        users: 0,
        products: 0,
        revenue: 0,
        orders: 0,
      });

      setRecentActivity([]);
      setLowStockItems([]);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      icon: Users,
      label: "Total Users",
      value: stats.users,
      change: "+12%",
      positive: true,
    },
    {
      icon: Package,
      label: "Products",
      value: stats.products,
      change: "+3%",
      positive: true,
    },
    {
      icon: DollarSign,
      label: "Revenue",
      value: `₱${stats.revenue}`,
      change: "+18%",
      positive: true,
    },
    {
      icon: ShoppingCart,
      label: "Orders Today",
      value: stats.orders,
      change: "-5%",
      positive: false,
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-[#fdf5e6] text-center mt-10 text-lg">
          Loading dashboard...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-[#fdf5e6] text-3xl font-bold">Dashboard</h1>

        <p className="text-[#fdf5e6]/70 text-sm">Welcome back, Admin</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsCards.map((stat, index) => (
          <GlassCard key={index}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-full bg-[#2d5a3f]/50 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-[#fdf5e6]" />
              </div>

              <span
                className={`text-sm ${
                  stat.positive ? "text-green-400" : "text-red-400"
                }`}
              >
                {stat.change}
              </span>
            </div>

            <h3 className="text-2xl font-bold text-[#fdf5e6] mb-1">
              {stat.value}
            </h3>

            <p className="text-[#fdf5e6]/60 text-sm">{stat.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RECENT ACTIVITY */}
        <GlassCard>
          <h3 className="text-[#fdf5e6] mb-4 flex items-center gap-2 text-lg font-semibold">
            <TrendingUp className="w-5 h-5" />
            Recent Activity
          </h3>

          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 bg-[#1b4d2e]/30 rounded-lg"
                >
                  <div>
                    <p className="text-[#fdf5e6] text-sm">{activity.user}</p>

                    <p className="text-[#fdf5e6]/60 text-xs">
                      {activity.action}
                    </p>
                  </div>

                  <p className="text-[#fdf5e6]/60 text-xs">{activity.time}</p>
                </div>
              ))
            ) : (
              <p className="text-[#fdf5e6]/60">No recent activity</p>
            )}
          </div>
        </GlassCard>

        {/* LOW STOCK */}
        <GlassCard>
          <h3 className="text-[#fdf5e6] mb-4 flex items-center gap-2 text-lg font-semibold">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            Low Stock Alerts
          </h3>

          <div className="space-y-3">
            {lowStockItems.length > 0 ? (
              lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[#fdf5e6] text-sm font-semibold">
                      {item.name}
                    </p>

                    <span className="text-yellow-400 text-xs bg-yellow-500/20 px-2 py-1 rounded-full">
                      LOW STOCK
                    </span>
                  </div>

                  <div className="w-full bg-[#1b4d2e]/50 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${
                        item.stock <= 5
                          ? "bg-red-500"
                          : item.stock <= 10
                            ? "bg-orange-400"
                            : "bg-yellow-400"
                      }`}
                      style={{
                        width: `${Math.max((item.stock / 20) * 100, 5)}%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <p className="text-[#fdf5e6]/70 text-xs">Remaining Stock</p>

                    <p
                      className={`text-sm font-bold ${
                        item.stock <= 5
                          ? "text-red-400"
                          : item.stock <= 10
                            ? "text-orange-300"
                            : "text-yellow-300"
                      }`}
                    >
                      {item.stock} left
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <Package className="w-10 h-10 text-[#fdf5e6]/30 mx-auto mb-2" />
                <p className="text-[#fdf5e6]/60">No low stock items</p>
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </AdminLayout>
  );
}
