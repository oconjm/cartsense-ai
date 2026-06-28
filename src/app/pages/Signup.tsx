import React, { useState } from "react";
import { useNavigate } from "react-router";

import { GlassCard } from "../components/GlassCard";
import { RoundedButton } from "../components/RoundedButton";

import { ShoppingCart } from "lucide-react";

import { Input } from "../components/ui/input";

import { toast } from "sonner";

export function Signup() {
  const navigate = useNavigate();

  // =========================
  // API PATH
  // =========================
  const API = "http://localhost/CartSense/cart-sense-api/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // =========================
  // SIGNUP HANDLER
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // VALIDATION
    if (!name || !email || !password) {
      toast.error("Please fill all fields");

      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/signup.php`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      // =========================
      // SUCCESS
      // =========================
      if (data.status === "success") {
        toast.success("Account created successfully");

        // CLEAR FIELDS
        setName("");
        setEmail("");
        setPassword("");

        // REDIRECT
        navigate("/login");
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (error) {
      console.error(error);

      toast.error("Server error");
    } finally {
      // IMPORTANT
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-950 to-green-800 p-4">
      <GlassCard className="w-full max-w-md">
        {/* ICON */}
        <div className="flex justify-center mb-4">
          <ShoppingCart className="w-14 h-14 text-white" />
        </div>

        {/* TITLE */}
        <h2 className="text-center text-white mb-4 text-2xl font-bold">
          Create Account
        </h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NAME */}
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* EMAIL */}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD */}
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* BUTTON */}
          <RoundedButton type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </RoundedButton>
        </form>

        {/* LOGIN LINK */}
        <div className="text-center mt-4 text-white/60 text-sm">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-white underline"
          >
            Login
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
