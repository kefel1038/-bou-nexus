import { Lightbulb } from "lucide-react";
import Card, { CardContent, CardHeader } from "@/components/ui/Card";

const recommendations = [
  { district: "Karamoja", action: "Deploy 20 New Banking Agents", priority: "high" },
  { district: "Lira", action: "Increase SACCO Lending Capacity", priority: "high" },
  { district: "Arua", action: "Launch Treasury Awareness Campaign", priority: "medium" },
  { district: "Soroti", action: "Digital Payments Training Program", priority: "medium" },
  { district: "Moroto", action: "Micro-credit Facility for Women", priority: "high" },
];

const priorityColors: Record<string, string> = {
  high: "text-red-600 bg-red-50 border-red-200",
  medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
  low: "text-green-600 bg-green-50 border-green-200",
};

export default function PolicyRecommendations() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-yellow-500" />
          <h3 className="font-semibold text-gray-900">Policy Recommendations</h3>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendations.map((rec) => (
            <div key={rec.district} className={`p-3 rounded-lg border text-sm ${priorityColors[rec.priority]}`}>
              <p className="font-semibold">{rec.district}</p>
              <p className="text-xs mt-0.5 opacity-80">{rec.action}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
