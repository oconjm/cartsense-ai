import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { RoundedButton } from "../components/RoundedButton";
import { Input } from "../components/ui/input";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  cartId: string;
}

interface Cart {
  id: string;
  name: string;
}

interface CatalogItem {
  id: string;
  name: string;
  price: number;
}

export function CashierDashboard() {
  const { user, logout } = useAuth();

  // ===================== API PATH =====================
  const API = "http://localhost/CartSense/cart-sense-api/";

  const [products, setProducts] = useState<Product[]>([]);
  const [carts, setCarts] = useState<Cart[]>([]);
  const [activeCart, setActiveCart] = useState<string>("");
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<CatalogItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
  const [loading, setLoading] = useState(false);

  // ===================== FETCH CARTS =====================
  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const res = await fetch(`${API}/get_carts.php`);

        const data = await res.json();

        if (Array.isArray(data)) {
          setCarts(data);

          if (data.length > 0 && !activeCart) {
            setActiveCart(data[0].id);
          }
        }
      } catch (err) {
        console.error("Cart fetch error:", err);
        toast.error("Failed to load carts");
      }
    };

    fetchCarts();
  }, []);

  // ===================== FETCH ITEMS =====================
  useEffect(() => {
    if (!user || !activeCart) return;

    let mounted = true;

    const fetchItems = async () => {
      try {
        const res = await fetch(
          `${API}/get_cart_items.php?cart_id=${activeCart}`,
        );

        const data = await res.json();

        if (mounted && Array.isArray(data)) {
          // NORMALIZE DATABASE FIELDS
          const normalized = data.map((p: any) => ({
            id: p.id,
            name: p.name || p.item || p.product_name || "Unknown Item",
            quantity: Number(p.quantity || p.qty || 1),
            price: Number(p.price || 0),
            cartId: p.cartId || activeCart,
          }));

          setProducts(normalized);
        }
      } catch (err) {
        console.error("Item fetch error:", err);
      }
    };

    fetchItems();

    const interval = setInterval(fetchItems, 2000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [user, activeCart]);

  // ===================== TOTAL =====================
  const total = useMemo(() => {
    return products.reduce(
      (sum, p) => sum + Number(p.price) * Number(p.quantity),
      0,
    );
  }, [products]);

  // ===================== PRINT RECEIPT =====================
  const printReceipt = async () => {
    if (products.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/print_receipt.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart_name:
            carts.find((c) => c.id === activeCart)?.name || "Unknown Cart",

          items: products.map((p) => ({
            name: p.name,
            quantity: Number(p.quantity),
            price: Number(p.price),
          })),

          total,
          cashier: user?.name || "Staff",
          date: new Date().toLocaleString(),
        }),
      });

      const html = await res.text();

      const printWindow = window.open("", "_blank", "width=400,height=600");

      if (!printWindow) {
        toast.error("Popup blocked. Enable popups.");
        return;
      }

      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
    } catch (err) {
      console.error(err);
      toast.error("Printing failed");
    }

    setLoading(false);
  };

  // ===================== SEARCH =====================
  const handleSearch = async (val: string) => {
    setSearch(val);

    if (val.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(`${API}/search_product.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: val,
        }),
      });

      const data = await res.json();

      setSuggestions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  // ===================== ADD TO CART =====================
  const addToCart = async () => {
    if (!selectedItem || !activeCart) return;

    try {
      await fetch(`${API}/add_product.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user?.id,
          name: selectedItem.name,
          price: selectedItem.price,
          quantity: 1,
          cartId: activeCart,
        }),
      });

      toast.success("Added to cart");

      setSelectedItem(null);
      setSearch("");
      setSuggestions([]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add item");
    }
  };

  // ===================== UI =====================
  return (
    <div className="min-h-screen bg-green-950 text-white p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Smart Cashier POS</h1>

        <button onClick={logout}>
          <LogOut />
        </button>
      </div>

      {/* CART TABS */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {carts.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCart(c.id)}
            className={`px-4 py-2 rounded text-white ${
              activeCart === c.id ? "bg-green-500" : "bg-gray-700"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4 text-black">
        {/* SEARCH */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-3 text-lg">Search Items</h2>

          <Input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search product..."
          />

          {/* SUGGESTIONS */}
          <div className="mt-2">
            {suggestions.map((s) => (
              <div
                key={s.id}
                onClick={() => {
                  setSelectedItem(s);
                  setSearch(s.name);
                  setSuggestions([]);
                }}
                className="p-2 border-b cursor-pointer hover:bg-gray-100"
              >
                {s.name} - ₱{Number(s.price).toFixed(2)}
              </div>
            ))}
          </div>

          {/* ADD BUTTON */}
          {selectedItem && (
            <RoundedButton onClick={addToCart} className="mt-3 w-full">
              Add to Cart
            </RoundedButton>
          )}
        </div>

        {/* CART */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-3 text-lg">
            Cart: {carts.find((c) => c.id === activeCart)?.name || "No Cart"}
          </h2>

          {products.length === 0 ? (
            <div className="text-gray-500">No items in cart</div>
          ) : (
            products.map((p) => (
              <div
                key={p.id}
                className="flex justify-between border-b py-2 text-sm"
              >
                <span>
                  {p.name} (x{p.quantity})
                </span>

                <span>
                  ₱{(Number(p.price) * Number(p.quantity)).toFixed(2)}
                </span>
              </div>
            ))
          )}
        </div>

        {/* SUMMARY */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-3 text-lg">Summary</h2>

          <div className="text-3xl font-black mb-4">₱{total.toFixed(2)}</div>

          <RoundedButton
            onClick={printReceipt}
            disabled={loading}
            className="w-full bg-blue-600 text-white"
          >
            {loading ? "Printing..." : "Print 80mm Receipt"}
          </RoundedButton>
        </div>
      </div>
    </div>
  );
}
