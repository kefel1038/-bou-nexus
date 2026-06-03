"use client";

import { useEffect, useState } from "react";
import Card, { CardContent } from "../ui/Card";
import Badge from "../ui/Badge";
import { api } from "@/lib/api";

interface Complaint {
  id: string; name: string; district: string;
  complaintType: string; language: string;
  message: string; status: string; timestamp: string;
}

const statusColors: Record<string, "warning" | "info" | "success"> = {
  open: "warning",
  investigating: "info",
  resolved: "success",
};

const typeLabels: Record<string, string> = {
  fraud: "Fraud", hidden_charges: "Hidden Charges",
  loan_abuse: "Loan Abuse", agent_misconduct: "Agent Misconduct",
};

export default function ComplaintList() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getComplaints().then((res) => {
      setComplaints(res.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {complaints.length === 0 && (
        <p className="text-gray-500 text-center py-8">No complaints submitted yet</p>
      )}
      {complaints.slice().reverse().map((c) => (
        <Card key={c.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-medium text-gray-900">{c.name}</h4>
                <p className="text-xs text-gray-500">{c.district} &middot; {new Date(c.timestamp).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant={statusColors[c.status] || "default"}>{c.status}</Badge>
              </div>
            </div>
            <div className="flex gap-2 mb-2">
              <Badge>{typeLabels[c.complaintType] || c.complaintType}</Badge>
              <Badge>{c.language}</Badge>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{c.message}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
