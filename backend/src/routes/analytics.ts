import { Router, Request, Response } from "express";
import {
  users, savingsAccounts, investments, complaints, fraudAlerts,
  creditScores, smes, cashflowRecords, inventory,
  inclusionData, fxRates, escrowTransactions,
} from "../data/mockData";

const router = Router();

router.get("/overview", (_req: Request, res: Response) => {
  const avgCredit = creditScores.length > 0
    ? Math.round(creditScores.reduce((s, c) => s + c.score, 0) / creditScores.length)
    : 0;

  res.json({
    totalUsers: users.length,
    totalSavings: savingsAccounts.length,
    totalInvestments: investments.length,
    totalComplaints: complaints.length,
    totalFraudAlerts: fraudAlerts.length,
    totalSMEs: smes.length,
    totalEscrowTransactions: escrowTransactions.length,
    avgCreditScore: avgCredit,
    totalSavingsValue: savingsAccounts.reduce((s, a) => s + a.amount, 0),
    totalInvestmentValue: investments.reduce((s, i) => s + i.amount, 0),
  });
});

router.get("/financial-inclusion", (_req: Request, res: Response) => {
  res.json({
    count: inclusionData.length,
    data: inclusionData.map(d => ({
      district: d.district,
      accessScore: d.accessScore,
      bankBranches: d.bankBranches,
      agents: d.agents,
      saccos: d.saccos,
      atms: d.atms,
      population: d.population,
      recommendedAgents: d.recommendedAgents,
    })),
  });
});

router.get("/consumer-protection", (_req: Request, res: Response) => {
  const byType: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  const byDistrict: Record<string, number> = {};

  for (const c of complaints) {
    byType[c.complaintType] = (byType[c.complaintType] || 0) + 1;
    byStatus[c.status] = (byStatus[c.status] || 0) + 1;
    byDistrict[c.district] = (byDistrict[c.district] || 0) + 1;
  }

  res.json({
    total: complaints.length,
    byType,
    byDistrict,
    byStatus,
    resolutionRate: complaints.length > 0
      ? Math.round((complaints.filter(c => c.status === "resolved").length / complaints.length) * 100)
      : 0,
    openComplaints: complaints.filter(c => c.status === "open").length,
  });
});

router.get("/fraud-monitoring", (_req: Request, res: Response) => {
  const byStatus: Record<string, number> = {};
  const byDistrict: Record<string, number> = {};
  const riskBuckets = { "60-69": 0, "70-79": 0, "80-89": 0, "90-99": 0 };
  let totalRisk = 0;

  for (const a of fraudAlerts) {
    byStatus[a.status] = (byStatus[a.status] || 0) + 1;
    byDistrict[a.district] = (byDistrict[a.district] || 0) + 1;
    totalRisk += a.riskScore;
    if (a.riskScore >= 90) riskBuckets["90-99"]++;
    else if (a.riskScore >= 80) riskBuckets["80-89"]++;
    else if (a.riskScore >= 70) riskBuckets["70-79"]++;
    else riskBuckets["60-69"]++;
  }

  res.json({
    total: fraudAlerts.length,
    byStatus,
    byDistrict,
    riskDistribution: riskBuckets,
    avgRiskScore: fraudAlerts.length > 0 ? Math.round(totalRisk / fraudAlerts.length) : 0,
  });
});

router.get("/economic", (_req: Request, res: Response) => {
  const sectorBreakdown: Record<string, { count: number; avgRevenue: number }> = {};
  for (const sme of smes) {
    if (!sectorBreakdown[sme.sector]) sectorBreakdown[sme.sector] = { count: 0, avgRevenue: 0 };
    sectorBreakdown[sme.sector].count++;
    sectorBreakdown[sme.sector].avgRevenue += sme.monthlyRevenue;
  }
  for (const key of Object.keys(sectorBreakdown)) {
    sectorBreakdown[key].avgRevenue = Math.round(sectorBreakdown[key].avgRevenue / sectorBreakdown[key].count);
  }

  const totalIncome = cashflowRecords.filter(r => r.type === "income").reduce((s, r) => s + r.amount, 0);
  const totalExpense = cashflowRecords.filter(r => r.type === "expense").reduce((s, r) => s + r.amount, 0);

  res.json({
    totalSMEs: smes.length,
    activeSMEs: smes.filter(s => s.healthScore >= 50).length,
    avgHealthScore: smes.length > 0
      ? Math.round(smes.reduce((s, sme) => s + sme.healthScore, 0) / smes.length)
      : 0,
    sectorBreakdown,
    totalInventoryValue: inventory.reduce((s, i) => s + i.quantity * i.unitPrice, 0),
    cashflowSummary: {
      totalIncome,
      totalExpense,
      netCashflow: totalIncome - totalExpense,
    },
    savingsGrowth: savingsAccounts.length > 0
      ? savingsAccounts.filter(a => a.status === "active").length
      : 0,
  });
});

router.get("/capital-markets", (_req: Request, res: Response) => {
  const tbills = investments.filter(i => i.type === "tbill");
  const tbonds = investments.filter(i => i.type === "tbond");
  const totalInvested = investments.reduce((s, i) => s + i.amount, 0);

  const byDistrict: Record<string, { count: number; total: number }> = {};
  for (const inv of investments) {
    if (!byDistrict[inv.district]) byDistrict[inv.district] = { count: 0, total: 0 };
    byDistrict[inv.district].count++;
    byDistrict[inv.district].total += inv.amount;
  }

  res.json({
    totalInvestments: investments.length,
    totalInvested,
    averageInvestment: investments.length > 0 ? Math.round(totalInvested / investments.length) : 0,
    tbillCount: tbills.length,
    tbondCount: tbonds.length,
    tbillTotal: tbills.reduce((s, i) => s + i.amount, 0),
    tbondTotal: tbonds.reduce((s, i) => s + i.amount, 0),
    byDistrict,
    avgRate: investments.length > 0
      ? Math.round(investments.reduce((s, i) => s + i.rate, 0) / investments.length * 10) / 10
      : 0,
  });
});

export default router;
