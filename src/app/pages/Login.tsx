import React, { useState } from "react";
import { useNavigate } from "react-router";
import { GlassCard } from "../components/GlassCard";
import { RoundedButton } from "../components/RoundedButton";
import { ShoppingCart, Mail, Lock, AlertCircle } from "lucide-react";

import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";

export function Login() {
  const navigate = useNavigate();

  // =========================
  // API BASE (NO trailing slash)
  // =========================
  const API = "http://localhost/CartSense/cart-sense-api/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // LOGIN HANDLER
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const url = `${API}login.php`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      // =========================
      // HANDLE NON-200 ERRORS
      // =========================
      const text = await res.text();

      console.log("HTTP STATUS:", res.status);
      console.log("RAW RESPONSE:", text);

      if (!res.ok) {
        throw new Error(text || `HTTP Error ${res.status}`);
      }

      if (!text) {
        throw new Error("Empty server response");
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("JSON PARSE ERROR:", err);
        throw new Error("Invalid JSON returned from server");
      }

      // =========================
      // LOGIN RESULT
      // =========================
      if (data.status === "success") {
        const user = data.user;

        localStorage.setItem("user", JSON.stringify(user));

        toast.success(`Welcome ${user.name}`);

        // ROLE REDIRECT
        if (user.role === "cashier") {
          navigate("/cashier");
        } else if (user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/home");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err: any) {
      console.error("LOGIN ERROR:", err);
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0a1f14] via-[#1b4d2e] to-[#0a1f14]">
      <div className="w-full max-w-md">
        <GlassCard>
          {/* ICON */}
          <div className="flex justify-center mb-6">
            <ShoppingCart className="w-16 h-16 text-[#fdf5e6]" />
          </div>

          {/* TITLE */}
          <h2 className="text-center mb-6 text-[#fdf5e6] text-2xl font-bold">
            Welcome Back
          </h2>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* EMAIL */}
            <div>
              <Label className="text-[#fdf5e6] mb-2 block">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-[#fdf5e6]/60" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <Label className="text-[#fdf5e6] mb-2 block">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-[#fdf5e6]/60" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {/* BUTTON */}
            <RoundedButton
              type="submit"
              className="w-full mt-6"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </RoundedButton>
          </form>

          {/* SIGNUP */}
          <div className="mt-6 text-center">
            <p className="text-[#fdf5e6]/60 text-sm">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-[#fdf5e6] hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
