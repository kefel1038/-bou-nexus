"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Sprout, PiggyBank, BarChart3, MessageSquare,
  TrendingUp, DollarSign, Sun,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Card, { CardContent, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import KPI, { KPIGrid } from "@/components/ui/KPI";
import CreditScoreForm from "@/components/credit/CreditScoreForm";
import { api } from "@/lib/api";

export default function FarmerPortal() {
  const router = useRouter();
  const [overview, setOverview] = useState<any>(null);

  useEffect(() => {
    api.getAnalyticsOverview().then(setOverview).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => router.push("/")} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center">
            <Sprout className="w-7 h-7 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Farmer Portal</h1>
            <p className="text-gray-500">Agricultural financial services & credit scoring</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <Sun className="w-6 h-6" />, title: "Crop-Based Credit", desc: "Get loans based on your crop yield history", color: "from-green-500 to-emerald-600" },
            { icon: <PiggyBank className="w-6 h-6" />, title: "Farm Savings", desc: "Save for seeds, equipment, and harvest", color: "from-bou-500 to-bou-600" },
            { icon: <BarChart3 className="w-6 h-6" />, title: "Yield Analytics", desc: "Track and predict crop performance", color: "from-blue-500 to-blue-600" },
            { icon: <MessageSquare className="w-6 h-6" />, title: "Report Issues", desc: "Report agent misconduct or loan abuse", color: "from-red-500 to-red-600" },
          ].map((item) => (
            <div key={item.title} className={`bg-gradient-to-br ${item.color} rounded-xl p-5 text-white`}>
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mb-3">
                {item.icon}
              </div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-white/80 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Agricultural Credit Scoring</h2>
            <CreditScoreForm />
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader><h3 className="font-semibold text-gray-900">Quick Stats</h3></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Active Farmers", value: overview?.totalUsers ? Math.round(overview.totalUsers * 0.2) : 0 },
                  { label: "Avg Credit Score", value: overview?.avgCreditScore || 0 },
                  { label: "Agriculture SMEs", value: overview?.totalSMEs ? Math.round(overview.totalSMEs * 0.35) : 0 },
                ].map((stat) => (
                  <div key={stat.label} className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{stat.label}</span>
                    <span className="text-lg font-bold text-bou-500">{stat.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><h3 className="font-semibold text-gray-900">Quick Actions</h3></CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" onClick={() => router.push("/treasury")}>Invest in T-Bills</Button>
                <Button variant="outline" className="w-full" onClick={() => router.push("/consumer-protection")}>Submit Complaint</Button>
                <Button variant="ghost" className="w-full" onClick={() => router.push("/inclusion-map")}>View Inclusion Map</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
