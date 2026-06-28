import React, { useEffect, useState } from "react";
import { AdminLayout } from "../../components/AdminLayout";
import { GlassCard } from "../../components/GlassCard";
import { RoundedButton } from "../../components/RoundedButton";
import {
  Package,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Edit,
  Plus,
  Minus,
  Save,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { toast } from "sonner";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  inStock: number;
  reorderLevel: number;
  location: string;
}

const API = "http://localhost/CartSense/cart-sense-api/";

export function AdminInventory() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [adjustmentType, setAdjustmentType] = useState<
    "add" | "remove" | "set"
  >("add");
  const [adjustmentValue, setAdjustmentValue] = useState("");

  // ADD FORM STATE
  const [newItem, setNewItem] = useState({
    name: "",
    sku: "",
    inStock: "",
    reorderLevel: "",
    location: "",
  });

  // ================= FETCH INVENTORY =================
  const fetchInventory = async () => {
    try {
      const res = await fetch(`${API}/get_inventory.php`);
      const data = await res.json();

      const formatted = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        sku: item.sku,
        inStock: Number(item.in_stock),
        reorderLevel: Number(item.reorder_level),
        location: item.location,
      }));

      setInventoryItems(formatted);
    } catch (err) {
      toast.error("Failed to load inventory");
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // ================= UPDATE STOCK =================
  const updateStock = async (id: string, newStock: number) => {
    await fetch(`${API}/update_stock.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, in_stock: newStock }),
    });

    fetchInventory();
  };

  // ================= ADD ITEM TO DATABASE =================
  const handleAddItem = async () => {
    if (
      !newItem.name ||
      !newItem.sku ||
      !newItem.inStock ||
      !newItem.reorderLevel ||
      !newItem.location
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await fetch(`${API}/add_inventory.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newItem.name,
          sku: newItem.sku,
          in_stock: Number(newItem.inStock),
          reorder_level: Number(newItem.reorderLevel),
          location: newItem.location,
        }),
      });

      toast.success("Item added successfully");

      setNewItem({
        name: "",
        sku: "",
        inStock: "",
        reorderLevel: "",
        location: "",
      });

      setIsAddDialogOpen(false);
      fetchInventory();
    } catch (err) {
      toast.error("Failed to add item");
    }
  };

  // ================= STOCK ADJUST =================
  const handleOpenDialog = (
    item: InventoryItem,
    type: "add" | "remove" | "set",
  ) => {
    setSelectedItem(item);
    setAdjustmentType(type);
    setAdjustmentValue("");
    setIsDialogOpen(true);
  };

  const handleAdjustStock = async () => {
    if (!selectedItem || !adjustmentValue) {
      toast.error("Please enter a valid value");
      return;
    }

    const value = parseInt(adjustmentValue);
    if (isNaN(value) || value < 0) {
      toast.error("Invalid number");
      return;
    }

    let newStock = selectedItem.inStock;

    if (adjustmentType === "add") {
      newStock = selectedItem.inStock + value;
    } else if (adjustmentType === "remove") {
      newStock = Math.max(0, selectedItem.inStock - value);
    } else {
      newStock = value;
    }

    await updateStock(selectedItem.id, newStock);

    toast.success("Stock updated");
    setIsDialogOpen(false);
  };

  // ================= STATS =================
  const totalItems = inventoryItems.reduce(
    (sum, item) => sum + item.inStock,
    0,
  );

  const lowStockCount = inventoryItems.filter(
    (item) => item.inStock <= item.reorderLevel,
  ).length;

  const outOfStockCount = inventoryItems.filter(
    (item) => item.inStock === 0,
  ).length;

  const stats = [
    { label: "Total Items", value: totalItems, icon: Package },
    { label: "Low Stock", value: lowStockCount, icon: AlertTriangle },
    { label: "Out of Stock", value: outOfStockCount, icon: TrendingDown },
    { label: "In Transit", value: 45, icon: TrendingUp },
  ];

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-[#fdf5e6] text-xl font-semibold">Inventory</h1>
          <p className="text-[#fdf5e6]/60 text-sm">
            Monitor and manage stock levels
          </p>
        </div>

        {/* ADD BUTTON */}
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={18} />
          Add Item
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <GlassCard key={i}>
            <div className="flex justify-between items-center">
              <s.icon className="text-[#fdf5e6]" />
              <span className="text-[#fdf5e6] font-bold">{s.value}</span>
            </div>
            <p className="text-[#fdf5e6]/60 text-sm mt-2">{s.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* TABLE */}
      <GlassCard>
        <h3 className="text-[#fdf5e6] mb-4">Inventory List</h3>

        <table className="w-full">
          <thead className="text-left text-[#fdf5e6]/70 border-b border-[#fdf5e6]/20">
            <tr>
              <th className="py-2">Product</th>
              <th>SKU</th>
              <th>Stock</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {inventoryItems.map((item) => (
              <tr key={item.id} className="border-b border-[#fdf5e6]/10">
                <td className="py-3 text-[#fdf5e6]">{item.name}</td>
                <td className="text-[#fdf5e6]/70">{item.sku}</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      item.inStock === 0
                        ? "bg-red-500/20 text-red-400"
                        : item.inStock <= item.reorderLevel
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {item.inStock}
                  </span>
                </td>

                <td className="text-[#fdf5e6]/70">{item.location}</td>

                <td>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenDialog(item, "add")}
                      className="p-2 rounded bg-green-500/10 text-green-400"
                    >
                      <Plus size={16} />
                    </button>

                    <button
                      onClick={() => handleOpenDialog(item, "remove")}
                      className="p-2 rounded bg-red-500/10 text-red-400"
                    >
                      <Minus size={16} />
                    </button>

                    <button
                      onClick={() => handleOpenDialog(item, "set")}
                      className="p-2 rounded bg-blue-500/10 text-blue-400"
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      {/* ADD ITEM MODAL */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Inventory Item</DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <Input
              placeholder="Product Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <Input
              placeholder="SKU"
              value={newItem.sku}
              onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Stock"
              value={newItem.inStock}
              onChange={(e) =>
                setNewItem({ ...newItem, inStock: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Reorder Level"
              value={newItem.reorderLevel}
              onChange={(e) =>
                setNewItem({ ...newItem, reorderLevel: e.target.value })
              }
            />
            <Input
              placeholder="Location"
              value={newItem.location}
              onChange={(e) =>
                setNewItem({ ...newItem, location: e.target.value })
              }
            />
          </div>

          <RoundedButton onClick={handleAddItem}>
            <Save className="mr-2" size={16} />
            Save Item
          </RoundedButton>
        </DialogContent>
      </Dialog>

      {/* STOCK MODAL */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Stock</DialogTitle>
          </DialogHeader>

          <Input
            type="number"
            value={adjustmentValue}
            onChange={(e) => setAdjustmentValue(e.target.value)}
            placeholder="Enter value"
          />

          <RoundedButton onClick={handleAdjustStock}>Confirm</RoundedButton>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
