"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, GraduationCap, CheckCircle, Clock, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Card, { CardContent, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import KPI, { KPIGrid } from "@/components/ui/KPI";
import { api } from "@/lib/api";

const statusConfig: Record<string, { label: string; color: "warning" | "info" | "success" | "default"; icon: React.ReactNode }> = {
  deposited: { label: "Deposited", color: "default", icon: <Clock className="w-4 h-4" /> },
  requested: { label: "Requested", color: "warning", icon: <Clock className="w-4 h-4" /> },
  approved: { label: "Approved", color: "info", icon: <UserCheck className="w-4 h-4" /> },
  released: { label: "Released", color: "success", icon: <CheckCircle className="w-4 h-4" /> },
};
const steps = ["deposited", "requested", "approved", "released"];

function FlowChart({ status }: { status: string }) {
  const currentIdx = steps.indexOf(status);
  return (
    <div className="flex items-center gap-1 mb-3">
      {steps.map((step, idx) => {
        const cfg = statusConfig[step];
        const isActive = idx <= currentIdx;
        const isCurrent = idx === currentIdx;
        return (
          <div key={step} className="flex-1">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-colors ${isActive ? "bg-bou-500 text-white" : "bg-gray-200 text-gray-500"} ${isCurrent ? "ring-2 ring-bou-300" : ""}`}>
                {idx + 1}
              </div>
              {idx < steps.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${idx < currentIdx ? "bg-bou-500" : "bg-gray-200"}`} />}
            </div>
            <p className={`text-xs mt-1 ${isActive ? "text-bou-600 font-medium" : "text-gray-400"}`}>{cfg.label}</p>
          </div>
        );
      })}
    </div>
  );
}

export default function EscrowPage() {
  const router = useRouter();
  const [txns, setTxns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ parentName: "", parentPhone: "", schoolName: "", studentName: "", amount: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchTxns = () => {
    setLoading(true);
    api.getEscrowTransactions().then((r) => { setTxns(r.data || []); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchTxns(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createEscrow(formData);
      setFormData({ parentName: "", parentPhone: "", schoolName: "", studentName: "", amount: "" });
      fetchTxns();
    } catch {}
    setSubmitting(false);
  };

  const handleAction = async (id: string, action: "request" | "approve" | "release") => {
    try {
      const actions = { request: api.requestRelease, approve: api.approveRelease, release: api.releaseFunds };
      await actions[action](id);
      fetchTxns();
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => router.push("/")} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">School Fees Escrow</h1>
              <p className="text-gray-500 mt-1">Safe deposit → School requests release → Parent approves → Funds released</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">How It Works</h3>
                <p className="text-xs text-gray-500">4-step secure payment flow</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { step: 1, label: "Parent Deposits Fees", desc: "Parent deposits school fees into secure escrow account", icon: "💰" },
                { step: 2, label: "School Requests Release", desc: "School requests fund release for the student", icon: "🏫" },
                { step: 3, label: "Parent Approves", desc: "Parent reviews and approves the release request", icon: "✅" },
                { step: 4, label: "Funds Released", desc: "Funds are transferred to the school", icon: "📤" },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-bou-50 flex items-center justify-center text-sm font-bold text-bou-500 flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader><h3 className="font-semibold text-gray-900">Deposit School Fees</h3></CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Parent Name" value={formData.parentName} onChange={(e) => setFormData({ ...formData, parentName: e.target.value })} required />
                  <Input label="Parent Phone" value={formData.parentPhone} onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })} required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="School Name" value={formData.schoolName} onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })} required />
                  <Input label="Student Name" value={formData.studentName} onChange={(e) => setFormData({ ...formData, studentName: e.target.value })} required />
                </div>
                <Input label="Amount (UGX)" type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required min={50000} placeholder="50000" />
                <Button type="submit" className="w-full" loading={submitting}>Deposit Fees</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Escrow Transactions ({txns.length})</h3>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="animate-pulse bg-gray-100 h-24 rounded-lg" />)}</div>
              ) : txns.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No escrow transactions yet</p>
              ) : (
                <div className="space-y-4">
                  {txns.slice().reverse().map((txn) => (
                    <div key={txn.id} className="border border-gray-200 rounded-xl p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{txn.studentName}</h4>
                          <p className="text-xs text-gray-500">{txn.schoolName} • {txn.parentName} • {txn.parentPhone}</p>
                        </div>
                        <Badge variant={statusConfig[txn.status]?.color || "default"}>{txn.status}</Badge>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold text-bou-500">UGX {txn.amount.toLocaleString()}</span>
                        <span className="text-xs text-gray-400">{new Date(txn.depositedAt).toLocaleDateString()}</span>
                      </div>
                      <FlowChart status={txn.status} />
                      <div className="flex gap-2 mt-3">
                        {txn.status === "deposited" && (
                          <Button size="sm" variant="secondary" onClick={() => handleAction(txn.id, "request")}>
                            School: Request Release
                          </Button>
                        )}
                        {txn.status === "requested" && (
                          <Button size="sm" variant="primary" onClick={() => handleAction(txn.id, "approve")}>
                            Parent: Approve
                          </Button>
                        )}
                        {txn.status === "approved" && (
                          <Button size="sm" variant="primary" onClick={() => handleAction(txn.id, "release")}>
                            Release Funds
                          </Button>
                        )}
                        {txn.status === "released" && (
                          <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" /> Completed
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
