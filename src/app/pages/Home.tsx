import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router";
import { GlassCard } from "../components/GlassCard";
import { RoundedButton } from "../components/RoundedButton";
import { Plus, Trash2, Settings, ShoppingCart } from "lucide-react";

interface Product {
  id: number;
  item: string;
  qty: number;
  price: number;
}

interface IoTItem {
  item: string;
  stock: number;
  depletionRate: number;
  price: number;
}

export function Home() {
  // ===================== API =====================
  const API = "http://localhost/CartSense/cart-sense-api/";
  const [products, setProducts] = useState<Product[]>([]);
  const [budget, setBudget] = useState<number>(0);
  const [budgetInput, setBudgetInput] = useState("");
  const [isBudgetSet, setIsBudgetSet] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);

  const [newItem, setNewItem] = useState({
    item: "",
    qty: "",
    price: "",
  });

  const [loading, setLoading] = useState(false);

  const [iotData, setIotData] = useState<IoTItem[]>([
    {
      item: "Milk",
      stock: 20,
      depletionRate: 0.05,
      price: 150,
    },
    {
      item: "Bread",
      stock: 15,
      depletionRate: 0.08,
      price: 60,
    },
    {
      item: "Eggs",
      stock: 10,
      depletionRate: 0.1,
      price: 180,
    },
    {
      item: "Rice",
      stock: 25,
      depletionRate: 0.03,
      price: 550,
    },
    {
      item: "Noodles",
      stock: 30,
      depletionRate: 0.12,
      price: 25,
    },
  ]);

  const [showQR, setShowQR] = useState(false);
  const [qrData, setQrData] = useState("");

  // ===================== IOT SIMULATION =====================
  useEffect(() => {
    const interval = setInterval(() => {
      setIotData((prev) =>
        prev.map((item) => ({
          ...item,
          stock: Math.max(item.stock - item.stock * item.depletionRate, 0),
        })),
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  // ===================== LOAD CART =====================
  useEffect(() => {
    const saved = localStorage.getItem("cartData");

    if (saved) {
      const data = JSON.parse(saved);

      setProducts(data.products || []);

      // Force budget setup screen every time app loads
      setBudget(0);
      setIsBudgetSet(false);
    }
  }, []);
  // ===================== SAVE CART =====================
  useEffect(() => {
    localStorage.setItem(
      "cartData",
      JSON.stringify({
        products,
        budget,
      }),
    );
  }, [products, budget]);

  // ===================== TOTALS =====================
  const total = products.reduce((sum, p) => sum + p.price * p.qty, 0);

  const remaining = budget - total;

  const percentUsed = budget ? (total / budget) * 100 : 0;

  // ===================== SET BUDGET =====================
  const handleSetBudget = () => {
    if (budgetInput) {
      setBudget(parseFloat(budgetInput));
      setIsBudgetSet(true);
      setBudgetInput("");
    }
  };

  // ===================== ADD PRODUCT =====================
  const handleAddProduct = () => {
    if (newItem.item && newItem.qty && newItem.price) {
      setProducts([
        ...products,
        {
          id: Date.now(),
          item: newItem.item,
          qty: parseInt(newItem.qty),
          price: parseFloat(newItem.price),
        },
      ]);

      setNewItem({
        item: "",
        qty: "",
        price: "",
      });

      setShowAddForm(false);
    }
  };

  // ===================== REMOVE PRODUCT =====================
  const handleRemoveProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  // ===================== ADD SUGGESTION =====================
  const handleAddFromSuggestion = (item: string, price: number) => {
    setProducts((prev) => [
      ...prev,
      {
        id: Date.now(),
        item,
        qty: 1,
        price,
      },
    ]);
  };

  // ===================== SMART SUGGESTIONS =====================
  const smartSuggestions = useMemo(() => {
    return iotData
      .map((item) => {
        const inCart = products.find((p) => p.item === item.item);

        let priority = "normal";
        let reason = "";

        if (item.stock < 5) {
          priority = "critical";
          reason = "🔴 Low stock ";
        } else if (item.depletionRate > 0.1) {
          priority = "high";
          reason = "🟡 Fast selling ";
        } else if (!inCart) {
          priority = "suggested";
          reason = "🟢 Available stock";
        }

        return {
          ...item,
          priority,
          reason,
          affordable: item.price <= remaining,
        };
      })
      .filter((i) => i.affordable)
      .sort((a, b) => {
        const order: any = {
          critical: 1,
          high: 2,
          suggested: 3,
          normal: 4,
        };

        return order[a.priority] - order[b.priority];
      });
  }, [iotData, products, remaining]);

  // ===================== CHECKOUT =====================
  const handleCheckout = async () => {
    if (products.length === 0) {
      alert("Cart is empty!");
      return;
    }

    setLoading(true);

    const payload = {
      ref: "CS-" + Date.now(),

      total,

      items: products.map((p) => ({
        name: p.item,
        price: p.price,
        quantity: p.qty,
      })),
    };

    try {
      const res = await fetch(`${API}/checkout.php`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      const text = await res.text();

      // DEBUG
      console.log("RAW RESPONSE:", text);

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid JSON from server");
      }

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Checkout failed");
      }

      // ===================== QR PAYLOAD =====================
      const qrPayload = {
        merchant: "CartSense",
        amount: total.toFixed(2),
        currency: "PHP",
        ref: payload.ref,
        cartId: data.cartId,
      };

      setQrData(JSON.stringify(qrPayload));

      setShowQR(true);

      // CLEAR CART
      setProducts([]);
    } catch (err: any) {
      console.error("ERROR:", err);

      alert("❌ " + err.message);
    }

    setLoading(false);
  };
  if (!isBudgetSet) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0c4022]">
        <div className="w-full max-w-md bg-[#14532d] rounded-2xl p-6 shadow-xl">
          <h1 className="text-3xl font-bold text-white text-center mb-3">
            Cart Sense
          </h1>

          <p className="text-white/80 text-center mb-6">
            Set your shopping budget first
          </p>

          <input
            type="number"
            placeholder="💰 Set your budget here..."
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
            className="
            w-full
            px-4
            py-3
            rounded-lg
            bg-green-100
            text-green-900
            placeholder:text-green-700
            border
            border-green-500
            mb-4
            outline-none
          "
          />

          <RoundedButton onClick={handleSetBudget} className="w-full">
            Start Shopping
          </RoundedButton>
        </div>
      </div>
    );
  }

  // ===================== UI =====================
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <div className="flex items-center gap-3">
            <ShoppingCart className="text-white" />

            <h1 className="text-2xl text-white">Cart Sense</h1>
          </div>

          <Link to="/settings">
            <Settings className="text-white" />
          </Link>
        </div>
        <>
          {/* SUMMARY */}
          <GlassCard className="p-4 mb-4 text-white">
            <p>Total: ₱{total.toFixed(2)}</p>

            <p>Remaining: ₱{remaining.toFixed(2)}</p>

            <div className="w-full bg-gray-700 h-3 rounded mt-2">
              <div
                className="h-3 bg-green-400 rounded"
                style={{
                  width: `${percentUsed}%`,
                }}
              />
            </div>
          </GlassCard>

          {/* SMART SUGGESTIONS */}
          <GlassCard className="p-4 mb-4 text-white">
            <h3 className="mb-3">🤖 Smart Suggestions</h3>

            {smartSuggestions.map((item, i) => (
              <div key={i} className="flex justify-between mb-2">
                <div>
                  <p>{item.item}</p>

                  <p className="text-xs">{item.reason}</p>
                </div>

                <button
                  onClick={() => handleAddFromSuggestion(item.item, item.price)}
                  className="text-green-400"
                >
                  + Add
                </button>
              </div>
            ))}
          </GlassCard>

          {/* CART ITEMS */}
          <GlassCard className="p-4 mb-4 text-white">
            {products.length === 0 ? (
              <p>No products added.</p>
            ) : (
              products.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center mb-2"
                >
                  <span>
                    {p.item} x{p.qty}
                  </span>

                  <span>₱{(p.price * p.qty).toFixed(2)}</span>

                  <button onClick={() => handleRemoveProduct(p.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </GlassCard>

          {/* CHECKOUT */}
          <RoundedButton
            onClick={handleCheckout}
            disabled={loading}
            className="w-full mb-4 bg-green-500/20"
          >
            {loading ? "Processing..." : "💳 Checkout"}
          </RoundedButton>

          {/* ADD ITEM */}
          <RoundedButton
            onClick={() => setShowAddForm(true)}
            className="text-white"
          >
            <Plus className="text-white" />
            Add Item
          </RoundedButton>
        </>
        {/* ADD ITEM MODAL */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-[#0c4022] text-white p-6 rounded-xl w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add Product</h2>

              <input
                type="text"
                placeholder="Item Name"
                value={newItem.item}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    item: e.target.value,
                  })
                }
                className="w-full border p-2 mb-3 rounded"
              />

              <input
                type="number"
                placeholder="Quantity"
                value={newItem.qty}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    qty: e.target.value,
                  })
                }
                className="w-full border p-2 mb-3 rounded"
              />

              <input
                type="number"
                placeholder="Price"
                value={newItem.price}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    price: e.target.value,
                  })
                }
                className="w-full border p-2 mb-4 rounded"
              />

              <div className="flex gap-2">
                <RoundedButton onClick={handleAddProduct} className="flex-1">
                  Save
                </RoundedButton>

                <RoundedButton
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-red-500"
                >
                  Cancel
                </RoundedButton>
              </div>
            </div>
          </div>
        )}
        {/* QR MODAL */}
        {showQR && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-[#1b4d2e] p-6 rounded-xl text-center">
              <h2 className="text-white mb-3">Scan to Pay</h2>

              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  qrData,
                )}`}
                alt="QR Code"
                className="bg-white p-2 rounded mx-auto mb-4"
              />

              <RoundedButton onClick={() => setShowQR(false)}>
                Close
              </RoundedButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
