"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Users, Shield, DollarSign, Briefcase, AlertTriangle } from "lucide-react";

const targetValues = {
  newSavers: 3215,
  treasuryInvestors: 1145,
  newBorrowers: 897,
  fraudAlerts: 14,
  complaints: 32,
  smeVolume: 4300000000,
};

function AnimatedCounter({ end, prefix = "", suffix = "", duration = 2000 }: { end: number; prefix?: string; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);

  return <>{prefix}{count.toLocaleString()}{suffix}</>;
}

export default function FinancialPulse() {
  return (
    <div className="bg-gradient-to-r from-bou-900 via-bou-800 to-bou-700 rounded-2xl p-6 text-white">
      <h2 className="text-sm font-semibold text-bou-200 uppercase tracking-wider mb-4">
        UGANDA FINANCIAL HEALTH TODAY
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
          <Users className="w-5 h-5 text-bou-gold mx-auto mb-1" />
          <p className="text-2xl font-bold"><AnimatedCounter end={targetValues.newSavers} /></p>
          <p className="text-xs text-bou-200">New Savers</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
          <TrendingUp className="w-5 h-5 text-bou-gold mx-auto mb-1" />
          <p className="text-2xl font-bold"><AnimatedCounter end={targetValues.treasuryInvestors} /></p>
          <p className="text-xs text-bou-200">Treasury Investors</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
          <DollarSign className="w-5 h-5 text-bou-gold mx-auto mb-1" />
          <p className="text-2xl font-bold"><AnimatedCounter end={targetValues.newBorrowers} /></p>
          <p className="text-xs text-bou-200">New Borrowers</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
          <Shield className="w-5 h-5 text-bou-gold mx-auto mb-1" />
          <p className="text-2xl font-bold"><AnimatedCounter end={targetValues.fraudAlerts} /></p>
          <p className="text-xs text-bou-200">Fraud Alerts</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
          <AlertTriangle className="w-5 h-5 text-bou-gold mx-auto mb-1" />
          <p className="text-2xl font-bold"><AnimatedCounter end={targetValues.complaints} /></p>
          <p className="text-xs text-bou-200">Complaints</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
          <Briefcase className="w-5 h-5 text-bou-gold mx-auto mb-1" />
          <p className="text-2xl font-bold">UGX 4.3B</p>
          <p className="text-xs text-bou-200">SME Volume</p>
        </div>
      </div>
    </div>
  );
}
