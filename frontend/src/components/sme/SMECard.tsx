"use client";

import { Briefcase, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import Card, { CardContent } from "../ui/Card";
import Badge from "../ui/Badge";

interface SME {
  id: string; businessName: string; ownerName: string;
  district: string; sector: string; monthlyRevenue: number;
  healthScore: number; registeredAt: string;
}

function HealthBadge({ score }: { score: number }) {
  if (score >= 70) return <Badge variant="success">Healthy</Badge>;
  if (score >= 40) return <Badge variant="warning">Stable</Badge>;
  return <Badge variant="danger">At Risk</Badge>;
}

export default function SMECard({ sme }: { sme: SME }) {
  return (
    <Card hover>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-bou-50 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-bou-500" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{sme.businessName}</h4>
              <p className="text-xs text-gray-500">{sme.sector} &middot; {sme.district}</p>
            </div>
          </div>
          <HealthBadge score={sme.healthScore} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-2.5">
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
              <DollarSign className="w-3 h-3" />
              <span>Monthly Revenue</span>
            </div>
            <p className="font-semibold text-sm text-gray-900">UGX {sme.monthlyRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2.5">
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
              <TrendingUp className="w-3 h-3" />
              <span>Health Score</span>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm text-gray-900">{sme.healthScore}/100</p>
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    sme.healthScore >= 70 ? "bg-green-500" : sme.healthScore >= 40 ? "bg-yellow-500" : "bg-red-500"
                  }`}
                  style={{ width: `${sme.healthScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
