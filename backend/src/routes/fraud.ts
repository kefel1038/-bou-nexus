import { Router, Request, Response } from "express";
import { authenticate } from "../middleware/auth";
import { fraudAlerts } from "../data/mockData";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({ count: fraudAlerts.length, data: fraudAlerts });
});

router.get("/stats", (_req: Request, res: Response) => {
  const byStatus: Record<string, number> = {};
  const byDistrict: Record<string, number> = {};
  let totalRisk = 0;

  for (const a of fraudAlerts) {
    byStatus[a.status] = (byStatus[a.status] || 0) + 1;
    byDistrict[a.district] = (byDistrict[a.district] || 0) + 1;
    totalRisk += a.riskScore;
  }

  res.json({
    total: fraudAlerts.length,
    byStatus,
    byDistrict,
    avgRiskScore: fraudAlerts.length > 0
      ? Math.round(totalRisk / fraudAlerts.length)
      : 0,
    highRiskCount: fraudAlerts.filter(a => a.riskScore >= 85).length,
  });
});

router.post("/analyze", authenticate, (req: Request, res: Response) => {
  const { accountId, transactionCount, linkedAccounts, amount, location } = req.body;
  if (!accountId || transactionCount === undefined || linkedAccounts === undefined || !amount) {
    res.status(400).json({ error: "accountId, transactionCount, linkedAccounts, and amount are required" });
    return;
  }

  const amountScore = Math.min(40, Math.round(Number(amount) / 1000000) * 5);
  const txnScore = Math.min(30, Math.round(Number(transactionCount) / 10) * 3);
  const linkScore = Math.min(30, Number(linkedAccounts) * 5);
  const totalScore = Math.min(99, amountScore + txnScore + linkScore);

  let riskLevel: string;
  if (totalScore >= 80) riskLevel = "High";
  else if (totalScore >= 60) riskLevel = "Medium";
  else riskLevel = "Low";

  const existingAlert = fraudAlerts.find(a => a.accountId === accountId);

  res.json({
    riskScore: totalScore,
    riskLevel,
    factors: {
      amountRisk: amountScore,
      transactionVelocityRisk: txnScore,
      linkedAccountsRisk: linkScore,
    },
    isKnownAccount: !!existingAlert,
    existingAlertRisk: existingAlert ? existingAlert.riskScore : null,
    recommendation: totalScore >= 80
      ? "Immediate review recommended. Flag account for investigation."
      : totalScore >= 60
        ? "Monitor account closely. Additional verification recommended."
        : "Low risk detected. Continue normal monitoring.",
  });
});

export default router;
