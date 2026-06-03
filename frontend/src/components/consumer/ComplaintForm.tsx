"use client";

import { useState } from "react";
import Card, { CardContent } from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { api } from "@/lib/api";

const complaintTypes = [
  { value: "fraud", label: "Fraud" },
  { value: "hidden_charges", label: "Hidden Charges" },
  { value: "loan_abuse", label: "Loan Abuse" },
  { value: "agent_misconduct", label: "Agent Misconduct" },
];

const languages = [
  { value: "English", label: "English" },
  { value: "Luganda", label: "Luganda" },
  { value: "Luo", label: "Luo" },
  { value: "Runyankole", label: "Runyankole" },
  { value: "Ateso", label: "Ateso" },
  { value: "Swahili", label: "Swahili" },
];

export default function ComplaintForm({ onSuccess }: { onSuccess?: () => void }) {
  const [formData, setFormData] = useState({
    name: "", phone: "", district: "",
    complaintType: "", language: "", message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.createComplaint(formData);
      setFormData({ name: "", phone: "", district: "", complaintType: "", language: "", message: "" });
      onSuccess?.();
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit a Complaint</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            <Input label="Phone Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
          </div>
          <Input label="District" value={formData.district} onChange={(e) => setFormData({ ...formData, district: e.target.value })} required />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Complaint Type"
              options={complaintTypes}
              value={formData.complaintType}
              onChange={(e) => setFormData({ ...formData, complaintType: e.target.value })}
              required
            />
            <Select
              label="Language"
              options={languages}
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bou-500 focus:border-bou-500 min-h-[100px] resize-y"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              placeholder="Describe your issue..."
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" loading={loading}>Submit Complaint</Button>
        </form>
      </CardContent>
    </Card>
  );
}
