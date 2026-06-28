import React, { useState } from "react";
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

export function AdminReports() {
  const [startDate, setStartDate] = useState("2026-04-01");
  const [endDate, setEndDate] = useState("2026-04-16");

  const salesSummary = [
    { category: "Dairy", sales: 234, revenue: "$2,345" },
    { category: "Bakery", sales: 189, revenue: "$1,567" },
    { category: "Produce", sales: 312, revenue: "$2,890" },
    { category: "Beverages", sales: 156, revenue: "$1,234" },
  ];

  const inventoryReport = [
    { product: "Organic Milk", current: 45, sold: 89, restocked: 120 },
    { product: "Whole Wheat Bread", current: 23, sold: 134, restocked: 150 },
    { product: "Fresh Eggs", current: 67, sold: 78, restocked: 100 },
    { product: "Greek Yogurt", current: 34, sold: 56, restocked: 80 },
  ];

  const userActivity = [
    { activity: "New Registrations", count: 45 },
    { activity: "Active Users", count: 234 },
    { activity: "Purchases Made", count: 567 },
    { activity: "Average Cart Value", count: "$42.50" },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    // Generate CSV content
    let csv = "Cart Sense - Business Report\n";
    csv += `Report Period: ${startDate} to ${endDate}\n`;
    csv += `Generated: ${new Date().toLocaleDateString()}\n\n`;

    // Sales Summary
    csv += "SALES SUMMARY\n";
    csv += "Category,Units Sold,Revenue\n";
    salesSummary.forEach((item) => {
      csv += `${item.category},${item.sales},${item.revenue}\n`;
    });
    csv += "\n";

    // Inventory Report
    csv += "INVENTORY REPORT\n";
    csv += "Product,Current Stock,Units Sold,Units Restocked\n";
    inventoryReport.forEach((item) => {
      csv += `${item.product},${item.current},${item.sold},${item.restocked}\n`;
    });
    csv += "\n";

    // User Activity
    csv += "USER ACTIVITY\n";
    csv += "Activity,Count\n";
    userActivity.forEach((item) => {
      csv += `${item.activity},${item.count}\n`;
    });

    // Create download link
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cart-sense-report-${startDate}-to-${endDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success("Report downloaded as CSV");
  };

  const handleDownloadPDF = () => {
    toast.info('Opening print dialog - select "Save as PDF" as your printer');
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-[#fdf5e6]">Reports</h1>
        <p className="text-[#fdf5e6]/70 text-sm">
          Generate and print detailed reports
        </p>
      </div>

      {/* Date Range Filter */}
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
                <RoundedButton
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download
                </RoundedButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#1b4d2e] border-[#fdf5e6]/20">
                <DropdownMenuItem
                  onClick={handleDownloadPDF}
                  className="text-[#fdf5e6] focus:bg-[#2d5a3f] focus:text-[#fdf5e6] cursor-pointer"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Download as PDF
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDownloadCSV}
                  className="text-[#fdf5e6] focus:bg-[#2d5a3f] focus:text-[#fdf5e6] cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Download as CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </GlassCard>

      {/* Report Content */}
      <div className="space-y-6" id="printable-report">
        {/* Print Header */}
        <div className="hidden print:block mb-8">
          <h1 className="text-3xl font-bold text-[#1b4d2e] mb-2">
            Cart Sense - Business Report
          </h1>
          <p className="text-gray-600">
            Report Period: {startDate} to {endDate}
          </p>
          <p className="text-gray-600">
            Generated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Sales Summary */}
        <GlassCard>
          <h3 className="text-[#fdf5e6] mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Sales Summary
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#fdf5e6]/20">
                  <th className="text-left text-[#fdf5e6] py-3 px-4">
                    Category
                  </th>
                  <th className="text-left text-[#fdf5e6] py-3 px-4">
                    Units Sold
                  </th>
                  <th className="text-left text-[#fdf5e6] py-3 px-4">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {salesSummary.map((item, index) => (
                  <tr key={index} className="border-b border-[#fdf5e6]/10">
                    <td className="text-[#fdf5e6] py-3 px-4">
                      {item.category}
                    </td>
                    <td className="text-[#fdf5e6] py-3 px-4">{item.sales}</td>
                    <td className="text-[#fdf5e6] py-3 px-4">{item.revenue}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-[#fdf5e6]/30 font-bold">
                  <td className="text-[#fdf5e6] py-3 px-4">Total</td>
                  <td className="text-[#fdf5e6] py-3 px-4">891</td>
                  <td className="text-[#fdf5e6] py-3 px-4">$8,036</td>
                </tr>
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Inventory Report */}
        <GlassCard>
          <h3 className="text-[#fdf5e6] mb-4">Inventory Report</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#fdf5e6]/20">
                  <th className="text-left text-[#fdf5e6] py-3 px-4">
                    Product
                  </th>
                  <th className="text-left text-[#fdf5e6] py-3 px-4">
                    Current Stock
                  </th>
                  <th className="text-left text-[#fdf5e6] py-3 px-4">
                    Units Sold
                  </th>
                  <th className="text-left text-[#fdf5e6] py-3 px-4">
                    Units Restocked
                  </th>
                </tr>
              </thead>
              <tbody>
                {inventoryReport.map((item, index) => (
                  <tr key={index} className="border-b border-[#fdf5e6]/10">
                    <td className="text-[#fdf5e6] py-3 px-4">{item.product}</td>
                    <td className="text-[#fdf5e6] py-3 px-4">{item.current}</td>
                    <td className="text-[#fdf5e6] py-3 px-4">{item.sold}</td>
                    <td className="text-[#fdf5e6] py-3 px-4">
                      {item.restocked}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* User Activity */}
        <GlassCard>
          <h3 className="text-[#fdf5e6] mb-4">User Activity Log</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {userActivity.map((item, index) => (
              <div key={index} className="p-4 bg-[#1b4d2e]/30 rounded-lg">
                <p className="text-[#fdf5e6]/70 text-sm mb-1">
                  {item.activity}
                </p>
                <p className="text-2xl text-[#fdf5e6]">{item.count}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Report Summary */}
        <GlassCard>
          <h3 className="text-[#fdf5e6] mb-4">Report Summary</h3>
          <div className="space-y-3 text-[#fdf5e6]">
            <p>
              • Total Revenue: <span className="font-bold">$8,036</span>
            </p>
            <p>
              • Total Units Sold: <span className="font-bold">891</span>
            </p>
            <p>
              • Active Users: <span className="font-bold">234</span>
            </p>
            <p>
              • Average Order Value: <span className="font-bold">$42.50</span>
            </p>
            <p>
              • Best Performing Category:{" "}
              <span className="font-bold">Produce</span>
            </p>
          </div>
        </GlassCard>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
          aside, nav, button {
            display: none !important;
          }
          main {
            margin: 0 !important;
            padding: 20px !important;
          }
          * {
            color: black !important;
          }
          h1, h2, h3 {
            color: #1b4d2e !important;
          }
          table {
            border-collapse: collapse;
            width: 100%;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
          }
          th {
            background-color: #f2f2f2;
          }
        }
      `}</style>
    </AdminLayout>
  );
}
