"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, TrendingUp, PieChart as PieChartIcon, DollarSign, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import InvestmentCard from "@/components/treasury/InvestmentCard";
import KPI, { KPIGrid } from "@/components/ui/KPI";
import Card, { CardContent, CardHeader } from "@/components/ui/Card";
import PieChart from "@/components/charts/PieChart";
import BarChart from "@/components/charts/BarChart";
import { api } from "@/lib/api";

export default function TreasuryPage() {
  const router = useRouter();
  const [savings, setSavings] = useState<any[]>([]);
  const [investments, setInvestments] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  const fetchData = () => {
    api.getSavings().then((r) => setSavings(r.data || [])).catch(() => {});
    api.getInvestments().then((r) => setInvestments(r.data || [])).catch(() => {});
    api.getAnalyticsOverview().then(setAnalytics).catch(() => {});
  };

  useEffect(() => { fetchData(); }, []);

  const handleInvest = async (data: any) => {
    try {
      const endpoint = data.type === "savings" ? api.createSavings : api.createInvestment;
      await endpoint(data);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const tbillCount = investments.filter((i) => i.type === "tbill").length;
  const tbondCount = investments.filter((i) => i.type === "tbond").length;
  const totalInvested = investments.reduce((s, i) => s + i.amount, 0);

  const pieData = [
    { name: "T-Bills", value: tbillCount },
    { name: "T-Bonds", value: tbondCount },
    { name: "Savings", value: savings.length - tbillCount - tbondCount },
  ];

  const byDistrict: Record<string, number> = {};
  [...savings, ...investments].forEach((item) => {
    byDistrict[item.district] = (byDistrict[item.district] || 0) + item.amount;
  });
  const districtData = Object.entries(byDistrict)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, value]) => ({ name, value: Math.round(value / 1_000_000) }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => router.push("/")} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Digital Savings & Treasury Investments</h1>
          <p className="text-gray-500 mt-1">Invest in government securities from just UGX 5,000</p>
        </div>

        <KPIGrid>
          <KPI label="Total Investors" value={investments.length} icon={<Users className="w-5 h-5" />} />
          <KPI label="Total Invested" value={totalInvested} prefix="UGX " icon={<DollarSign className="w-5 h-5" />} />
          <KPI label="T-Bills Active" value={tbillCount} icon={<TrendingUp className="w-5 h-5" />} />
          <KPI label="T-Bonds Active" value={tbondCount} icon={<PieChartIcon className="w-5 h-5" />} />
        </KPIGrid>

        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-1">
            <InvestmentCard onInvest={handleInvest} />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-900">Investment Distribution by District</h3>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={districtData}
                  bars={[{ key: "value", color: "#4A2C1B", name: "Amount (UGX M)" }]}
                  height={300}
                />
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-gray-900">Portfolio Mix</h3>
                </CardHeader>
                <CardContent>
                  <PieChart data={pieData} height={250} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-gray-900">Recent Investments</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[280px] overflow-y-auto">
                    {investments.slice().reverse().slice(0, 8).map((inv) => (
                      <div key={inv.id} className="flex items-center justify-between pb-2 border-b border-gray-100 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{inv.name}</p>
                          <p className="text-xs text-gray-500">{inv.district} &middot; {inv.type === "tbill" ? "T-Bill" : "T-Bond"}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-bou-500">UGX {inv.amount.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">{inv.rate}% p.a.</p>
                        </div>
                      </div>
                    ))}
                    {investments.length === 0 && (
                      <p className="text-center text-gray-500 py-4 text-sm">No investments yet. Be the first!</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
