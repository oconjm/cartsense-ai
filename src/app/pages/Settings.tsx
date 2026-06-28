import React from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { GlassCard } from "../components/GlassCard";
import { RoundedButton } from "../components/RoundedButton";
import { ArrowLeft, User, HelpCircle, ChevronRight } from "lucide-react";

export function Settings() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const settingsOptions = [
    {
      icon: User,
      label: "Profile Settings",
      description: "Update your personal information",
      path: "/settings/profile",
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      description: "Get help and contact support",
      path: "/settings/help",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1f14] via-[#1b4d2e] to-[#0a1f14]">
      <div className="max-w-4xl mx-auto min-h-screen px-5 py-6">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <RoundedButton
            onClick={() => navigate("/home")}
            variant="secondary"
            className="
      !w-12
      !h-12
      !p-0
      !flex
      !items-center
      !justify-center
      rounded-full
    "
          >
            <ArrowLeft className="w-5 h-5 shrink-0" />
          </RoundedButton>

          <div>
            <h1 className="text-3xl font-bold text-[#fdf5e6]">Settings</h1>
            <p className="text-[#fdf5e6]/70 text-sm">
              Manage your account and preferences
            </p>
          </div>
        </div>

        {/* SETTINGS OPTIONS */}
        <div className="space-y-4">
          {settingsOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => navigate(option.path)}
              className="w-full"
            >
              <GlassCard
                className="
                  cursor-pointer
                  transition-all
                  duration-300
                  hover:scale-[1.01]
                  hover:bg-white/10
                  hover:border-white/20
                "
              >
                <div className="flex items-center gap-5 p-2">
                  <div className="w-14 h-14 rounded-2xl bg-[#2d5a3f]/60 flex items-center justify-center flex-shrink-0">
                    <option.icon className="w-7 h-7 text-[#fdf5e6]" />
                  </div>

                  <div className="flex-1 text-left">
                    <h3 className="text-[#fdf5e6] font-semibold text-lg">
                      {option.label}
                    </h3>

                    <p className="text-[#fdf5e6]/60 text-sm">
                      {option.description}
                    </p>
                  </div>

                  <ChevronRight className="w-5 h-5 text-[#fdf5e6]/50" />
                </div>
              </GlassCard>
            </button>
          ))}
        </div>

        {/* ACCOUNT INFO */}
        <GlassCard className="mt-6">
          <div className="text-center py-2">
            <p className="text-[#fdf5e6]/60 text-sm mb-1">Logged in as</p>

            <p className="text-[#fdf5e6] font-medium break-all">
              {user?.email}
            </p>
          </div>
        </GlassCard>

        {/* LOGOUT */}
        <div className="mt-8">
          <RoundedButton
            onClick={() => navigate("/login")}
            className="
              w-full
              !bg-[#2d5a3f]
              hover:!bg-[#244a33]
              !text-[#fdf5e6]
              !py-4
            "
          >
            Logout
          </RoundedButton>
        </div>
      </div>
    </div>
  );
}
