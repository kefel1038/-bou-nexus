"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Card, { CardContent, CardHeader } from "../ui/Card";
import { api } from "@/lib/api";

const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const Circle = dynamic(() => import("react-leaflet").then((m) => m.Circle), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), { ssr: false });

const districtCoords: Record<string, [number, number]> = {
  Kampala: [0.3136, 32.5811], Wakiso: [0.4040, 32.4780], Mbarara: [-0.6072, 30.6545],
  Gulu: [2.7733, 32.2990], Arua: [3.0142, 30.9111], Mbale: [1.0807, 34.1750],
  Soroti: [1.7150, 33.6100], Lira: [2.2470, 32.9000], Karamoja: [2.7500, 34.0000],
  Jinja: [0.4390, 33.2032], Masaka: [-0.3390, 31.7340], Kasese: [0.1840, 30.0830],
  "Fort Portal": [0.6610, 30.2750], Kabale: [-1.2500, 29.9890], Busia: [0.4590, 34.0950],
  Tororo: [0.6910, 34.1810], Hoima: [1.4350, 31.3490], Masindi: [1.6740, 31.7150],
  Luwero: [0.8490, 32.4730], Mukono: [0.3530, 32.7550], Iganga: [0.6120, 33.4860],
  Pallisa: [1.1450, 33.7090], Kumi: [1.4610, 33.9360],
};

export default function InclusionMap({ height = 500 }: { height?: number }) {
  const [inclusionData, setInclusionData] = useState<any[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    api.getFinancialInclusion().then((res) => {
      setInclusionData(res.data || []);
    }).catch(() => {});
    import("leaflet").then((m) => setL(m.default || m));
  }, []);

  if (typeof window === "undefined" || !L) {
    return <div className="animate-pulse bg-gray-100 rounded-xl" style={{ height }} />;
  }

  const mapCenter: [number, number] = [1.3733, 32.2903];

  const getColor = (score: number) => {
    if (score >= 80) return "#4A2C1B";
    if (score >= 60) return "#C5A880";
    if (score >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const getRadius = (score: number) => Math.max(20000, score * 1000);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardContent className="p-0 overflow-hidden" style={{ height }}>
            <MapContainer center={mapCenter} zoom={7} scrollWheelZoom={false} className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {inclusionData.map((d) => {
                const coords = districtCoords[d.district];
                if (!coords) return null;
                return (
                  <Circle
                    key={d.district}
                    center={coords}
                    pathOptions={{ color: getColor(d.accessScore), fillColor: getColor(d.accessScore), fillOpacity: 0.3, weight: 2 }}
                    radius={getRadius(d.accessScore)}
                    eventHandlers={{ click: () => setSelectedDistrict(d) }}
                  >
                    <Popup>
                      <div className="text-sm space-y-1 min-w-[180px]">
                        <p className="font-bold text-base">{d.district}</p>
                        <p>Access Score: <strong>{d.accessScore}%</strong></p>
                        <p>Banks: {d.bankBranches} | SACCOs: {d.saccos}</p>
                        <p>Agents: {d.agents} | ATMs: {d.atms}</p>
                        <p>Population: {d.population?.toLocaleString()}</p>
                      </div>
                    </Popup>
                  </Circle>
                );
              })}
            </MapContainer>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader className="px-4 py-3">
            <h3 className="font-semibold text-gray-900">District Details</h3>
          </CardHeader>
          <CardContent className="p-4">
            {selectedDistrict ? (
              <div className="space-y-3">
                <h4 className="text-lg font-bold text-bou-500">{selectedDistrict.district}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Financial Access Score</span>
                    <span className={`font-bold ${
                      selectedDistrict.accessScore >= 80 ? "text-green-600" : selectedDistrict.accessScore >= 60 ? "text-yellow-600" : "text-red-600"
                    }`}>{selectedDistrict.accessScore}%</span>
                  </div>
                  {[
                    ["Bank Branches", selectedDistrict.bankBranches],
                    ["SACCOs", selectedDistrict.saccos],
                    ["Agents", selectedDistrict.agents],
                    ["ATMs", selectedDistrict.atms],
                    ["Population", selectedDistrict.population?.toLocaleString()],
                  ].map(([label, value]) => (
                    <div key={label as string} className="flex justify-between text-sm">
                      <span className="text-gray-500">{label}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-bou-50 rounded-lg p-3 mt-3">
                  <p className="text-sm text-bou-700">
                    <strong>Recommendation:</strong> Deploy {selectedDistrict.recommendedAgents} new agents
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">Click a district on the map to view details</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-4 py-3">
            <h3 className="font-semibold text-gray-900">Legend</h3>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {[
              { color: "#4A2C1B", label: "High Access (80%+)" },
              { color: "#C5A880", label: "Moderate Access (60-79%)" },
              { color: "#f59e0b", label: "Low Access (40-59%)" },
              { color: "#ef4444", label: "Critical Access (<40%)" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: item.color }} />
                <span className="text-gray-600">{item.label}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
