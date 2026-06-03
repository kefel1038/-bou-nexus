"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Card, { CardContent } from "../ui/Card";
import { api } from "@/lib/api";

const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), { ssr: false });
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

export default function FraudMap() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    api.getFraudAlerts().then((res) => setAlerts(res.data || [])).catch(() => {});
    import("leaflet").then((m) => setL(m.default || m));
  }, []);

  if (typeof window === "undefined" || !L) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse bg-gray-100 rounded-lg h-[300px]" />
        </CardContent>
      </Card>
    );
  }

  const alertCounts: Record<string, number> = {};
  alerts.forEach((a) => {
    alertCounts[a.district] = (alertCounts[a.district] || 0) + 1;
  });

  const mapCenter: [number, number] = [1.3733, 32.2903];

  return (
    <Card>
      <CardContent className="p-0 overflow-hidden">
        <div className="h-[300px]">
          <MapContainer center={mapCenter} zoom={7} scrollWheelZoom={false} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {Object.entries(districtCoords).map(([district, coords]) => {
              const count = alertCounts[district] || 0;
              if (count === 0) return null;
              const size = Math.min(40, 10 + count * 5);
              const color = count >= 3 ? "#ef4444" : count >= 2 ? "#f59e0b" : "#6b7280";
              return (
                <Marker
                  key={district}
                  position={coords}
                  icon={L.divIcon({
                    className: "bg-transparent",
                    html: `<div style="width:${size}px;height:${size}px;background:${color};border:2px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:${size > 25 ? "12px" : "0"}">${count}</div>`,
                    iconSize: [size, size],
                    iconAnchor: [size / 2, size / 2],
                  })}
                >
                  <Popup>
                    <div className="text-sm font-medium">{district}</div>
                    <div className="text-xs text-gray-500">{count} fraud alert{count > 1 ? "s" : ""}</div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
}
