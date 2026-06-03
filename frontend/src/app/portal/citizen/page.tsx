"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, User, PiggyBank, BarChart3, MessageSquare, Shield,
  TrendingUp, DollarSign, CreditCard,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Card, { CardContent, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import KPI, { KPIGrid } from "@/components/ui/KPI";
import CreditScoreForm from "@/components/credit/CreditScoreForm";
import { api } from "@/lib/api";

export default function CitizenPortal() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [overview, setOverview] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    api.getAnalyticsOverview().then(setOverview).catch(() => {});
  }, []);

  const features = [
    { icon: <PiggyBank className="w-5 h-5" />, label: "Digital Savings", desc: "Save from UGX 5,000", href: "/treasury", color: "bg-green-50 text-green-600" },
    { icon: <BarChart3 className="w-5 h-5" />, label: "Credit Score", desc: "Check your score", href: "#credit-score", color: "bg-blue-50 text-blue-600" },
    { icon: <MessageSquare className="w-5 h-5" />, label: "Submit Complaint", desc: "Report an issue", href: "/consumer-protection", color: "bg-red-50 text-red-600" },
    { icon: <Shield className="w-5 h-5" />, label: "Fraud Alerts", desc: "Stay protected", href: "/fraud-sentinel", color: "bg-yellow-50 text-yellow-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => router.push("/")} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-xl bg-bou-50 flex items-center justify-center">
            <User className="w-7 h-7 text-bou-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Citizen Portal</h1>
            <p className="text-gray-500">{user?.name || "Welcome"} &middot; {user?.district || "Uganda"}</p>
          </div>
        </div>

        <KPIGrid>
          <KPI label="Your Balance" value={user?.balance ? `UGX ${user.balance.toLocaleString()}` : "--"} icon={<DollarSign className="w-5 h-5" />} />
          <KPI label="Credit Score" value={user?.creditScore || "--"} icon={<TrendingUp className="w-5 h-5" />} />
          <KPI label="Platform Users" value={overview?.totalUsers || 0} icon={<User className="w-5 h-5" />} />
          <KPI label="Total Savings" value={overview?.totalSavings || 0} icon={<CreditCard className="w-5 h-5" />} />
        </KPIGrid>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 mb-8">
          {features.map((f) => (
            <button
              key={f.label}
              onClick={() => router.push(f.href)}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-bou-200 transition-all text-left"
            >
              <div className={`w-10 h-10 rounded-lg ${f.color} flex items-center justify-center mb-3`}>
                {f.icon}
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{f.label}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
            </button>
          ))}
        </div>

        <div id="credit-score">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Alternative Credit Scoring</h2>
          <CreditScoreForm />
        </div>
      </div>
      <Footer />
    </div>
  );
}
