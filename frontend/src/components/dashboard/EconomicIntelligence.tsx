import Card, { CardContent, CardHeader } from "@/components/ui/Card";
import { TrendingUp, TrendingDown, Globe } from "lucide-react";

const agriData = [
  { crop: "Coffee", change: 14, direction: "up" },
  { crop: "Maize", change: 8, direction: "up" },
  { crop: "Beans", change: 2, direction: "down" },
  { crop: "Tea", change: 5, direction: "up" },
  { crop: "Cotton", change: 3, direction: "down" },
];

const tradeData = [
  { from: "Kenya", to: "Uganda", amount: 240 },
  { from: "Rwanda", to: "Uganda", amount: 85 },
  { from: "Tanzania", to: "Uganda", amount: 170 },
  { from: "DRC", to: "Uganda", amount: 120 },
];

export default function EconomicIntelligence() {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900">Agricultural Activity</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {agriData.map((item) => (
              <div key={item.crop} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{item.crop}</span>
                <div className={`flex items-center gap-1 text-sm font-medium ${item.direction === "up" ? "text-green-600" : "text-red-600"}`}>
                  {item.direction === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {item.direction === "up" ? "+" : ""}{item.change}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900">Regional Trade</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tradeData.map((item) => (
              <div key={item.from} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-bou-500" />
                  <span className="text-sm text-gray-700">{item.from} → {item.to}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">UGX {item.amount}M</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
