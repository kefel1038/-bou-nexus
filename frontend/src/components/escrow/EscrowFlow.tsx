"use client";

import { useState, useEffect } from "react";
import { Check, Send, UserCheck, Clock } from "lucide-react";
import Card, { CardContent, CardHeader } from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Badge from "../ui/Badge";
import { api } from "@/lib/api";

const statusConfig: Record<string, { label: string; color: "warning" | "info" | "success" | "default"; icon: React.ReactNode }> = {
  deposited: { label: "Deposited", color: "default", icon: <Clock className="w-4 h-4" /> },
  requested: { label: "Requested", color: "warning", icon: <Send className="w-4 h-4" /> },
  approved: { label: "Approved", color: "info", icon: <UserCheck className="w-4 h-4" /> },
  released: { label: "Released", color: "success", icon: <Check className="w-4 h-4" /> },
};

const steps = ["deposited", "requested", "approved", "released"];

export function EscrowFlowChart({ transaction }: { transaction: any }) {
  const currentIdx = steps.indexOf(transaction.status);

  return (
    <div className="flex items-center gap-1 mb-3">
      {steps.map((step, idx) => {
        const cfg = statusConfig[step];
        const isActive = idx <= currentIdx;
        const isCurrent = idx === currentIdx;
        return (
          <div key={step} className="flex-1">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-colors ${
                isActive ? "bg-bou-500 text-white" : "bg-gray-200 text-gray-500"
              } ${isCurrent ? "ring-2 ring-bou-300" : ""}`}>
                {idx + 1}
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 ${idx < currentIdx ? "bg-bou-500" : "bg-gray-200"}`} />
              )}
            </div>
            <p className={`text-xs mt-1 ${isActive ? "text-bou-600 font-medium" : "text-gray-400"}`}>{cfg.label}</p>
          </div>
        );
      })}
    </div>
  );
}

export function CreateEscrowForm({ onSuccess }: { onSuccess?: () => void }) {
  const [formData, setFormData] = useState({
    parentName: "", parentPhone: "", schoolName: "", studentName: "", amount: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createEscrow(formData);
      setFormData({ parentName: "", parentPhone: "", schoolName: "", studentName: "", amount: "" });
      onSuccess?.();
    } catch {}
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader className="px-4 py-3">
        <h3 className="font-semibold text-gray-900">School Fees Escrow</h3>
      </CardHeader>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Input label="Parent Name" value={formData.parentName} onChange={(e) => setFormData({ ...formData, parentName: e.target.value })} required />
            <Input label="Parent Phone" value={formData.parentPhone} onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input label="School Name" value={formData.schoolName} onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })} required />
            <Input label="Student Name" value={formData.studentName} onChange={(e) => setFormData({ ...formData, studentName: e.target.value })} required />
          </div>
          <Input label="Amount (UGX)" type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required min={50000} />
          <Button type="submit" className="w-full" loading={loading}>Deposit Fees</Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function EscrowTransactionList() {
  const [txns, setTxns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getEscrowTransactions().then((res) => {
      setTxns(res.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse space-y-2">{[1,2,3].map(i => <div key={i} className="bg-gray-100 h-16 rounded-lg" />)}</div>;

  return (
    <div className="space-y-3">
      {txns.length === 0 && <p className="text-gray-500 text-center py-4 text-sm">No escrow transactions</p>}
      {txns.slice().reverse().map((txn) => (
        <Card key={txn.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-medium text-sm text-gray-900">{txn.studentName}</p>
                <p className="text-xs text-gray-500">{txn.schoolName} &middot; {txn.parentName}</p>
              </div>
              <Badge variant={statusConfig[txn.status]?.color || "default"}>{txn.status}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-gray-900">UGX {txn.amount.toLocaleString()}</span>
              <span className="text-xs text-gray-400">{new Date(txn.depositedAt).toLocaleDateString()}</span>
            </div>
            <EscrowFlowChart transaction={txn} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
