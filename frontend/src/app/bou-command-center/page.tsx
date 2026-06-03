"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Landmark, TrendingUp, Users, Shield, MessageSquare, Briefcase,
  BarChart3, PieChart as PieChartIcon, Map, DollarSign, AlertTriangle,
  RefreshCw, Activity, Banknote, Building, CreditCard, TreePine,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Card, { CardContent, CardHeader } from "@/components/ui/Card";
import KPICard from "@/components/dashboard/KPICard";
import BarChart from "@/components/charts/BarChart";
import PieChart from "@/components/charts/PieChart";
import LineChart from "@/components/charts/LineChart";
import AreaChart from "@/components/charts/AreaChart";
import FraudFeed from "@/components/fraud/FraudFeed";
import InclusionMap from "@/components/map/InclusionMap";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";
import { api } from "@/lib/api";

export default function BOUCommandCenter() {
  const router = useRouter();
  const [overview, setOverview] = useState<any>(null);
  const [consumer, setConsumer] = useState<any>(null);
  const [fraud, setFraud] = useState<any>(null);
  const [economic, setEconomic] = useState<any>(null);
  const [capital, setCapital] = useState<any>(null);
  const [inclusion, setInclusion] = useState<any[]>([]);
  const [fxRates, setFXRates] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = useCallback(() => {
    setRefreshing(true);
    Promise.all([
      api.getAnalyticsOverview().then(setOverview).catch(() => {}),
      api.getConsumerProtection().then(setConsumer).catch(() => {}),
      api.getFraudMonitoring().then(setFraud).catch(() => {}),
      api.getEconomicStats().then(setEconomic).catch(() => {}),
      api.getCapitalMarkets().then(setCapital).catch(() => {}),
      api.getFinancialInclusion().then((r) => setInclusion(r.data || [])).catch(() => {}),
      api.getFXRates().then((r) => setFXRates(r.data || [])).catch(() => {}),
    ]).finally(() => {
      setLastUpdated(new Date().toLocaleString());
      setRefreshing(false);
    });
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const pieData = consumer
    ? Object.entries(consumer.byType || {}).map(([name, value]) => ({ name, value: value as number }))
    : [];

  const riskData = fraud
    ? Object.entries(fraud.riskDistribution || {}).map(([name, value]) => ({ name, alerts: value as number }))
    : [];

  const sectorData = economic
    ? Object.entries(economic.sectorBreakdown || {})
        .map(([name, val]: any) => ({ name, revenue: Math.round(val.avgRevenue / 1_000_000) }))
        .sort((a, b) => b.revenue - a.revenue)
    : [];

  const districtAccess = inclusion
    .sort((a, b) => b.accessScore - a.accessScore)
    .slice(0, 8)
    .map((d) => ({ name: d.district, score: d.accessScore }));

  const capitalDistricts = capital
    ? Object.entries(capital.byDistrict || {})
        .map(([name, val]: any) => ({ name, value: Math.round(val.total / 1_000_000) }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8)
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-lg bg-bou-500 flex items-center justify-center">
                <Landmark className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Bank of Uganda Command Center</h1>
            </div>
            <p className="text-gray-500 text-sm ml-[52px]">
              National Financial Intelligence Dashboard {lastUpdated && `• Last updated: ${lastUpdated}`}
            </p>
          </div>
          <button
            onClick={fetchAll}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-8">
          <KPICard label="Total Users" value={overview?.totalUsers || 0} icon={<Users className="w-5 h-5" />} color="bou" />
          <KPICard label="Savings Accounts" value={overview?.totalSavings || 0} icon={<Banknote className="w-5 h-5" />} color="green" />
          <KPICard label="Investments" value={overview?.totalInvestments || 0} icon={<TrendingUp className="w-5 h-5" />} color="gold" />
          <KPICard label="Complaints" value={overview?.totalComplaints || 0} icon={<MessageSquare className="w-5 h-5" />} color="red" />
          <KPICard label="Fraud Alerts" value={overview?.totalFraudAlerts || 0} icon={<Shield className="w-5 h-5" />} color="red" />
          <KPICard label="SMEs" value={overview?.totalSMEs || 0} icon={<Briefcase className="w-5 h-5" />} color="blue" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-bou-500" />
                <h3 className="font-semibold text-gray-900">Financial Inclusion & Access Scores</h3>
              </div>
            </CardHeader>
            <CardContent>
              <BarChart data={districtAccess} bars={[{ key: "score", color: "#006B3F", name: "Access Score %" }]} height={300} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <h3 className="font-semibold text-gray-900">Fraud Risk Distribution</h3>
              </div>
            </CardHeader>
            <CardContent>
              <BarChart data={riskData} bars={[{ key: "alerts", color: "#ef4444", name: "Alerts" }]} height={300} />
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                <h3 className="font-semibold text-gray-900">Consumer Protection</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                {[
                  ["Total Complaints", consumer?.total || 0, "text-gray-900"],
                  ["Open Cases", consumer?.openComplaints || 0, "text-yellow-600"],
                  ["Resolution Rate", `${consumer?.resolutionRate || 0}%`, "text-green-600"],
                ].map(([label, value, color]) => (
                  <div key={label as string} className="flex justify-between items-center py-1">
                    <span className="text-sm text-gray-500">{label}</span>
                    <span className={`font-bold text-lg ${color}`}>{value}</span>
                  </div>
                ))}
              </div>
              {pieData.length > 0 && <PieChart data={pieData} height={200} innerRadius={40} outerRadius={70} />}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-green-500" />
                <h3 className="font-semibold text-gray-900">Economic Intelligence</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                {[
                  ["Active SMEs", economic?.activeSMEs || 0, "text-bou-500"],
                  ["Avg Health Score", `${economic?.avgHealthScore || 0}%`, "text-green-600"],
                  ["Net Cashflow", `UGX ${((economic?.cashflowSummary?.netCashflow || 0) / 1_000_000).toFixed(1)}M`, "text-blue-600"],
                  ["Inventory Value", `UGX ${((economic?.totalInventoryValue || 0) / 1_000_000).toFixed(1)}M`, "text-yellow-600"],
                ].map(([label, value, color]) => (
                  <div key={label as string} className="flex justify-between items-center py-1">
                    <span className="text-sm text-gray-500">{label}</span>
                    <span className={`font-bold ${color}`}>{value}</span>
                  </div>
                ))}
              </div>
              {sectorData.length > 0 && (
                <BarChart data={sectorData} bars={[{ key: "revenue", color: "#22c55e", name: "Avg Revenue (UGX M)" }]} height={180} />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-yellow-500" />
                <h3 className="font-semibold text-gray-900">Capital Markets</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  ["T-Bills", capital?.tbillCount || 0, capital?.tbillTotal ? `UGX ${(capital.tbillTotal / 1_000_000).toFixed(1)}M` : "0" ],
                  ["T-Bonds", capital?.tbondCount || 0, capital?.tbondTotal ? `UGX ${(capital.tbondTotal / 1_000_000).toFixed(1)}M` : "0" ],
                  ["Total Invested", "", capital?.totalInvested ? `UGX ${(capital.totalInvested / 1_000_000).toFixed(1)}M` : "0" ],
                  ["Avg Rate", `${capital?.avgRate || 0}%`, "" ],
                ].map(([label, count, val]) => (
                  <div key={label as string} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="font-bold text-gray-900">{count || val}</p>
                  </div>
                ))}
              </div>
              {capitalDistricts.length > 0 && (
                <BarChart data={capitalDistricts} bars={[{ key: "value", color: "#eab308", name: "UGX (M)" }]} height={180} />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-bou-500" />
                <h3 className="font-semibold text-gray-900">Savings & Investment Growth</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {[
                  ["Total Savings Value", `UGX ${((overview?.totalSavingsValue || 0) / 1_000_000).toFixed(1)}M`, "text-bou-500"],
                  ["Total Investment Value", `UGX ${((overview?.totalInvestmentValue || 0) / 1_000_000).toFixed(1)}M`, "text-yellow-600"],
                  ["Avg Credit Score", overview?.avgCreditScore || 0, "text-blue-600"],
                  ["Active Savers", economic?.savingsGrowth || 0, "text-green-600"],
                ].map(([label, value, color]) => (
                  <div key={label as string} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className={`font-bold text-lg ${color}`}>{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-blue-500" />
                <h3 className="font-semibold text-gray-900">Forex Rates</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {fxRates.slice(0, 6).map((rate) => (
                  <div key={rate.pair} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">{rate.pair}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">Buy: {rate.buy.toLocaleString()}</span>
                      <span className="text-sm text-gray-500">Sell: {rate.sell.toLocaleString()}</span>
                      <span className={`text-xs font-medium ${rate.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {rate.change >= 0 ? "+" : ""}{rate.change}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-red-500" />
                <h3 className="font-semibold text-gray-900">Fraud Monitoring</h3>
              </div>
            </CardHeader>
            <CardContent className="max-h-[400px] overflow-y-auto">
              <FraudFeed />
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Map className="w-4 h-4 text-bou-500" />
                <h3 className="font-semibold text-gray-900">Financial Inclusion Map</h3>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <InclusionMap height={400} />
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-500" />
                <h3 className="font-semibold text-gray-900">Recent Activity Timeline</h3>
              </div>
            </CardHeader>
            <CardContent className="max-h-[400px] overflow-y-auto">
              <ActivityTimeline activities={[]} />
              <p className="text-center text-gray-400 text-sm py-4">
                Activity tracking appears when users interact with the platform
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TreePine className="w-4 h-4 text-green-500" />
                <h3 className="font-semibold text-gray-900">Agricultural & SME Trends</h3>
              </div>
            </CardHeader>
            <CardContent>
              {sectorData.length > 0 ? (
                <BarChart data={sectorData.slice(0, 6)} bars={[{ key: "revenue", color: "#22c55e", name: "Avg Revenue (UGX M)" }]} height={300} />
              ) : (
                <p className="text-center text-gray-400 py-8">Loading sector data...</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
