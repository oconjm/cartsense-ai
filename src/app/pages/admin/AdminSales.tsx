import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import { AdminLayout } from "../../components/AdminLayout";
import { GlassCard } from "../../components/GlassCard";
import { RoundedButton } from "../../components/RoundedButton";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Sparkles,
  MessageCircle,
  X,
  Send,
  Brain,
  AlertTriangle,
  Package,
} from "lucide-react";

import { Input } from "../../components/ui/input";

interface SalesData {
  month: string;
  sales: number;
  revenue: number;
}

interface BestSelling {
  name: string;
  units: number;
  revenue: number;
}

interface Prediction {
  title: string;
  prediction: string;
  detail: string;
  icon: any;
  color: string;
}

interface ChatMessage {
  type: "user" | "ai";
  message: string;
}

interface AIResponse {
  current_sales: number;
  predicted_sales: number;
  growth: string;
}

export function AdminSales() {
  const API = "http://localhost/CartSense/cart-sense-api/";

  // FLASK AI SERVER
  const AI_API = "http://localhost:5000";

  const [chatOpen, setChatOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      type: "ai",
      message:
        "Hello Admin 👋 I am your AI Sales Assistant. Ask me about sales, revenue, inventory, predictions, and trends.",
    },
  ]);

  const [chatInput, setChatInput] = useState("");

  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [bestSelling, setBestSelling] = useState<BestSelling[]>([]);
  const [loading, setLoading] = useState(true);

  const [aiPredictions, setAiPredictions] = useState<Prediction[]>([]);

  const [aiForecast, setAiForecast] = useState<AIResponse | null>(null);

  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchSalesData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const fetchSalesData = async () => {
    try {
      setLoading(true);

      const [salesRes, bestSellingRes, lowStockRes, revenueRes, predictionRes] =
        await Promise.all([
          axios.get(`${API}/get_sales_chart.php`),
          axios.get(`${API}/get_best_selling.php`),
          axios.get(`${API}/get_low_stock.php`),
          axios.get(`${API}/get_revenue.php`),
          axios.get(`${AI_API}/predict-sales`),
        ]);

      // SALES CHART
      if (Array.isArray(salesRes.data)) {
        setSalesData(salesRes.data);
      }

      // BEST SELLING
      if (Array.isArray(bestSellingRes.data)) {
        setBestSelling(bestSellingRes.data);
      }

      // AI FORECAST
      setAiForecast(predictionRes.data);

      const predictions: Prediction[] = [
        {
          title: "AI Revenue Forecast",
          prediction: `₱${Number(
            predictionRes.data?.predicted_sales || 0,
          ).toLocaleString()}`,
          detail: `Predicted growth: ${predictionRes.data?.growth || "0%"}`,
          icon: Brain,
          color: "green",
        },

        {
          title: "Current Revenue",
          prediction: `₱${Number(
            revenueRes.data?.total || 0,
          ).toLocaleString()}`,
          detail: "Live revenue from database",
          icon: DollarSign,
          color: "blue",
        },

        {
          title: "Low Stock Alert",
          prediction: `${lowStockRes.data?.length || 0} products`,
          detail: "Items below critical stock",
          icon: AlertTriangle,
          color: "yellow",
        },

        {
          title: "Best Seller",
          prediction: bestSellingRes.data?.[0]?.name || "No Data",
          detail: `${bestSellingRes.data?.[0]?.units || 0} total units sold`,
          icon: TrendingUp,
          color: "green",
        },
      ];

      setAiPredictions(predictions);
    } catch (error) {
      console.error("AI Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // AI CHATBOT
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput;

    setChatMessages((prev) => [
      ...prev,
      {
        type: "user",
        message: userMessage,
      },
    ]);

    setChatInput("");

    try {
      setSending(true);

      const response = await axios.post(`${AI_API}/ai-chat`, {
        message: `
You are an AI sales assistant for Cart Sense.

Store Data:
- Current Revenue: ₱${aiForecast?.current_sales || 0}
- Predicted Revenue: ₱${aiForecast?.predicted_sales || 0}
- Best Selling Product: ${bestSelling?.[0]?.name || "Unknown"}
- Best Selling Units: ${bestSelling?.[0]?.units || 0}

Admin Question:
${userMessage}
        `,
      });

      setChatMessages((prev) => [
        ...prev,
        {
          type: "ai",
          message: response.data.reply || "AI server connected successfully.",
        },
      ]);
    } catch (error) {
      console.error(error);

      setChatMessages((prev) => [
        ...prev,
        {
          type: "ai",
          message:
            "Unable to connect to local AI server. Make sure Flask + Ollama are running.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-[#fdf5e6] text-center mt-10">
          Loading AI Sales Analytics...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-[#fdf5e6] text-3xl font-bold">
            AI Sales Analytics
          </h1>

          <p className="text-[#fdf5e6]/70 text-sm">
            Predictive analytics powered by Local AI
          </p>
        </div>

        <RoundedButton
          onClick={() => setChatOpen(true)}
          className="bg-[#2d5a3f] hover:bg-[#3c7350]"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          AI Assistant
        </RoundedButton>
      </div>

      {/* AI INSIGHTS */}
      <div className="mb-6">
        <h3 className="text-[#fdf5e6] mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          AI Insights & Predictions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {aiPredictions.map((prediction, index) => (
            <GlassCard key={index}>
              <div className="flex items-start gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    prediction.color === "green"
                      ? "bg-green-900/30"
                      : prediction.color === "yellow"
                        ? "bg-yellow-900/30"
                        : "bg-blue-900/30"
                  }`}
                >
                  <prediction.icon
                    className={`w-6 h-6 ${
                      prediction.color === "green"
                        ? "text-green-400"
                        : prediction.color === "yellow"
                          ? "text-yellow-400"
                          : "text-blue-400"
                    }`}
                  />
                </div>

                <div className="flex-1">
                  <h4 className="text-[#fdf5e6]/70 text-sm mb-1">
                    {prediction.title}
                  </h4>

                  <p
                    className={`text-lg font-bold mb-1 ${
                      prediction.color === "green"
                        ? "text-green-400"
                        : prediction.color === "yellow"
                          ? "text-yellow-400"
                          : "text-blue-400"
                    }`}
                  >
                    {prediction.prediction}
                  </p>

                  <p className="text-[#fdf5e6]/50 text-xs">
                    {prediction.detail}
                  </p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* SALES CHART */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-green-400 w-5 h-5" />

            <h3 className="text-[#fdf5e6] text-lg font-semibold">
              Monthly Sales
            </h3>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={salesData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(253,245,230,0.15)"
              />

              <XAxis
                dataKey="month"
                stroke="#fdf5e6"
                tick={{ fontSize: 12, fill: "#fdf5e6" }}
                axisLine={{ stroke: "rgba(253,245,230,0.3)" }}
                dx={10}
              />

              <YAxis
                stroke="#fdf5e6"
                tick={{ fontSize: 12, fill: "#fdf5e6" }}
                axisLine={{ stroke: "rgba(253,245,230,0.3)" }}
                width={45}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  color: "#ffffff",
                }}
                labelStyle={{ color: "#ffffff" }}
                itemStyle={{ color: "#ffffff" }}
              />

              <Bar dataKey="sales" fill="#2d5a3f" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* REVENUE TREND */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="text-blue-400 w-5 h-5" />

            <h3 className="text-[#fdf5e6] text-lg font-semibold">
              Revenue Trend
            </h3>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={salesData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(253,245,230,0.15)"
              />

              <XAxis
                dataKey="month"
                stroke="#fdf5e6"
                tick={{ fontSize: 12, fill: "#fdf5e6" }}
                axisLine={{ stroke: "rgba(253,245,230,0.3)" }}
                dx={10}
              />

              <YAxis
                stroke="#fdf5e6"
                tick={{ fontSize: 12, fill: "#fdf5e6" }}
                axisLine={{ stroke: "rgba(253,245,230,0.3)" }}
                width={55}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  color: "#ffffff",
                }}
                labelStyle={{ color: "#ffffff" }}
                itemStyle={{ color: "#ffffff" }}
              />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#fdf5e6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* AI FORECAST */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FORECAST GRAPH */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Brain className="text-purple-400 w-5 h-5" />

            <h3 className="text-[#fdf5e6] text-lg font-semibold">
              AI Forecast Analysis
            </h3>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(253,245,230,0.15)"
              />

              <XAxis
                dataKey="month"
                stroke="#fdf5e6"
                tick={{ fontSize: 12, fill: "#fdf5e6" }}
                axisLine={{ stroke: "rgba(253,245,230,0.3)" }}
                dx={10}
              />

              <YAxis
                stroke="#fdf5e6"
                tick={{ fontSize: 12, fill: "#fdf5e6" }}
                axisLine={{ stroke: "rgba(253,245,230,0.3)" }}
                width={55}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  color: "#ffffff",
                }}
                labelStyle={{ color: "#ffffff" }}
                itemStyle={{ color: "#ffffff" }}
              />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#2d5a3f"
                fill="#2d5a3f"
              />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* BEST SELLING */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Package className="text-yellow-400 w-5 h-5" />

            <h3 className="text-[#fdf5e6] text-lg font-semibold">
              Top Selling Products
            </h3>
          </div>

          <div className="space-y-3">
            {bestSelling.map((item, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-xl p-4"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-[#fdf5e6] font-medium">{item.name}</h4>

                    <p className="text-[#fdf5e6]/60 text-sm">
                      {item.units} units sold
                    </p>
                  </div>

                  <div className="text-green-400 font-bold">
                    ₱{Number(item.revenue).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* AI CHATBOT */}
      {chatOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-[380px] h-[600px] bg-[#10231a] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          {/* HEADER */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <Brain className="text-green-400 w-5 h-5" />
              </div>

              <div>
                <h3 className="text-[#fdf5e6] font-semibold">Cart Sense AI</h3>

                <p className="text-green-400 text-xs">Local AI Assistant</p>
              </div>
            </div>

            <button onClick={() => setChatOpen(false)}>
              <X className="text-[#fdf5e6] w-5 h-5" />
            </button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    msg.type === "user"
                      ? "bg-[#2d5a3f] text-white"
                      : "bg-white/10 text-[#fdf5e6]"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            ))}

            {sending && (
              <div className="text-[#fdf5e6]/50 text-sm">AI is thinking...</div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div className="p-4 border-t border-white/10 flex gap-2">
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask AI about sales..."
              className="bg-white/10 border-white/10 text-[#fdf5e6]"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />

            <button
              onClick={handleSendMessage}
              className="w-12 h-12 rounded-xl bg-[#2d5a3f] hover:bg-[#3b7552] flex items-center justify-center"
            >
              <Send className="text-white w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
