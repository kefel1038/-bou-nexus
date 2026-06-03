"use client";

import { useState } from "react";
import Card, { CardContent } from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { api } from "@/lib/api";

interface CreditScoreResult {
  score: number; risk: string; eligibleLoan: number;
  factors: { name: string; score: number; weight: number }[];
  recommendation: string;
}

export default function CreditScoreForm() {
  const [formData, setFormData] = useState({
    phone: "", name: "", district: "",
    mobileMoneyScore: "65", cropYieldScore: "50",
    salesScore: "50", utilityScore: "50",
    saccoMember: false,
  });
  const [result, setResult] = useState<CreditScoreResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.createCreditScore({
        ...formData,
        mobileMoneyScore: Number(formData.mobileMoneyScore),
        cropYieldScore: Number(formData.cropYieldScore),
        salesScore: Number(formData.salesScore),
        utilityScore: Number(formData.utilityScore),
      });
      setResult(res);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const updateField = (key: string, value: any) => setFormData((prev) => ({ ...prev, [key]: value }));

  const riskColors: Record<string, string> = {
    Low: "text-green-600 bg-green-50 border-green-200",
    Medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
    High: "text-red-600 bg-red-50 border-red-200",
  };

  const sliderFields = [
    { key: "mobileMoneyScore", label: "Mobile Money History", desc: "Transaction volume & consistency" },
    { key: "cropYieldScore", label: "Crop Yield Data", desc: "Historical agricultural output" },
    { key: "salesScore", label: "Monthly Sales", desc: "Business revenue performance" },
    { key: "utilityScore", label: "Utility Payments", desc: "Bill payment reliability" },
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Credit Score</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Full Name" value={formData.name} onChange={(e) => updateField("name", e.target.value)} required />
              <Input label="Phone Number" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} required />
            </div>
            <Input label="District" value={formData.district} onChange={(e) => updateField("district", e.target.value)} required />

            {sliderFields.map((field) => (
              <div key={field.key}>
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">{field.label}</label>
                  <span className="text-sm font-bold text-bou-500">{formData[field.key as keyof typeof formData]}</span>
                </div>
                <p className="text-xs text-gray-400 mb-1">{field.desc}</p>
                <input
                  type="range"
                  min="0" max="100"
                  value={String(formData[field.key as keyof typeof formData])}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-bou-500"
                />
              </div>
            ))}

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.saccoMember}
                onChange={(e) => updateField("saccoMember", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-bou-500 focus:ring-bou-500"
              />
              <span className="text-sm text-gray-700">I am a SACCO member (+50 points)</span>
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" loading={loading}>Generate Credit Score</Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Credit Score</h3>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-bou-500 mb-3">
                <span className="text-4xl font-bold text-bou-500">{result.score}</span>
              </div>
              <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${riskColors[result.risk] || ""}`}>
                {result.risk} Risk
              </div>
              <p className="text-xl font-bold text-gray-900 mt-3">
                Eligible Loan: UGX {result.eligibleLoan.toLocaleString()}
              </p>
            </div>

            <h4 className="font-semibold text-sm text-gray-700 mb-2">Score Factors</h4>
            <div className="space-y-2 mb-4">
              {result.factors.map((f) => (
                <div key={f.name} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{f.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-bou-500 rounded-full"
                        style={{ width: `${f.score}%` }}
                      />
                    </div>
                    <span className="font-medium text-gray-700 w-8 text-right">{f.score}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                <strong>Recommendation:</strong> {result.recommendation}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
