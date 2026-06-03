"use client";

import { useState } from "react";
import { Smartphone, ArrowLeft, Check } from "lucide-react";
import Card, { CardContent } from "../ui/Card";

type Screen = "main" | "fraud" | "loans" | "learn" | "status";

export default function USSDMenu() {
  const [screen, setScreen] = useState<Screen>("main");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  const handleOption = (screen: Screen, label: string) => {
    setSelectedOption(label);
    if (screen === "main") {
      setSubmitted(false);
      setScreen(screen);
    } else {
      setSubmitted(true);
    }
  };

  const renderMain = () => (
    <div className="space-y-1">
      <p className="text-xs text-green-300 mb-2">Dial *260#</p>
      <p className="text-sm font-bold mb-2">BoU Nexus Consumer Center</p>
      <div className="space-y-1">
        {[
          { key: "1", label: "Report Fraud", screen: "fraud" as Screen },
          { key: "2", label: "Compare Loans", screen: "loans" as Screen },
          { key: "3", label: "Learn Finance", screen: "learn" as Screen },
          { key: "4", label: "Check Complaint Status", screen: "status" as Screen },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => handleOption(item.screen, item.label)}
            className="w-full text-left py-1.5 px-2 rounded hover:bg-green-700 transition-colors text-sm"
          >
            {item.key}. {item.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-green-300 mt-3 border-t border-green-700 pt-2">0. Back</p>
    </div>
  );

  const renderResult = () => (
    <div>
      <button onClick={() => { setScreen("main"); setSubmitted(false); }} className="flex items-center gap-1 text-xs text-green-300 mb-3">
        <ArrowLeft className="w-3 h-3" /> Back
      </button>
      {selectedOption === "Report Fraud" && (
        <div className="space-y-2 text-sm">
          <p className="font-bold">Report Fraud</p>
          <p>Complaint lodged successfully.</p>
          <p className="text-xs text-green-300">Reference: BOU-{Date.now().toString(36).toUpperCase()}</p>
          <p className="text-xs text-green-300">We will contact you within 24 hours.</p>
        </div>
      )}
      {selectedOption === "Compare Loans" && (
        <div className="space-y-2 text-sm">
          <p className="font-bold">Loan Comparison</p>
          {[
            { name: "SACCO Loan", rate: "12%", max: "UGX 5M" },
            { name: "Bank Loan", rate: "18%", max: "UGX 20M" },
            { name: "Mobile Money", rate: "9%", max: "UGX 1M" },
          ].map((loan) => (
            <div key={loan.name} className="bg-green-800 rounded p-2 text-xs">
              <p className="font-semibold">{loan.name}</p>
              <p>Rate: {loan.rate} | Max: {loan.max}</p>
            </div>
          ))}
        </div>
      )}
      {selectedOption === "Learn Finance" && (
        <div className="space-y-2 text-sm">
          <p className="font-bold">Financial Literacy</p>
          <div className="bg-green-800 rounded p-2 text-xs space-y-1">
            <p><strong>Tip 1:</strong> Save at least 10% of your income</p>
            <p><strong>Tip 2:</strong> T-Bills pay 12% interest in 91 days</p>
            <p><strong>Tip 3:</strong> Check your credit score before applying for loans</p>
            <p><strong>Tip 4:</strong> Always compare interest rates before borrowing</p>
          </div>
          <p className="text-xs text-green-300">Reply with a number for more tips</p>
        </div>
      )}
      {selectedOption === "Check Complaint Status" && (
        <div className="space-y-2 text-sm">
          <p className="font-bold">Complaint Status</p>
          <p>Your complaint BOU-ABC123 is:</p>
          <p className="text-yellow-300 font-semibold">Under Investigation</p>
          <p className="text-xs text-green-300">Submitted: 3 days ago</p>
          <p className="text-xs text-green-300">Expected resolution: 4 days</p>
        </div>
      )}
      <button
        onClick={() => { setSubmitted(true); }}
        className="mt-3 flex items-center gap-1 text-xs text-green-300"
      >
        <Check className="w-3 h-3" /> OK
      </button>
    </div>
  );

  return (
    <Card>
      <CardContent className="p-0">
        <div className="bg-green-900 text-green-100 font-mono rounded-xl overflow-hidden">
          <div className="bg-green-800 px-4 py-2 flex items-center gap-2 border-b border-green-700">
            <Smartphone className="w-4 h-4" />
            <span className="text-xs font-bold">USSD Simulator — Dial *260#</span>
          </div>
          <div className="p-4 min-h-[260px] text-sm">
            {submitted ? renderResult() : renderMain()}
          </div>
          <div className="bg-green-800 px-4 py-2 border-t border-green-700">
            <div className="flex items-center gap-1 text-xs text-green-300">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Active session
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
