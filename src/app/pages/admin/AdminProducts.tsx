import React, { useState, useEffect } from "react";
import { AdminLayout } from "../../components/AdminLayout";
import { GlassCard } from "../../components/GlassCard";
import { RoundedButton } from "../../components/RoundedButton";

import { Plus, Search, Edit, Trash2 } from "lucide-react";

import { Input } from "../../components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "inactive";
}

// ===================== API PATH =====================
const API = "http://localhost/CartSense/cart-sense-api/";

export function AdminProducts() {
  const [searchQuery, setSearchQuery] = useState("");

  const [products, setProducts] = useState<Product[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    status: "active" as "active" | "inactive",
  });

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API}/get_products.php`);

      const data = await res.json();

      const formatted = data.map((item: any) => ({
        ...item,
        price: Number(item.price),
        stock: Number(item.stock),
      }));

      setProducts(formatted);
    } catch {
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= DIALOG =================
  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);

      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        stock: product.stock.toString(),
        status: product.status,
      });
    } else {
      setEditingProduct(null);

      setFormData({
        name: "",
        category: "",
        price: "",
        stock: "",
        status: "active",
      });
    }

    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  // ================= CREATE / UPDATE =================
  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.category ||
      !formData.price ||
      !formData.stock
    ) {
      toast.error("Fill all fields");
      return;
    }

    const payload = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      status: formData.status,
    };

    try {
      if (editingProduct) {
        await fetch(`${API}/update_product.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: editingProduct.id,
            ...payload,
          }),
        });

        toast.success("Product updated");
      } else {
        await fetch(`${API}/create_product.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        toast.success("Product added");
      }

      fetchProducts();
      handleCloseDialog();
    } catch {
      toast.error("Error saving product");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;

    await fetch(`${API}/delete_product.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    toast.success("Product deleted");
    fetchProducts();
  };

  // ================= FILTER =================
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-[#fdf5e6] text-xl font-semibold">Products</h1>

          <p className="text-[#fdf5e6]/60 text-sm">
            Manage your product catalog
          </p>
        </div>

        <RoundedButton
          onClick={() => handleOpenDialog()}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </RoundedButton>
      </div>

      {/* SEARCH */}
      <GlassCard className="mb-6 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-[#fdf5e6]/50" />

          <Input
            className="pl-10 bg-transparent border-[#fdf5e6]/20 text-[#fdf5e6]"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </GlassCard>

      {/* TABLE */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#2d5a3f]/30">
              <tr className="text-left text-[#fdf5e6]/80">
                <th className="py-3 px-6">Product</th>
                <th className="py-3 px-6">Category</th>
                <th className="py-3 px-6">Price</th>
                <th className="py-3 px-6">Stock</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-[#fdf5e6]/10 hover:bg-[#2d5a3f]/20 transition"
                >
                  <td className="py-4 px-6 text-[#fdf5e6] font-medium">
                    {product.name}
                  </td>

                  <td className="py-4 px-6 text-[#fdf5e6]/70">
                    {product.category}
                  </td>

                  <td className="py-4 px-6 text-[#fdf5e6] font-semibold">
                    ₱{Number(product.price).toFixed(2)}
                  </td>

                  <td className="py-4 px-6">{product.stock}</td>

                  <td className="py-4 px-6">{product.status}</td>

                  <td className="py-4 px-6">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => handleOpenDialog(product)}>
                        <Edit />
                      </button>

                      <button onClick={() => handleDelete(product.id)}>
                        <Trash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* MODAL */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add Product"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
            />

            <Input
              placeholder="Category"
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value,
                })
              }
            />

            <Input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: e.target.value,
                })
              }
            />

            <Input
              type="number"
              placeholder="Stock"
              value={formData.stock}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stock: e.target.value,
                })
              }
            />

            <Select
              value={formData.status}
              onValueChange={(v: any) =>
                setFormData({
                  ...formData,
                  status: v,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <RoundedButton onClick={handleSubmit}>
              {editingProduct ? "Update" : "Create"}
            </RoundedButton>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
