import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router";
import { GlassCard } from "../components/GlassCard";
import { RoundedButton } from "../components/RoundedButton";
import { Plus, Trash2, Settings, ShoppingCart } from "lucide-react";

export function Home() {
  const [products, setProducts] = useState([]);
  const [budget, setBudget] = useState(0);
  const [budgetInput, setBudgetInput] = useState("");
  const [isBudgetSet, setIsBudgetSet] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    item: "",
    qty: "",
    price: "",
  });

  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrData, setQrData] = useState("");

  const [iotData] = useState([
    { item: "Milk", stock: 20, depletionRate: 0.05, price: 150 },
    { item: "Bread", stock: 15, depletionRate: 0.08, price: 60 },
    { item: "Eggs", stock: 10, depletionRate: 0.1, price: 180 },
    { item: "Rice", stock: 25, depletionRate: 0.03, price: 550 },
    { item: "Noodles", stock: 30, depletionRate: 0.12, price: 25 },
  ]);

  // ================= LOAD CART =================
  useEffect(() => {
    const saved = localStorage.getItem("cartData");
    if (saved) {
      const data = JSON.parse(saved);
      setProducts(data.products || []);
      setBudget(data.budget || 0);
      setIsBudgetSet(data.isBudgetSet || false);
    }
  }, []);

  // ================= SAVE CART =================
  useEffect(() => {
    localStorage.setItem(
      "cartData",
      JSON.stringify({ products, budget, isBudgetSet }),
    );
  }, [products, budget, isBudgetSet]);

  // ================= TOTAL =================
  const total = products.reduce(
    (sum, p) => sum + Number(p.price) * Number(p.qty),
    0,
  );

  const remaining = budget - total;
  const percentUsed = budget ? (total / budget) * 100 : 0;

  // ================= BUDGET =================
  const handleSetBudget = () => {
    if (!budgetInput) return;
    setBudget(Number(budgetInput));
    setIsBudgetSet(true);
    setBudgetInput("");
  };

  // ================= ADD PRODUCT =================
  const handleAddProduct = () => {
    if (!newItem.item.trim()) {
      alert("Item name is required");
      return;
    }

    if (!newItem.qty || !newItem.price) {
      alert("Quantity and price are required");
      return;
    }

    setProducts([
      ...products,
      {
        id: Date.now(),
        item: newItem.item.trim(),
        qty: Number(newItem.qty),
        price: Number(newItem.price),
      },
    ]);

    setNewItem({ item: "", qty: "", price: "" });
    setShowAddForm(false);
  };

  // ================= REMOVE =================
  const handleRemoveProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  // ================= CHECKOUT =================
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
        item: p.item?.trim() || "Unknown Item",
        qty: Number(p.qty),
        price: Number(p.price),
      })),
    };

    try {
      const res = await fetch("http://localhost:5001/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Checkout failed");
        setLoading(false);
        return;
      }

      // ================= QR =================
      const qrPayload = {
        merchant: "CartSense",
        amount: total.toFixed(2),
        currency: "PHP",
        ref: payload.ref,
        cartId: data.cartId,
        items: payload.items,
      };

      setQrData(JSON.stringify(qrPayload));
      setShowQR(true);

      // clear cart
      setProducts([]);
    } catch (err) {
      console.error(err);
      alert("Cannot connect to server");
    }

    setLoading(false);
  };

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

        {/* BUDGET */}
        {!isBudgetSet ? (
          <GlassCard className="p-6">
            <h3 className="text-white mb-4">Set Budget (₱)</h3>
            <div className="flex gap-4">
              <input
                type="number"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                className="flex-1 px-4 py-2"
              />
              <RoundedButton onClick={handleSetBudget}>Start</RoundedButton>
            </div>
          </GlassCard>
        ) : (
          <>
            {/* SUMMARY */}
            <GlassCard className="p-4 mb-4 text-white">
              <p>Total: ₱{total.toFixed(2)}</p>
              <p>Remaining: ₱{remaining.toFixed(2)}</p>

              <div className="w-full bg-gray-700 h-3 rounded mt-2">
                <div
                  className="h-3 bg-green-400 rounded"
                  style={{ width: `${percentUsed}%` }}
                />
              </div>
            </GlassCard>

            {/* CART */}
            <GlassCard className="p-4 mb-4 text-white">
              {products.map((p) => (
                <div key={p.id} className="flex justify-between mb-2">
                  <span>
                    {p.item || "Unknown Item"} x{p.qty}
                  </span>
                  <span>₱{p.price}</span>
                  <button onClick={() => handleRemoveProduct(p.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </GlassCard>

            {/* CHECKOUT */}
            <RoundedButton
              onClick={handleCheckout}
              disabled={loading}
              className="w-full mb-4 bg-green-500/20"
            >
              {loading ? "Processing..." : "💳 Checkout (QR Payment)"}
            </RoundedButton>

            <RoundedButton onClick={() => setShowAddForm(true)}>
              <Plus /> Add Item
            </RoundedButton>
          </>
        )}

        {/* QR MODAL */}
        {showQR && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
            <div className="bg-[#1b4d2e] p-6 rounded-xl text-center">
              <h2 className="text-white mb-3">Scan to Pay</h2>

              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  qrData,
                )}`}
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
