"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Shield, AlertTriangle, Search, TrendingUp, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FraudFeed from "@/components/fraud/FraudFeed";
import FraudMap from "@/components/fraud/FraudMap";
import KPI, { KPIGrid } from "@/components/ui/KPI";
import Card, { CardContent, CardHeader } from "@/components/ui/Card";
import BarChart from "@/components/charts/BarChart";
import { api } from "@/lib/api";

export default function FraudSentinelPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.getFraudStats().then(setStats).catch(() => {});
  }, []);

  const riskData = stats?.riskDistribution
    ? Object.entries(stats.riskDistribution).map(([name, value]) => ({ name, alerts: value as number }))
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => router.push("/")} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Fraud Sentinel AI</h1>
              <p className="text-gray-500 mt-1">Real-time fraud monitoring and risk intelligence</p>
            </div>
          </div>
        </div>

        <KPIGrid>
          <KPI label="Total Alerts" value={stats?.total || 0} icon={<AlertTriangle className="w-5 h-5" />} />
          <KPI label="High Risk" value={stats?.highRiskCount || 0} icon={<Shield className="w-5 h-5" />} />
          <KPI label="Avg Risk Score" value={`${stats?.avgRiskScore || 0}%`} icon={<TrendingUp className="w-5 h-5" />} />
          <KPI label="Active Investigations" value={stats?.byStatus?.investigating || 0} icon={<Search className="w-5 h-5" />} />
        </KPIGrid>

        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><h3 className="font-semibold text-gray-900">Fraud Hotspots Map</h3></CardHeader>
              <CardContent className="p-0">
                <FraudMap />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><h3 className="font-semibold text-gray-900">Risk Score Distribution</h3></CardHeader>
              <CardContent>
                {riskData.length > 0 ? (
                  <BarChart data={riskData} bars={[{ key: "alerts", color: "#ef4444", name: "Alerts" }]} height={250} />
                ) : (
                  <p className="text-center text-gray-400 py-8">No data</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-900">Live Fraud Feed</h3>
              </CardHeader>
              <CardContent className="max-h-[600px] overflow-y-auto">
                <FraudFeed />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
