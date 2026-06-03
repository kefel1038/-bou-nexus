"use client";

import { useEffect, useState } from "react";
import Card, { CardContent, CardHeader } from "@/components/ui/Card";
import { Activity, UserPlus, TrendingUp, AlertTriangle, MessageSquare, CheckCircle } from "lucide-react";

const templates = [
  { icon: UserPlus, text: "New Treasury Investor – {district}", color: "text-blue-500", bg: "bg-blue-100" },
  { icon: MessageSquare, text: "Complaint Submitted – {district}", color: "text-red-500", bg: "bg-red-100" },
  { icon: AlertTriangle, text: "Fraud Alert Generated – {district}", color: "text-orange-500", bg: "bg-orange-100" },
  { icon: TrendingUp, text: "Credit Score Generated – {district}", color: "text-green-500", bg: "bg-green-100" },
  { icon: CheckCircle, text: "Escrow Payment Released – {district}", color: "text-purple-500", bg: "bg-purple-100" },
  { icon: UserPlus, text: "New SACCO Registered – {district}", color: "text-bou-500", bg: "bg-bou-100" },
];

const districts = ["Kampala", "Mbale", "Gulu", "Soroti", "Mbarara", "Arua", "Jinja", "Wakiso", "Lira", "Karamoja"];

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface ActivityEvent {
  id: number;
  icon: any;
  text: string;
  color: string;
  bg: string;
  time: string;
}

export default function ActivityStream() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);

  useEffect(() => {
    const addEvent = () => {
      const template = randomPick(templates);
      const district = randomPick(districts);
      const now = new Date();
      const t = now.toLocaleString("en-UG", { hour: "2-digit", minute: "2-digit" });
      const newEvent: ActivityEvent = {
        id: Date.now(),
        icon: template.icon,
        text: template.text.replace("{district}", district),
        color: template.color,
        bg: template.bg,
        time: t,
      };
      setEvents((prev) => [newEvent, ...prev].slice(0, 20));
    };

    addEvent();
    const interval = setInterval(addEvent, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-bou-500" />
          <h3 className="font-semibold text-gray-900">Real-Time Activity</h3>
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse ml-1" />
        </div>
      </CardHeader>
      <CardContent className="max-h-[350px] overflow-y-auto p-0">
        <div className="divide-y divide-gray-100">
          {events.map((event) => {
            const Icon = event.icon;
            return (
              <div key={event.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 transition-colors">
                <div className={`w-8 h-8 rounded-full ${event.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${event.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">{event.text}</p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{event.time}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
