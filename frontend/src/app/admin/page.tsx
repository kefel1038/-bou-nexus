"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { api, loginAs } from "@/lib/api";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
  }, []);

  const handleLogin = async (phone: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.login(phone, "1234");
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      setUser(res.user);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const demoAccounts = [
    { phone: "+256700000001", label: "Bank of Uganda Admin", role: "BOU Analyst", color: "bg-bou-500" },
    { phone: "+256700000002", label: "Citizen Demo", role: "Citizen", color: "bg-blue-500" },
    { phone: "+256700000003", label: "Farmer Demo", role: "Farmer", color: "bg-green-500" },
    { phone: "+256700000004", label: "SME Owner Demo", role: "SME Owner", color: "bg-yellow-500" },
  ];

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-xl bg-bou-500 flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Welcome, {user.name}</h2>
            <p className="text-gray-500 mt-1 capitalize">{user.role} &middot; {user.district}</p>
            <div className="flex flex-col gap-3 mt-6">
              <Button onClick={() => router.push("/bou-command-center")} className="w-full">
                BOU Command Center
              </Button>
              <Button variant="outline" onClick={() => router.push("/treasury")} className="w-full">
                Treasury Portal
              </Button>
              <Button variant="ghost" onClick={handleLogout} className="w-full">
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-xl bg-white border border-gray-100 shadow-md flex items-center justify-center mx-auto mb-4 p-2">
              <img src="/logo.jpg" alt="Bank of Uganda Logo" className="h-full w-full object-contain" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">BoU Nexus Sign In</h2>
            <p className="text-sm text-gray-500 mt-1">Select a demo account to continue</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            {demoAccounts.map((acct) => (
              <button
                key={acct.phone}
                onClick={() => handleLogin(acct.phone)}
                disabled={loading}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-bou-200 hover:bg-bou-50 transition-all text-left disabled:opacity-50"
              >
                <div className={`w-10 h-10 rounded-lg ${acct.color} flex items-center justify-center text-white font-bold text-sm`}>
                  {acct.label.split(" ").map(w => w[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900">{acct.label}</p>
                  <p className="text-xs text-gray-500">{acct.role} &middot; PIN: 1234</p>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
