"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Globe, ArrowRightLeft, QrCode, Send, Banknote } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Card, { CardContent, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import KPI, { KPIGrid } from "@/components/ui/KPI";
import { api } from "@/lib/api";

const countries = [
  { code: "UG", name: "Uganda", flag: "🇺🇬", currency: "UGX", rate: 1 },
  { code: "KE", name: "Kenya", flag: "🇰🇪", currency: "KES", rate: 0.028 },
  { code: "RZ", name: "Rwanda", flag: "🇷🇼", currency: "RWF", rate: 0.0038 },
  { code: "TZ", name: "Tanzania", flag: "🇹🇿", currency: "TZS", rate: 0.0016 },
  { code: "SS", name: "South Sudan", flag: "🇸🇸", currency: "SSP", rate: 0.005 },
];

const psps = [
  { name: "MTN MoMo", fee: 0.5, speed: "Instant", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { name: "Airtel Money", fee: 0.6, speed: "Instant", color: "bg-red-100 text-red-700 border-red-200" },
  { name: "Bank Wire", fee: 1.5, speed: "1-3 Days", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { name: "SACCO Net", fee: 0.3, speed: "Same Day", color: "bg-green-100 text-green-700 border-green-200" },
];

export default function RegionalPaymentsPage() {
  const router = useRouter();
  const [fxRates, setFXRates] = useState<any[]>([]);
  const [fromCountry, setFromCountry] = useState("UG");
  const [toCountry, setToCountry] = useState("KE");
  const [amount, setAmount] = useState("100000");
  const [convertedAmount, setConvertedAmount] = useState<number>(0);

  useEffect(() => {
    api.getFXRates().then((r) => setFXRates(r.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    const fromRate = countries.find((c) => c.code === fromCountry)?.rate || 1;
    const toRate = countries.find((c) => c.code === toCountry)?.rate || 1;
    setConvertedAmount(Number(amount) * (toRate / fromRate));
  }, [fromCountry, toCountry, amount]);

  const swapCountries = () => {
    setFromCountry(toCountry);
    setToCountry(fromCountry);
  };

  const getPairRate = (pair: string) => fxRates.find((r) => r.pair === pair);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => router.push("/")} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Remittance & Regional Payments</h1>
              <p className="text-gray-500 mt-1">Send money across East Africa — Uganda, Kenya, Rwanda, Tanzania, South Sudan</p>
            </div>
          </div>
        </div>

        <KPIGrid>
          <KPI label="EAC Countries" value="5" icon={<Globe className="w-5 h-5" />} />
          <KPI label="Payment Channels" value="4" icon={<Send className="w-5 h-5" />} />
          <KPI label="Min Transfer Fee" value="0.3%" icon={<Banknote className="w-5 h-5" />} />
          <KPI label="QR Payments" value="Active" icon={<QrCode className="w-5 h-5" />} />
        </KPIGrid>

        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-900">Currency Converter</h3>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-5 gap-3 items-end mb-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                    <select
                      value={fromCountry}
                      onChange={(e) => setFromCountry(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                    >
                      {countries.map((c) => (
                        <option key={c.code} value={c.code}>{c.flag} {c.name} ({c.currency})</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-center pt-5">
                    <button
                      onClick={swapCountries}
                      className="w-10 h-10 rounded-full bg-bou-50 flex items-center justify-center hover:bg-bou-100 transition-colors"
                    >
                      <ArrowRightLeft className="w-5 h-5 text-bou-500" />
                    </button>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                    <select
                      value={toCountry}
                      onChange={(e) => setToCountry(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                    >
                      {countries.map((c) => (
                        <option key={c.code} value={c.code}>{c.flag} {c.name} ({c.currency})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Input
                    label={`Amount (${countries.find(c => c.code === fromCountry)?.currency})`}
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Converted ({countries.find(c => c.code === toCountry)?.currency})
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 font-bold text-bou-500">
                      {convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Exchange Rate: 1 {countries.find(c => c.code === fromCountry)?.currency} =&nbsp;
                    {((countries.find(c => c.code === toCountry)?.rate || 1) / (countries.find(c => c.code === fromCountry)?.rate || 1)).toFixed(6)}
                    &nbsp;{countries.find(c => c.code === toCountry)?.currency}
                  </span>
                  <Button size="sm">Convert</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-900">Transfer Cost Comparison</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {psps.map((psp) => {
                    const fee = (Number(amount) * psp.fee) / 100;
                    return (
                      <div key={psp.name} className={`flex items-center justify-between p-4 rounded-lg border ${psp.color}`}>
                        <div>
                          <p className="font-semibold text-sm">{psp.name}</p>
                          <p className="text-xs opacity-75">{psp.speed}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm">Fee: {psp.fee}%</p>
                          <p className="text-xs opacity-75">UGX {fee.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 bg-bou-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-bou-700 font-medium">
                    Cheapest Route: <strong>SACCO Net</strong> (0.3% fee — UGX {((Number(amount) * 0.3) / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })})
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-900">Live FX Rates</h3>
              </CardHeader>
              <CardContent className="space-y-2">
                {fxRates.slice(0, 5).map((rate) => (
                  <div key={rate.pair} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm font-medium text-gray-700">{rate.pair}</span>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">{rate.buy.toLocaleString()}</span>
                      <span className={`text-xs ml-2 ${rate.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {rate.change >= 0 ? "+" : ""}{rate.change}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-900">Regional Flow</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[["Uganda → Kenya", "UGX 1.2B", "text-green-600"], ["Kenya → Uganda", "UGX 850M", "text-blue-600"], ["Uganda → Rwanda", "UGX 420M", "text-yellow-600"], ["Uganda → Tanzania", "UGX 310M", "text-purple-600"]].map(([route, vol, color]) => (
                    <div key={route as string} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2">
                        <Send className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600">{route}</span>
                      </div>
                      <span className={`text-sm font-bold ${color}`}>{vol}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-900">QR Payment</h3>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-40 h-40 bg-gray-100 rounded-xl mx-auto mb-3 flex items-center justify-center border-2 border-dashed border-gray-300">
                  <QrCode className="w-16 h-16 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">Scan to pay across East Africa</p>
                <Button size="sm" className="mt-2">Generate QR Code</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
