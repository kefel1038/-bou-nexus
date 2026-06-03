"use client";

import { useState } from "react";
import { TrendingUp, Lock, Calendar } from "lucide-react";
import Card, { CardContent } from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";

interface InvestmentOption {
  type: "savings" | "tbill" | "tbond";
  label: string;
  rate: string;
  minAmount: number;
  duration: string;
  color: string;
}

const options: InvestmentOption[] = [
  { type: "savings", label: "Savings Account", rate: "4%", minAmount: 5000, duration: "Flexible", color: "from-green-500 to-emerald-600" },
  { type: "tbill", label: "Treasury Bill", rate: "12%", minAmount: 5000, duration: "91 Days", color: "from-bou-gold to-yellow-500" },
  { type: "tbond", label: "Treasury Bond", rate: "14%", minAmount: 5000, duration: "1 Year", color: "from-blue-500 to-blue-600" },
];

interface InvestmentCardProps {
  onInvest: (data: { name: string; district: string; phone: string; amount: number; type: string }) => void;
}

export default function InvestmentCard({ onInvest }: InvestmentCardProps) {
  const [selectedType, setSelectedType] = useState<string>("tbill");
  const [name, setName] = useState("");
  const [district, setDistrict] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const selected = options.find((o) => o.type === selectedType) || options[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onInvest({ name, district, phone, amount: Number(amount), type: selectedType });
    setLoading(false);
    setName(""); setDistrict(""); setPhone(""); setAmount("");
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid gap-4 mb-6">
          {options.map((opt) => (
            <button
              key={opt.type}
              onClick={() => setSelectedType(opt.type)}
              className={`relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all ${
                selectedType === opt.type
                  ? "border-bou-500 bg-bou-50 shadow-sm"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{opt.label}</p>
                  <p className="text-sm text-gray-500 mt-0.5">Min UGX {opt.minAmount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-bou-500">{opt.rate}</p>
                  <p className="text-xs text-gray-500">{opt.duration}</p>
                </div>
              </div>
              {selectedType === opt.type && (
                <div className="absolute top-0 right-0 w-16 h-16">
                  <div className="absolute -top-8 -right-8 w-16 h-16 bg-bou-500 rotate-45" />
                </div>
              )}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Moses Okello" />
          <Input label="District" value={district} onChange={(e) => setDistrict(e.target.value)} required placeholder="e.g. Kampala" />
          <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+2567XX XXXXXX" />
          <Input
            label={`Amount (Min UGX ${selected.minAmount.toLocaleString()})`}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min={selected.minAmount}
            placeholder="5000"
          />

          {amount && Number(amount) >= selected.minAmount && (
            <div className="bg-gradient-to-r from-bou-50 to-green-50 rounded-lg p-3 border border-bou-100">
              <div className="flex items-center gap-2 text-sm text-bou-700">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">Expected Return:</span>
                <span className="font-bold">
                  {selectedType === "savings"
                    ? "N/A (Flexible Savings)"
                    : `UGX ${((Number(amount) * (selectedType === "tbill" ? 0.12 : 0.14)) / 4).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <Calendar className="w-3 h-3" />
                <span>Duration: {selected.duration}</span>
                <Lock className="w-3 h-3 ml-2" />
                <span>Government Backed</span>
              </div>
            </div>
          )}

          <Button type="submit" size="lg" className="w-full" loading={loading}>
            {selectedType === "savings" ? "Start Saving" : `Invest in ${selected.label}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
