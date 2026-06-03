"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Landmark, Phone, Lock, Eye, EyeOff } from "lucide-react";
import Button from "../ui/Button";
import Card, { CardContent } from "../ui/Card";
import { api } from "@/lib/api";

export default function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const [phone, setPhone] = useState("+256700000001");
  const [pin, setPin] = useState("1234");
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.login(phone, pin);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      onSuccess?.();
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const demoAccounts = [
    { phone: "+256700000001", label: "Bank of Uganda Admin", role: "admin" },
    { phone: "+256700000002", label: "Citizen Demo", role: "citizen" },
  ];

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-xl bg-bou-500 flex items-center justify-center mx-auto mb-4">
            <Landmark className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Welcome to BoU Nexus</h2>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bou-500 focus:border-bou-500"
                required
                placeholder="+2567XX XXXXXX"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">PIN</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPin ? "text" : "password"}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bou-500 focus:border-bou-500"
                required
                maxLength={4}
                placeholder="Enter 4-digit PIN"
              />
              <button type="button" onClick={() => setShowPin(!showPin)} className="absolute right-3 top-1/2 -translate-y-1/2">
                {showPin ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            Sign In
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-500 mb-2 text-center">Demo Accounts (PIN: 1234)</p>
          <div className="space-y-1.5">
            {demoAccounts.map((acct) => (
              <button
                key={acct.phone}
                onClick={() => { setPhone(acct.phone); setPin("1234"); }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs text-gray-600 hover:bg-gray-50 border border-gray-200 transition-colors"
              >
                <span className="font-medium">{acct.label}</span>
                <span className="text-gray-400 ml-2">({acct.phone})</span>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
