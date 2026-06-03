const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://bou-nexus-backend-production.up.railway.app/api";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth
  login: (phone: string, pin: string) =>
    request<{ token: string; user: any; role: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ phone, pin }),
    }),

  // Health
  health: () => request<{ status: string }>("/health"),

  // Savings
  getSavings: () => request<any>("/savings"),
  createSavings: (data: any) =>
    request<any>("/savings", { method: "POST", body: JSON.stringify(data) }),

  // Investments
  getInvestments: () => request<any>("/investments"),
  createInvestment: (data: any) =>
    request<any>("/investments", { method: "POST", body: JSON.stringify(data) }),

  // Credit scores
  getCreditScores: () => request<any>("/credit-scores"),
  createCreditScore: (data: any) =>
    request<any>("/credit-score", { method: "POST", body: JSON.stringify(data) }),

  // Complaints
  getComplaints: () => request<any>("/complaints"),
  getComplaintStats: () => request<any>("/complaints/stats"),
  createComplaint: (data: any) =>
    request<any>("/complaints", { method: "POST", body: JSON.stringify(data) }),
  resolveComplaint: (id: string) =>
    request<any>(`/complaints/${id}/resolve`, { method: "PATCH" }),

  // Fraud
  getFraudAlerts: () => request<any>("/fraud-alerts"),
  getFraudStats: () => request<any>("/fraud-alerts/stats"),
  analyzeFraud: (data: any) =>
    request<any>("/fraud-alerts/analyze", { method: "POST", body: JSON.stringify(data) }),

  // Analytics
  getAnalyticsOverview: () => request<any>("/analytics/overview"),
  getFinancialInclusion: () => request<any>("/analytics/financial-inclusion"),
  getConsumerProtection: () => request<any>("/analytics/consumer-protection"),
  getFraudMonitoring: () => request<any>("/analytics/fraud-monitoring"),
  getEconomicStats: () => request<any>("/analytics/economic"),
  getCapitalMarkets: () => request<any>("/analytics/capital-markets"),

  // SME
  getSMEs: () => request<any>("/sme"),
  createSME: (data: any) =>
    request<any>("/sme", { method: "POST", body: JSON.stringify(data) }),
  getSMEInventory: (id: string) => request<any>(`/sme/${id}/inventory`),
  getSMECashflow: (id: string) => request<any>(`/sme/${id}/cashflow`),
  getSMEHealth: (id: string) => request<any>(`/sme/${id}/health`),

  // FX
  getFXRates: () => request<any>("/fx/rates"),
  getFXHistory: (params?: { pair?: string; days?: number }) => {
    const qs = new URLSearchParams();
    if (params?.pair) qs.set("pair", params.pair);
    if (params?.days) qs.set("days", String(params.days));
    return request<any>(`/fx/history?${qs}`);
  },

  // Escrow
  getEscrowTransactions: () => request<any>("/escrow"),
  createEscrow: (data: any) =>
    request<any>("/escrow", { method: "POST", body: JSON.stringify(data) }),
  requestRelease: (id: string) =>
    request<any>(`/escrow/${id}/request`, { method: "PATCH" }),
  approveRelease: (id: string) =>
    request<any>(`/escrow/${id}/approve`, { method: "PATCH" }),
  releaseFunds: (id: string) =>
    request<any>(`/escrow/${id}/release`, { method: "PATCH" }),

  // Inclusion map
  getInclusionData: () => request<any>("/inclusion-map"),
  getDistrictData: (district: string) =>
    request<any>(`/inclusion-map/${district}`),
};

export const loginAs = {
  admin: () => api.login("+256700000001", "1234"),
};
