"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Map, TrendingUp, Users, Banknote, Building } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import InclusionMap from "@/components/map/InclusionMap";
import KPI, { KPIGrid } from "@/components/ui/KPI";
import Card, { CardContent, CardHeader } from "@/components/ui/Card";
import BarChart from "@/components/charts/BarChart";
import { api } from "@/lib/api";

export default function InclusionMapPage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    api.getFinancialInclusion().then((res) => setData(res.data || [])).catch(() => {});
  }, []);

  const avgAccess = data.length > 0
    ? Math.round(data.reduce((s, d) => s + d.accessScore, 0) / data.length)
    : 0;

  const districtScores = data
    .sort((a, b) => b.accessScore - a.accessScore)
    .slice(0, 10)
    .map((d) => ({ name: d.district, score: d.accessScore }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => router.push("/")} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Financial Inclusion Map</h1>
          <p className="text-gray-500 mt-1">GIS-driven visualization of Uganda&apos;s financial access landscape</p>
        </div>

        <KPIGrid>
          <KPI label="Districts Mapped" value={data.length} icon={<Map className="w-5 h-5" />} />
          <KPI label="Avg Access Score" value={`${avgAccess}%`} icon={<TrendingUp className="w-5 h-5" />} />
          <KPI label="Total Bank Branches" value={data.reduce((s, d) => s + d.bankBranches, 0)} icon={<Building className="w-5 h-5" />} />
          <KPI label="Total Agents" value={data.reduce((s, d) => s + d.agents, 0).toLocaleString()} icon={<Users className="w-5 h-5" />} />
        </KPIGrid>

        <div className="mt-8">
          <InclusionMap height={500} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader><h3 className="font-semibold text-gray-900">Financial Access by District</h3></CardHeader>
            <CardContent>
              <BarChart
                data={districtScores}
                bars={[{ key: "score", color: "#006B3F", name: "Access Score" }]}
                height={350}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><h3 className="font-semibold text-gray-900">Infrastructure Summary</h3></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: "Total Bank Branches", value: data.reduce((s, d) => s + d.bankBranches, 0), icon: <Building className="w-4 h-4" />, color: "text-blue-600" },
                  { label: "Total SACCOs", value: data.reduce((s, d) => s + d.saccos, 0), icon: <Users className="w-4 h-4" />, color: "text-green-600" },
                  { label: "Total Agents", value: data.reduce((s, d) => s + d.agents, 0).toLocaleString(), icon: <Banknote className="w-4 h-4" />, color: "text-yellow-600" },
                  { label: "Total ATMs", value: data.reduce((s, d) => s + d.atms, 0), icon: <Building className="w-4 h-4" />, color: "text-purple-600" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className={item.color}>{item.icon}</span>
                      <span className="text-sm text-gray-600">{item.label}</span>
                    </div>
                    <span className="font-bold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
