"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Shield, Search } from "lucide-react";
import Card, { CardContent } from "../ui/Card";
import Badge from "../ui/Badge";
import { api } from "@/lib/api";

interface FraudAlert {
  id: string; accountName: string; district: string;
  riskScore: number; reason: string; status: string;
  transactionCount: number; linkedAccounts: number; timestamp: string;
}

const statusColors: Record<string, "danger" | "warning" | "success"> = {
  flagged: "danger",
  investigating: "warning",
  resolved: "success",
};

function RiskBadge({ score }: { score: number }) {
  const color = score >= 85 ? "danger" : score >= 70 ? "warning" : "default";
  return <Badge variant={color}>{score}%</Badge>;
}

export default function FraudFeed() {
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getFraudAlerts().then((res) => {
      setAlerts(res.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-16" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-red-500" />
          <span className="text-sm font-medium text-gray-700">Live Fraud Feed</span>
        </div>
        <span className="text-xs text-gray-500">{alerts.length} alerts</span>
      </div>
      {alerts.slice().reverse().map((alert) => (
        <Card key={alert.id}>
          <CardContent className="p-3">
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                alert.riskScore >= 85 ? "bg-red-100" : "bg-yellow-100"
              }`}>
                <AlertTriangle className={`w-4 h-4 ${alert.riskScore >= 85 ? "text-red-600" : "text-yellow-600"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-gray-900">{alert.accountName}</span>
                  <RiskBadge score={alert.riskScore} />
                  <Badge variant={statusColors[alert.status] || "default"}>{alert.status}</Badge>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{alert.reason}</p>
                <div className="flex gap-3 mt-1 text-xs text-gray-400">
                  <span>{alert.district}</span>
                  <span>{alert.transactionCount} txns</span>
                  <span>{alert.linkedAccounts} linked</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {alerts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No fraud alerts detected</p>
        </div>
      )}
    </div>
  );
}
