"use client";

import { TrendingUp } from "lucide-react";
import Card, { CardContent, CardHeader } from "@/components/ui/Card";

const metrics = [
  { label: "Savings Access", score: 72, color: "bg-green-500" },
  { label: "Credit Access", score: 58, color: "bg-yellow-500" },
  { label: "Investment Access", score: 45, color: "bg-orange-500" },
  { label: "Digital Payments", score: 81, color: "bg-green-500" },
  { label: "Consumer Protection", score: 63, color: "bg-yellow-500" },
];

export default function InclusionScore() {
  const overall = Math.round(metrics.reduce((a, m) => a + m.score, 0) / metrics.length);

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold text-gray-900">National Financial Inclusion Score</h3>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6 mb-6">
          <div className="relative w-28 h-28">
            <svg className="w-full h-full" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="54" fill="none" stroke="#006B3F" strokeWidth="8"
                strokeDasharray={`${(overall / 100) * 339.292} 339.292`}
                strokeLinecap="round" transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-bold text-bou-500">{overall}</p>
                <p className="text-xs text-gray-400">/100</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-bou-500">{overall}/100</p>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" /> +5 this quarter
            </div>
            <p className="text-xs text-gray-400 mt-1">Projected: 74/100 by 2027</p>
          </div>
        </div>
        <div className="space-y-3">
          {metrics.map((m) => (
            <div key={m.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{m.label}</span>
                <span className="font-medium text-gray-900">{m.score}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-1000 ${m.color}`} style={{ width: `${m.score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
