"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, MessageSquare, CheckCircle, Clock, AlertTriangle, Smartphone, MessageCircle, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ComplaintForm from "@/components/consumer/ComplaintForm";
import ComplaintList from "@/components/consumer/ComplaintList";
import USSDMenu from "@/components/consumer/USSDMenu";
import ChatBot from "@/components/consumer/ChatBot";
import KPI, { KPIGrid } from "@/components/ui/KPI";
import Card, { CardContent, CardHeader } from "@/components/ui/Card";
import PieChart from "@/components/charts/PieChart";
import BarChart from "@/components/charts/BarChart";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";

export default function ConsumerProtectionPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    api.getComplaintStats().then(setStats).catch(() => {});
  }, [refreshKey]);

  const pieData = stats
    ? Object.entries(stats.byType).map(([name, value]) => ({ name, value: value as number }))
    : [];

  const districtData = stats
    ? Object.entries(stats.byDistrict || {})
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 8)
        .map(([name, value]) => ({ name, complaints: value as number }))
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => router.push("/")} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Consumer Protection Center</h1>
          <p className="text-gray-500 mt-1">Submit complaints in 6 languages. Every voice matters.</p>
        </div>

        <KPIGrid>
          <KPI label="Total Complaints" value={stats?.total || 0} icon={<MessageSquare className="w-5 h-5" />} />
          <KPI label="Resolution Rate" value={`${stats?.resolutionRate || 0}%`} icon={<CheckCircle className="w-5 h-5" />} />
          <KPI label="Open Complaints" value={stats?.openComplaints || 0} icon={<Clock className="w-5 h-5" />} />
          <KPI label="Languages Supported" value="6" icon={<AlertTriangle className="w-5 h-5" />} />
        </KPIGrid>

        <div className="grid lg:grid-cols-4 gap-4 mt-8 mb-8">
          {[
            { icon: <Smartphone className="w-5 h-5" />, title: "USSD *260#", desc: "Dial from any phone", color: "from-green-500 to-emerald-600" },
            { icon: <MessageCircle className="w-5 h-5" />, title: "WhatsApp Chat", desc: "Talk to our financial bot", color: "from-green-600 to-green-700" },
            { icon: <GraduationCap className="w-5 h-5" />, title: "Financial Literacy", desc: "Learn & compare loans", color: "from-blue-500 to-blue-600" },
            { icon: <MessageSquare className="w-5 h-5" />, title: "6 Languages", desc: "English, Luganda, Luo + more", color: "from-purple-500 to-purple-600" },
          ].map((item) => (
            <div key={item.title} className={`bg-gradient-to-br ${item.color} rounded-xl p-4 text-white`}>
              <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center mb-2">{item.icon}</div>
              <h3 className="font-semibold text-sm">{item.title}</h3>
              <p className="text-xs text-white/80 mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          <div className="space-y-6">
            <ComplaintForm onSuccess={() => setRefreshKey((k) => k + 1)} />
            <USSDMenu />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader><h3 className="font-semibold text-gray-900">Complaint Types</h3></CardHeader>
                <CardContent>
                  {pieData.length > 0 ? (
                    <PieChart data={pieData} height={250} />
                  ) : (
                    <p className="text-center text-gray-400 py-8">No data</p>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><h3 className="font-semibold text-gray-900">By District</h3></CardHeader>
                <CardContent>
                  {districtData.length > 0 ? (
                    <BarChart data={districtData} bars={[{ key: "complaints", color: "#1E88E5", name: "Complaints" }]} height={250} />
                  ) : (
                    <p className="text-center text-gray-400 py-8">No data</p>
                  )}
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader><h3 className="font-semibold text-gray-900">All Complaints</h3></CardHeader>
              <CardContent className="max-h-[400px] overflow-y-auto">
                <ComplaintList />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
      <ChatBot />
    </div>
  );
}
