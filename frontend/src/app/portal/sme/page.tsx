"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Briefcase, TrendingUp, DollarSign, Package,
  BarChart3, Plus, Building2, ClipboardList, Receipt,
  Calculator, CheckCircle,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Card, { CardContent, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import KPI, { KPIGrid } from "@/components/ui/KPI";
import SMECard from "@/components/sme/SMECard";
import BarChart from "@/components/charts/BarChart";
import { api } from "@/lib/api";

export default function SMEPortal() {
  const router = useRouter();
  const [smes, setSmes] = useState<any[]>([]);
  const [overview, setOverview] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "inventory" | "cashflow" | "tax">("overview");

  const [invForm, setInvForm] = useState({ smeId: "", name: "", quantity: "", unitPrice: "", category: "" });
  const [cfForm, setCfForm] = useState({ smeId: "", type: "income", amount: "", category: "", description: "" });
  const [smeForm, setSmeForm] = useState({ businessName: "", ownerName: "", district: "", sector: "", monthlyRevenue: "" });
  const [registering, setRegistering] = useState(false);

  const fetchData = () => {
    api.getSMEs().then((r) => setSmes(r.data || [])).catch(() => {});
    api.getEconomicStats().then(setOverview).catch(() => {});
  };

  useEffect(() => { fetchData(); }, []);

  const sectorData = overview?.sectorBreakdown
    ? Object.entries(overview.sectorBreakdown)
        .map(([name, val]: any) => ({ name, count: val.count }))
        .sort((a, b) => b.count - a.count)
    : [];

  const cashflowSummary = overview?.cashflowSummary;

  const handleRegisterSME = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistering(true);
    try {
      await api.createSME({ ...smeForm, monthlyRevenue: Number(smeForm.monthlyRevenue) });
      setSmeForm({ businessName: "", ownerName: "", district: "", sector: "", monthlyRevenue: "" });
      fetchData();
    } catch {}
    setRegistering(false);
  };

  const handleAddInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createSME(invForm.smeId);
      // For MVP use the inventory endpoint
      setInvForm({ smeId: "", name: "", quantity: "", unitPrice: "", category: "" });
    } catch {}
  };

  const handleAddCashflow = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createSME(cfForm.smeId);
      // For MVP use the cashflow endpoint
      setCfForm({ smeId: "", type: "income", amount: "", category: "", description: "" });
    } catch {}
  };

  const tabs = [
    { key: "overview" as const, label: "Overview", icon: <Building2 className="w-4 h-4" /> },
    { key: "inventory" as const, label: "Inventory", icon: <Package className="w-4 h-4" /> },
    { key: "cashflow" as const, label: "Cashflow", icon: <Receipt className="w-4 h-4" /> },
    { key: "tax" as const, label: "Tax Estimate", icon: <Calculator className="w-4 h-4" /> },
  ];

  const estimatedTax = smes.reduce((s, e) => s + e.monthlyRevenue, 0) * 0.18;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => router.push("/")} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-xl bg-yellow-50 flex items-center justify-center">
            <Briefcase className="w-7 h-7 text-yellow-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SME Digitalization Portal</h1>
            <p className="text-gray-500">Inventory, cashflow, bookkeeping & tax estimation</p>
          </div>
        </div>

        <KPIGrid>
          <KPI label="Total SMEs" value={smes.length} icon={<Building2 className="w-5 h-5" />} />
          <KPI label="Avg Health Score" value={smes.length > 0 ? `${Math.round(smes.reduce((s, e) => s + e.healthScore, 0) / smes.length)}%` : "0%"} icon={<TrendingUp className="w-5 h-5" />} />
          <KPI label="Net Cashflow" value={cashflowSummary ? `UGX ${(cashflowSummary.netCashflow / 1_000_000).toFixed(1)}M` : "--"} icon={<DollarSign className="w-5 h-5" />} />
          <KPI label="Est. Tax Liability" value={`UGX ${(estimatedTax / 1_000_000).toFixed(1)}M`} icon={<Calculator className="w-5 h-5" />} />
        </KPIGrid>

        <div className="flex gap-2 mb-6 mt-6 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-bou-500 text-bou-500"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Registered SMEs</h3>
                    <Button size="sm" onClick={() => document.getElementById("register-sme")?.scrollIntoView({ behavior: "smooth" })}>
                      <Plus className="w-4 h-4 mr-1" /> Register
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
                  {smes.length === 0 && <p className="text-center text-gray-400 py-8">No SMEs registered yet</p>}
                  {smes.map((sme) => (<SMECard key={sme.id} sme={sme} />))}
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader><h3 className="font-semibold text-gray-900">Sector Distribution</h3></CardHeader>
                <CardContent>
                  {sectorData.length > 0 ? <BarChart data={sectorData} bars={[{ key: "count", color: "#eab308", name: "SMEs" }]} height={250} /> : <p className="text-center text-gray-400 py-8">No data</p>}
                </CardContent>
              </Card>
              <Card id="register-sme">
                <CardHeader><h3 className="font-semibold text-gray-900">Register New SME</h3></CardHeader>
                <CardContent>
                  <form onSubmit={handleRegisterSME} className="space-y-2">
                    <Input label="Business Name" value={smeForm.businessName} onChange={(e) => setSmeForm({ ...smeForm, businessName: e.target.value })} required />
                    <Input label="Owner Name" value={smeForm.ownerName} onChange={(e) => setSmeForm({ ...smeForm, ownerName: e.target.value })} required />
                    <div className="grid grid-cols-2 gap-2">
                      <Input label="District" value={smeForm.district} onChange={(e) => setSmeForm({ ...smeForm, district: e.target.value })} required />
                      <Select label="Sector" options={["Agriculture", "Retail", "Transport", "Manufacturing", "Technology", "Hospitality", "Construction", "Healthcare", "Education", "Financial Services"].map(s => ({ value: s, label: s }))} value={smeForm.sector} onChange={(e) => setSmeForm({ ...smeForm, sector: e.target.value })} required />
                    </div>
                    <Input label="Monthly Revenue (UGX)" type="number" value={smeForm.monthlyRevenue} onChange={(e) => setSmeForm({ ...smeForm, monthlyRevenue: e.target.value })} required />
                    <Button type="submit" className="w-full" loading={registering}>Register SME</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "inventory" && (
          <Card>
            <CardHeader><h3 className="font-semibold text-gray-900">Inventory Management</h3></CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <form className="space-y-3">
                    <Select label="Select SME" options={smes.map(s => ({ value: s.id, label: s.businessName }))} value={invForm.smeId} onChange={(e) => setInvForm({ ...invForm, smeId: e.target.value })} required />
                    <Input label="Item Name" value={invForm.name} onChange={(e) => setInvForm({ ...invForm, name: e.target.value })} required placeholder="e.g. Maize Flour" />
                    <div className="grid grid-cols-2 gap-2">
                      <Input label="Quantity" type="number" value={invForm.quantity} onChange={(e) => setInvForm({ ...invForm, quantity: e.target.value })} required />
                      <Input label="Unit Price (UGX)" type="number" value={invForm.unitPrice} onChange={(e) => setInvForm({ ...invForm, unitPrice: e.target.value })} required />
                    </div>
                    <Select label="Category" options={["Raw Materials", "Finished Goods", "Equipment", "Supplies", "Merchandise"].map(s => ({ value: s, label: s }))} value={invForm.category} onChange={(e) => setInvForm({ ...invForm, category: e.target.value })} required />
                    <Button type="submit" className="w-full">Add Inventory Item</Button>
                  </form>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-sm text-gray-700 mb-3">Quick Inventory Stats</h4>
                  <div className="space-y-3">
                    {["Raw Materials", "Finished Goods", "Equipment", "Supplies", "Merchandise"].map((cat) => (
                      <div key={cat} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{cat}</span>
                        <span className="font-medium text-gray-900">-- items</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-500">Total Inventory Value: <strong className="text-gray-900">--</strong></p>
                    <p className="text-xs text-gray-400 mt-1">Select an SME and add items to see stats</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "cashflow" && (
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><h3 className="font-semibold text-gray-900">Record Cashflow</h3></CardHeader>
              <CardContent>
                <form className="space-y-3">
                  <Select label="Select SME" options={smes.map(s => ({ value: s.id, label: s.businessName }))} value={cfForm.smeId} onChange={(e) => setCfForm({ ...cfForm, smeId: e.target.value })} required />
                  <div className="grid grid-cols-2 gap-2">
                    <Select label="Type" options={[{ value: "income", label: "Income" }, { value: "expense", label: "Expense" }]} value={cfForm.type} onChange={(e) => setCfForm({ ...cfForm, type: e.target.value })} required />
                    <Input label="Amount (UGX)" type="number" value={cfForm.amount} onChange={(e) => setCfForm({ ...cfForm, amount: e.target.value })} required />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Select label="Category" options={["Sales", "Services", "Investment", "Grants", "Rent", "Utilities", "Salaries", "Supplies", "Transport", "Taxes", "Marketing"].map(s => ({ value: s, label: s }))} value={cfForm.category} onChange={(e) => setCfForm({ ...cfForm, category: e.target.value })} required />
                    <Input label="Description" value={cfForm.description} onChange={(e) => setCfForm({ ...cfForm, description: e.target.value })} required />
                  </div>
                  <Button type="submit" className="w-full">Record Transaction</Button>
                </form>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><h3 className="font-semibold text-gray-900">Cashflow Summary</h3></CardHeader>
              <CardContent>
                {cashflowSummary ? (
                  <div className="space-y-4">
                    {[
                      ["Total Income", cashflowSummary.totalIncome, "text-green-600"],
                      ["Total Expenses", cashflowSummary.totalExpense, "text-red-600"],
                      ["Net Cashflow", cashflowSummary.netCashflow, cashflowSummary.netCashflow >= 0 ? "text-bou-500" : "text-red-600"],
                    ].map(([label, amount, color]) => (
                      <div key={label as string} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                        <span className="text-sm text-gray-600">{label}</span>
                        <span className={`font-bold ${color}`}>UGX {(amount as number).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="bg-green-50 rounded-lg p-3 mt-2">
                      <div className="flex items-center gap-2 text-sm text-green-700">
                        <CheckCircle className="w-4 h-4" />
                        <span>Healthy cashflow position</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-400 py-8">No cashflow data yet. Record transactions to see summary.</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "tax" && (
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><h3 className="font-semibold text-gray-900">Tax Estimation</h3></CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-br from-bou-50 to-green-50 rounded-xl p-6 border border-bou-100">
                  <p className="text-sm text-gray-600 mb-1">Estimated Annual Tax Liability (18% Corporate Tax)</p>
                  <p className="text-3xl font-bold text-bou-500">UGX {estimatedTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  <p className="text-xs text-gray-400 mt-2">Based on aggregate monthly revenue of all registered SMEs</p>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Corporate Income Tax", rate: "18%", desc: "On net profits" },
                    { label: "Withholding Tax", rate: "6%", desc: "On professional fees" },
                    { label: "VAT", rate: "18%", desc: "On taxable supplies > UGX 150M/year" },
                    { label: "PAYE", rate: "Up to 40%", desc: "On employee salaries" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-700">{item.label}</p>
                        <p className="text-xs text-gray-400">{item.desc}</p>
                      </div>
                      <span className="text-sm font-bold text-bou-500">{item.rate}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><h3 className="font-semibold text-gray-900">Tax Planning Tips</h3></CardHeader>
              <CardContent className="space-y-3">
                {[
                  { title: "Keep Digital Records", desc: "Use the inventory and cashflow tools to maintain accurate digital records for tax filing." },
                  { title: "Track All Expenses", desc: "Every business expense reduces your taxable income. Log everything in Cashflow." },
                  { title: "File Quarterly", desc: "URA requires quarterly provisional tax filings for businesses." },
                  { title: "Claim VAT Refunds", desc: "If registered for VAT, you can claim refunds on eligible business inputs." },
                  { title: "Separate Business & Personal", desc: "Maintain separate bank accounts for business transactions." },
                ].map((tip, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-bou-50 flex items-center justify-center flex-shrink-0 text-xs font-bold text-bou-500">{i + 1}</div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{tip.title}</p>
                      <p className="text-xs text-gray-500">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
