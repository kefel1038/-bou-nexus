"use client";

import { useState } from "react";
import { Play, Check, ArrowDown, User, Banknote, TrendingUp, BarChart3 } from "lucide-react";
import Button from "@/components/ui/Button";

const steps = [
  { icon: User, label: "Citizen Deposits", detail: "UGX 5,000 via Mobile Money", color: "text-blue-500", bg: "bg-blue-100" },
  { icon: Banknote, label: "Treasury Investment", detail: "T-Bill Created (12% APR)", color: "text-yellow-500", bg: "bg-yellow-100" },
  { icon: TrendingUp, label: "Savings Recorded", detail: "National Savings Updated", color: "text-green-500", bg: "bg-green-100" },
  { icon: BarChart3, label: "BoU Dashboard", detail: "National Counter Increases", color: "text-bou-500", bg: "bg-bou-100" },
];

export default function CitizenJourney() {
  const [currentStep, setCurrentStep] = useState(-1);
  const [completed, setCompleted] = useState(false);
  const [running, setRunning] = useState(false);

  const runSimulation = () => {
    if (running) return;
    setRunning(true);
    setCurrentStep(-1);
    setCompleted(false);

    steps.forEach((_, idx) => {
      setTimeout(() => setCurrentStep(idx), (idx + 1) * 800);
    });

    setTimeout(() => {
      setCompleted(true);
      setRunning(false);
    }, steps.length * 800 + 500);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-900">Citizen Journey Simulation</h3>
          <p className="text-sm text-gray-500">One-click end-to-end workflow</p>
        </div>
        <Button onClick={runSimulation} disabled={running} className="flex items-center gap-2">
          <Play className="w-4 h-4" />
          {running ? "Simulating..." : "Run Simulation"}
        </Button>
      </div>

      <div className="relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === currentStep;
          const isPast = idx < currentStep || (completed && idx < steps.length);

          return (
            <div key={idx} className="flex items-start gap-4 mb-6 last:mb-0">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isPast ? "bg-green-500 text-white" : isActive ? step.bg + " " + step.color : "bg-gray-100 text-gray-400"
                }`}>
                  {isPast ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-0.5 h-8 transition-all duration-500 ${isPast ? "bg-green-400" : "bg-gray-200"}`} />
                )}
              </div>
              <div className={`flex-1 pt-1.5 transition-all duration-500 ${isActive || isPast ? "opacity-100" : "opacity-40"}`}>
                <p className="font-medium text-sm text-gray-900">{step.label}</p>
                <p className="text-xs text-gray-500">{step.detail}</p>
              </div>
              {isActive && !completed && (
                <div className="animate-pulse w-2 h-2 rounded-full bg-bou-500 mt-2.5" />
              )}
            </div>
          );
        })}
      </div>

      {completed && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
          <p className="text-sm font-medium text-green-700">
            UGX 5,000 invested → Treasury created → Dashboard updated
          </p>
        </div>
      )}
    </div>
  );
}
