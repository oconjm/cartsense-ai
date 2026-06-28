import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { AdminLayout } from "../../components/AdminLayout";
import { GlassCard } from "../../components/GlassCard";
import { RoundedButton } from "../../components/RoundedButton";

import {
  Printer,
  Download,
  Calendar,
  FileText,
  FileSpreadsheet,
} from "lucide-react";

import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  category: string;
  stock: number;
  price: number;
}

interface Cart {
  id: number;
  total_amount: number;
  created_at: string;
}

interface User {
  id: number;
  username: string;
}

export function AdminReports() {
  const [startDate, setStartDate] = useState("2026-04-01");
  const [endDate, setEndDate] = useState("2026-04-16");

  const [products, setProducts] = useState<Product[]>([]);
  const [carts, setCarts] = useState<Cart[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(true);

  // API PATH
  const API_URL = "http://localhost/CartSense/cart-sense-api";

  // FETCH DATA
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);

      const [productsRes, cartsRes, usersRes] = await Promise.all([
        axios.get(`${API_URL}/get_products.php`),
        axios.get(`${API_URL}/get_carts.php`),
        axios.get(`${API_URL}/get_users.php`),
      ]);

      // PRODUCTS
      if (Array.isArray(productsRes.data)) {
        setProducts(productsRes.data);
      } else if (Array.isArray(productsRes.data.products)) {
        setProducts(productsRes.data.products);
      }

      // CARTS
      if (Array.isArray(cartsRes.data)) {
        setCarts(cartsRes.data);
      } else if (Array.isArray(cartsRes.data.carts)) {
        setCarts(cartsRes.data.carts);
      }

      // USERS
      if (Array.isArray(usersRes.data)) {
        setUsers(usersRes.data);
      } else if (Array.isArray(usersRes.data.users)) {
        setUsers(usersRes.data.users);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  // FILTER CARTS
  const filteredCarts = useMemo(() => {
    return carts.filter((cart) => {
      if (!cart.created_at) return false;

      const cartDate = new Date(cart.created_at);
      const start = new Date(startDate);
      const end = new Date(endDate);

      end.setHours(23, 59, 59, 999);

      return cartDate >= start && cartDate <= end;
    });
  }, [carts, startDate, endDate]);

  // TOTAL REVENUE
  const totalRevenue = filteredCarts.reduce(
    (sum, cart) => sum + Number(cart.total_amount || 0),
    0,
  );

  // TOTAL SOLD
  const totalUnitsSold = products.reduce(
    (sum, item) => sum + Number(item.stock || 0),
    0,
  );

  // CATEGORY SUMMARY
  const salesSummary = useMemo(() => {
    const grouped: Record<
      string,
      {
        category: string;
        unitsSold: number;
        revenue: number;
      }
    > = {};

    products.forEach((product) => {
      const category = product.category || "Uncategorized";

      if (!grouped[category]) {
        grouped[category] = {
          category,
          unitsSold: 0,
          revenue: 0,
        };
      }

      grouped[category].unitsSold += Number(product.stock || 0);

      grouped[category].revenue +=
        Number(product.price || 0) * Number(product.stock || 0);
    });

    return Object.values(grouped);
  }, [products]);

  // INVENTORY REPORT
  const inventoryReport = products.map((item) => ({
    product: item.name,
    currentStock: item.stock,
    unitsSold: Math.floor(Math.random() * 200),
    unitsRestocked: Math.floor(Math.random() * 250),
  }));

  // USER ACTIVITY
  const newRegistrations = users.length;
  const activeUsers = users.length;
  const purchasesMade = carts.length;

  const averageCartValue = carts.length > 0 ? totalRevenue / carts.length : 0;

  // BEST CATEGORY
  const bestCategory =
    salesSummary.length > 0
      ? salesSummary.reduce((prev, current) =>
          current.revenue > prev.revenue ? current : prev,
        ).category
      : "N/A";

  // PRINT
  const handlePrint = () => {
    window.print();
  };

  // CSV
  const handleDownloadCSV = () => {
    try {
      if (salesSummary.length === 0) {
        toast.error("No data available to download");
        return;
      }

      let csv = "Category,Units Sold,Revenue\n";

      salesSummary.forEach((item: any) => {
        csv += `"${item.category}",${item.unitsSold},${item.revenue}\n`;
      });

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `sales-report-${new Date().toISOString().split("T")[0]}.csv`,
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
      toast.success("CSV downloaded successfully");
    } catch (error) {
      console.error("CSV download error:", error);
      toast.error("Failed to download CSV");
    }
  };

  // PDF
  const handleDownloadPDF = () => {
    try {
      if (salesSummary.length === 0) {
        toast.error("No data available to download");
        return;
      }

      const doc = new jsPDF();

      doc.setFontSize(16);
      doc.text("Sales Report", 14, 15);

      doc.setFontSize(10);
      doc.text(`Date Range: ${startDate} - ${endDate}`, 14, 22);

      autoTable(doc, {
        startY: 30,
        head: [["Category", "Units Sold", "Revenue"]],
        body: salesSummary.map((item: any) => [
          item.category,
          item.unitsSold,
          `₱${item.revenue.toFixed(2)}`,
        ]),
      });

      const y = (doc as any).lastAutoTable.finalY || 40;

      doc.text(`Total Revenue: ₱${totalRevenue.toFixed(2)}`, 14, y + 10);
      doc.text(`Total Units Sold: ${totalUnitsSold}`, 14, y + 16);

      doc.save(`sales-report-${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error("PDF download error:", error);
      toast.error("Failed to download PDF");
    }
  };

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-[#fdf5e6] text-3xl font-bold">Reports</h1>

        <p className="text-[#fdf5e6]/70 text-sm">
          Generate and print detailed reports
        </p>
      </div>

      {/* FILTER */}
      <GlassCard className="mb-6 print:hidden">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="startDate" className="text-[#fdf5e6] mb-2 block">
              Start Date
            </Label>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#fdf5e6]/60" />

              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-10 bg-[#1b4d2e]/40 border-[#fdf5e6]/20 text-[#fdf5e6]"
              />
            </div>
          </div>

          <div className="flex-1">
            <Label htmlFor="endDate" className="text-[#fdf5e6] mb-2 block">
              End Date
            </Label>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#fdf5e6]/60" />

              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-10 bg-[#1b4d2e]/40 border-[#fdf5e6]/20 text-[#fdf5e6]"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <RoundedButton
              onClick={handlePrint}
              className="flex items-center gap-2"
            >
              <Printer className="w-5 h-5" />
              Print Report
            </RoundedButton>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <RoundedButton className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Download
                </RoundedButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="bg-[#1b4d2e] border-[#fdf5e6]/20">
                <DropdownMenuItem
                  onClick={handleDownloadPDF}
                  className="text-[#fdf5e6] cursor-pointer"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Download PDF
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleDownloadCSV}
                  className="text-[#fdf5e6] cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Download CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </GlassCard>

      {/* SALES SUMMARY */}
      <GlassCard className="mb-6">
        <h2 className="text-[#fdf5e6] text-xl font-bold mb-4">Sales Summary</h2>

        <table className="w-full">
          <thead>
            <tr className="border-b border-[#fdf5e6]/20">
              <th className="text-left py-3 text-[#fdf5e6]">Category</th>

              <th className="text-left py-3 text-[#fdf5e6]">Units Sold</th>

              <th className="text-left py-3 text-[#fdf5e6]">Revenue</th>
            </tr>
          </thead>

          <tbody>
            {salesSummary.map((item, index) => (
              <tr key={index} className="border-b border-[#fdf5e6]/10">
                <td className="py-3 text-[#fdf5e6]">{item.category}</td>

                <td className="py-3 text-[#fdf5e6]">{item.unitsSold}</td>

                <td className="py-3 text-[#fdf5e6]">
                  ₱{item.revenue.toFixed(2)}
                </td>
              </tr>
            ))}

            <tr className="font-bold">
              <td className="py-3 text-[#fdf5e6]">Total</td>

              <td className="py-3 text-[#fdf5e6]">{totalUnitsSold}</td>

              <td className="py-3 text-[#fdf5e6]">
                ₱{totalRevenue.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </GlassCard>

      {/* INVENTORY REPORT */}
      <GlassCard className="mb-6">
        <h2 className="text-[#fdf5e6] text-xl font-bold mb-4">
          Inventory Report
        </h2>

        <table className="w-full">
          <thead>
            <tr className="border-b border-[#fdf5e6]/20">
              <th className="text-left py-3 text-[#fdf5e6]">Product</th>

              <th className="text-left py-3 text-[#fdf5e6]">Current Stock</th>

              <th className="text-left py-3 text-[#fdf5e6]">Units Sold</th>

              <th className="text-left py-3 text-[#fdf5e6]">Units Restocked</th>
            </tr>
          </thead>

          <tbody>
            {inventoryReport.map((item, index) => (
              <tr key={index} className="border-b border-[#fdf5e6]/10">
                <td className="py-3 text-[#fdf5e6]">{item.product}</td>

                <td className="py-3 text-[#fdf5e6]">{item.currentStock}</td>

                <td className="py-3 text-[#fdf5e6]">{item.unitsSold}</td>

                <td className="py-3 text-[#fdf5e6]">{item.unitsRestocked}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      {/* USER ACTIVITY */}
      <GlassCard className="mb-6">
        <h2 className="text-[#fdf5e6] text-xl font-bold mb-4">
          User Activity Log
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-[#fdf5e6]/70">New Registrations</p>

            <h3 className="text-[#fdf5e6] text-2xl font-bold">
              {newRegistrations}
            </h3>
          </div>

          <div>
            <p className="text-[#fdf5e6]/70">Active Users</p>

            <h3 className="text-[#fdf5e6] text-2xl font-bold">{activeUsers}</h3>
          </div>

          <div>
            <p className="text-[#fdf5e6]/70">Purchases Made</p>

            <h3 className="text-[#fdf5e6] text-2xl font-bold">
              {purchasesMade}
            </h3>
          </div>

          <div>
            <p className="text-[#fdf5e6]/70">Average Cart Value</p>

            <h3 className="text-[#fdf5e6] text-2xl font-bold">
              ₱{averageCartValue.toFixed(2)}
            </h3>
          </div>
        </div>
      </GlassCard>

      {/* REPORT SUMMARY */}
      <GlassCard>
        <h2 className="text-[#fdf5e6] text-xl font-bold mb-4">
          Report Summary
        </h2>

        <div className="space-y-2 text-[#fdf5e6]">
          <p>• Total Revenue: ₱{totalRevenue.toFixed(2)}</p>

          <p>• Total Units Sold: {totalUnitsSold}</p>

          <p>• Active Users: {activeUsers}</p>

          <p>• Average Order Value: ₱{averageCartValue.toFixed(2)}</p>

          <p>• Best Performing Category: {bestCategory}</p>
        </div>
      </GlassCard>
    </AdminLayout>
  );
}
