export interface User {
  id: string; phone: string; name: string; district: string;
  role: "citizen" | "farmer" | "sme" | "sacco" | "bank" | "bou_analyst" | "admin";
  language: string; balance: number; creditScore?: number;
}

export interface AuthResponse {
  token: string; user: User; role: string;
}

export interface SavingsAccount {
  id: string; userId: string; name: string; district: string;
  phone: string; amount: number; investmentType: "savings" | "tbill" | "tbond";
  timestamp: string; status: "active" | "matured"; expectedReturn: number;
}

export interface Investment {
  id: string; userId: string; name: string; district: string;
  phone: string; amount: number; type: "tbill" | "tbond";
  rate: number; timestamp: string; maturityDate: string;
}

export interface CreditScoreResult {
  id: string; userId: string; name: string; district: string;
  score: number; risk: "Low" | "Medium" | "High";
  eligibleLoan: number; factors: CreditFactor[]; timestamp: string;
}

export interface CreditFactor {
  name: string; score: number; weight: number;
}

export interface Complaint {
  id: string; name: string; phone: string; district: string;
  complaintType: "fraud" | "hidden_charges" | "loan_abuse" | "agent_misconduct";
  language: string; message: string; status: "open" | "investigating" | "resolved";
  timestamp: string; resolvedAt?: string;
}

export interface FraudAlert {
  id: string; accountId: string; accountName: string; district: string;
  riskScore: number; reason: string; status: "flagged" | "investigating" | "resolved";
  transactionCount: number; linkedAccounts: number; timestamp: string;
}

export interface SME {
  id: string; ownerId: string; businessName: string; ownerName: string;
  district: string; sector: string; monthlyRevenue: number;
  healthScore: number; registeredAt: string;
}

export interface InventoryItem {
  id: string; smeId: string; name: string; quantity: number;
  unitPrice: number; category: string;
}

export interface CashflowRecord {
  id: string; smeId: string; type: "income" | "expense";
  amount: number; category: string; description: string; date: string;
}

export interface FXRate {
  pair: string; buy: number; sell: number; change: number; date: string;
}

export interface InclusionData {
  district: string; accessScore: number; bankBranches: number;
  agents: number; saccos: number; atms: number; population: number;
  recommendedAgents: number;
}

export interface EscrowTransaction {
  id: string; parentId: string; parentName: string; parentPhone: string;
  schoolName: string; studentName: string; amount: number;
  status: "deposited" | "requested" | "approved" | "released";
  depositedAt: string; requestedAt?: string; approvedAt?: string; releasedAt?: string;
}

export interface AnalyticsOverview {
  totalUsers: number; totalSavings: number; totalInvestments: number;
  totalComplaints: number; totalFraudAlerts: number; totalSMEs: number;
  totalEscrowTransactions: number; avgCreditScore: number;
  totalSavingsValue: number; totalInvestmentValue: number;
}

export interface ConsumerProtectionStats {
  total: number; byType: Record<string, number>;
  byDistrict: Record<string, number>; byStatus: Record<string, number>;
  resolutionRate: number; openComplaints: number;
}

export interface FraudMonitoringStats {
  total: number; byStatus: Record<string, number>;
  byDistrict: Record<string, number>;
  riskDistribution: Record<string, number>; avgRiskScore: number;
}

export interface EconomicStats {
  totalSMEs: number; activeSMEs: number; avgHealthScore: number;
  sectorBreakdown: Record<string, { count: number; avgRevenue: number }>;
  totalInventoryValue: number;
  cashflowSummary: { totalIncome: number; totalExpense: number; netCashflow: number };
  savingsGrowth: number;
}

export interface CapitalMarketsStats {
  totalInvestments: number; totalInvested: number; averageInvestment: number;
  tbillCount: number; tbondCount: number;
  tbillTotal: number; tbondTotal: number;
  byDistrict: Record<string, { count: number; total: number }>;
  avgRate: number;
}

export interface ApiResponse<T> {
  count?: number;
  data: T;
}
