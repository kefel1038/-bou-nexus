"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, Landmark, User, LogOut, ChevronDown } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/treasury", label: "Treasury" },
  { href: "/consumer-protection", label: "Consumer Protection" },
  { href: "/fraud-sentinel", label: "Fraud Sentinel" },
  { href: "/regional-payments", label: "Regional Payments" },
  { href: "/escrow", label: "School Escrow" },
  { href: "/inclusion-map", label: "Inclusion Map" },
  { href: "/bou-command-center", label: "BOU Command Center" },
];

const portalLinks = [
  { href: "/portal/citizen", label: "Citizen Portal", role: "citizen" },
  { href: "/portal/farmer", label: "Farmer Portal", role: "farmer" },
  { href: "/portal/sme", label: "SME Portal", role: "sme" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
            <div className="w-9 h-9 rounded-lg bg-bou-500 flex items-center justify-center">
              <Landmark className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-bou-500 hidden sm:block">BoU Nexus</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => router.push(link.href)}
                className="text-sm font-medium text-gray-600 hover:text-bou-500 transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-bou-500 transition-colors">
                Portals <ChevronDown className="w-3 h-3" />
              </button>
              <div className="absolute top-full right-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {portalLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => router.push(link.href)}
                    className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-bou-50 hover:text-bou-600 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-bou-50 text-bou-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-bou-100 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.name}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.role} • {user.district}</p>
                      </div>
                      <button
                        onClick={() => { setDropdownOpen(false); router.push("/admin"); }}
                        className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Admin Panel
                      </button>
                      <button
                        onClick={() => { setDropdownOpen(false); handleLogout(); }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => router.push("/admin")}
                className="bg-bou-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-bou-600 transition-colors"
              >
                Sign In
              </button>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => { setMobileOpen(false); router.push(link.href); }}
                className="block w-full text-left px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-bou-50 hover:text-bou-600 rounded-lg"
              >
                {link.label}
              </button>
            ))}
            <div className="border-t border-gray-100 pt-2 mt-2">
              <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Portals</p>
              {portalLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => { setMobileOpen(false); router.push(link.href); }}
                  className="block w-full text-left px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-bou-50 hover:text-bou-600 rounded-lg"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
