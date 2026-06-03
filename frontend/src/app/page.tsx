"use client";

import { useRouter } from "next/navigation";
import {
  Landmark, TrendingUp, Shield, Map, Users, Briefcase,
  PiggyBank, BarChart3, ArrowRight, Star, Globe, CheckCircle,
  Smartphone, Banknote, GraduationCap, MessageCircle,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

const features = [
  { icon: <PiggyBank className="w-6 h-6" />, title: "Digital Savings & Treasury", desc: "Invest in Treasury Bills and Bonds from just UGX 5,000", href: "/treasury" },
  { icon: <BarChart3 className="w-6 h-6" />, title: "Alternative Credit Scoring", desc: "AI-powered credit scores for farmers and SMEs", href: "/portal/farmer" },
  { icon: <Shield className="w-6 h-6" />, title: "Fraud Sentinel AI", desc: "Real-time fraud detection and monitoring", href: "/fraud-sentinel" },
  { icon: <Users className="w-6 h-6" />, title: "Consumer Protection", desc: "Multi-language complaint submission system", href: "/consumer-protection" },
  { icon: <Map className="w-6 h-6" />, title: "Financial Inclusion Map", desc: "GIS-driven financial access visualization", href: "/inclusion-map" },
  { icon: <Globe className="w-6 h-6" />, title: "Regional Payments", desc: "Send money across Uganda, Kenya, Rwanda, Tanzania", href: "/regional-payments" },
  { icon: <GraduationCap className="w-6 h-6" />, title: "School Fees Escrow", desc: "Safe escrow for school fee payments", href: "/escrow" },
  { icon: <Briefcase className="w-6 h-6" />, title: "SME Digitalization", desc: "Inventory, cashflow & business health scoring", href: "/portal/sme" },
];

const stats = [
  { value: "10K+", label: "Active Users" },
  { value: "UGX 50B+", label: "Total Savings" },
  { value: "95%", label: "Fraud Detection Rate" },
  { value: "23", label: "Districts Covered" },
];

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-br from-bou-900 via-bou-800 to-bou-700 text-white">
        <div className="absolute inset-0 bg-bou-grid opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 text-sm">
                <Star className="w-4 h-4 text-bou-gold" />
                <span>Bank of Uganda National Financial Platform</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-4">
                One Platform.
                <br />
                <span className="text-bou-gold">Every Ugandan.</span>
                <br />
                Every Financial Service.
              </h1>
              <p className="text-lg text-bou-200 mb-8 max-w-lg">
                Uganda&apos;s National Financial Operating System unifying mobile money, SACCOs, banks, 
                treasury investments, and financial intelligence into one integrated ecosystem.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-bou-gold text-bou-900 hover:bg-bou-gold-light" onClick={() => router.push("/treasury")}>
                  Start Investing <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" onClick={() => router.push("/bou-command-center")}>
                  BOU Command Center
                </Button>
              </div>
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-4">
              <div className="space-y-4">
                {[
                  { icon: <Smartphone className="w-5 h-5 text-bou-gold" />, label: "Mobile Money", val: "All Networks" },
                  { icon: <Banknote className="w-5 h-5 text-bou-gold" />, label: "Treasury Bills", val: "From 5,000 UGX" },
                  { icon: <Shield className="w-5 h-5 text-bou-gold" />, label: "Fraud Detection", val: "Real-time AI" },
                ].map((item) => (
                  <div key={item.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <div>
                        <p className="text-xs text-bou-200">{item.label}</p>
                        <p className="font-semibold">{item.val}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4 mt-8">
                {[
                  { icon: <Globe className="w-5 h-5 text-bou-gold" />, label: "Region Coverage", val: "EAC Nations" },
                  { icon: <Users className="w-5 h-5 text-bou-gold" />, label: "Credit Scoring", val: "AI Powered" },
                  { icon: <CheckCircle className="w-5 h-5 text-bou-gold" />, label: "Consumer Center", val: "6 Languages" },
                ].map((item) => (
                  <div key={item.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <div>
                        <p className="text-xs text-bou-200">{item.label}</p>
                        <p className="font-semibold">{item.val}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      <section className="py-16 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl lg:text-4xl font-bold text-bou-500">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Platform Modules</h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">
              Comprehensive financial tools powering Uganda&apos;s digital economy
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                onClick={() => router.push(feature.href)}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-bou-200 transition-all duration-200 cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-lg bg-bou-50 flex items-center justify-center text-bou-500 mb-4 group-hover:bg-bou-500 group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Accessible Anywhere</h2>
            <p className="text-gray-500 mt-2">Multiple channels for every Ugandan</p>
          </div>
          <div className="grid sm:grid-cols-4 gap-6">
            {[
              { icon: <Smartphone className="w-8 h-8" />, title: "USSD", desc: "Dial *260# from any phone", color: "bg-green-100 text-green-600" },
              { icon: <MessageCircle className="w-8 h-8" />, title: "WhatsApp", desc: "Chat with our financial bot", color: "bg-green-100 text-green-600" },
              { icon: <Smartphone className="w-8 h-8" />, title: "Mobile App", desc: "Full app experience (Android/iOS)", color: "bg-blue-100 text-blue-600" },
              { icon: <Globe className="w-8 h-8" />, title: "Web Portal", desc: "Desktop dashboard & analytics", color: "bg-purple-100 text-purple-600" },
            ].map((ch) => (
              <div key={ch.title} className="text-center p-6 rounded-xl border border-gray-200">
                <div className={`w-16 h-16 rounded-xl ${ch.color} flex items-center justify-center mx-auto mb-3`}>{ch.icon}</div>
                <h3 className="font-semibold text-gray-900">{ch.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{ch.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Platform Architecture</h2>
            <p className="text-gray-500 mt-2">End-to-end national financial operating system</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-8 overflow-x-auto">
            <div className="min-w-[700px] space-y-6 text-sm">
              <div className="text-center">
                <div className="inline-block bg-bou-500 text-white px-6 py-2 rounded-lg font-bold">BANK OF UGANDA</div>
                <div className="flex justify-center gap-4 mt-3">
                  {["Analytics", "Fraud Engine", "Policy Dashboard"].map((l) => (
                    <div key={l} className="bg-bou-50 text-bou-600 px-4 py-1.5 rounded-lg text-xs font-medium border border-bou-200">{l}</div>
                  ))}
                </div>
              </div>
              <div className="border-t-2 border-dashed border-gray-300 pt-4 text-center">
                <div className="inline-block bg-yellow-100 text-yellow-700 px-6 py-2 rounded-lg font-bold border border-yellow-200">UFIIP CORE PLATFORM</div>
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {["Savings", "Lending", "Investments", "SACCOs", "SMEs", "T-Bills", "T-Bonds"].map((l) => (
                    <div key={l} className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-xs font-medium">{l}</div>
                  ))}
                </div>
              </div>
              <div className="border-t-2 border-dashed border-gray-300 pt-4 text-center">
                <div className="inline-block bg-blue-100 text-blue-700 px-6 py-2 rounded-lg font-bold border border-blue-200">Mobile Money</div>
                <div className="flex justify-center gap-3 mt-2">
                  {["MTN MoMo", "Airtel Money"].map((l) => (
                    <div key={l} className="bg-blue-50 text-blue-600 px-3 py-1 rounded text-xs font-medium">{l}</div>
                  ))}
                </div>
              </div>
              <div className="border-t-2 border-dashed border-gray-300 pt-4 text-center">
                <div className="inline-block bg-green-100 text-green-700 px-6 py-2 rounded-lg font-bold border border-green-200">Citizens</div>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {["Farmers", "Traders", "Youth", "SMEs", "Parents"].map((l) => (
                    <div key={l} className="bg-green-50 text-green-600 px-3 py-1 rounded text-xs font-medium">{l}</div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center gap-2 text-xs text-gray-400 mt-4">
                {["USSD *260#", "WhatsApp", "Mobile App", "Web Portal"].map((l) => (
                  <span key={l} className="bg-gray-100 px-3 py-1 rounded">{l}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-bou-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Built for Bank of Uganda</h2>
          <p className="text-bou-200 max-w-2xl mx-auto mb-8">
            BoU Nexus demonstrates how a unified digital financial infrastructure can drive 
            financial inclusion, stability, consumer protection, and innovation across Uganda.
          </p>
          <div className="grid sm:grid-cols-4 gap-6 text-center">
            {[
              { icon: <Users className="w-8 h-8 mx-auto mb-2" />, label: "Financial Inclusion" },
              { icon: <Shield className="w-8 h-8 mx-auto mb-2" />, label: "Financial Stability" },
              { icon: <CheckCircle className="w-8 h-8 mx-auto mb-2" />, label: "Consumer Protection" },
              { icon: <TrendingUp className="w-8 h-8 mx-auto mb-2" />, label: "Digital Innovation" },
            ].map((item) => (
              <div key={item.label}>
                {item.icon}
                <p className="font-semibold">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
