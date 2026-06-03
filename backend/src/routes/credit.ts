import { Router, Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { authenticate } from "../middleware/auth";
import { creditScores } from "../data/mockData";

const router = Router();

router.post("/", authenticate, (req: Request, res: Response) => {
  const {
    phone, name, district,
    mobileMoneyScore = 50,
    cropYieldScore = 50,
    salesScore = 50,
    utilityScore = 50,
    saccoMember = false,
  } = req.body;

  if (!phone || !name || !district) {
    res.status(400).json({ error: "phone, name, and district are required" });
    return;
  }

  const mmScore = Math.min(100, Math.max(0, Number(mobileMoneyScore)));
  const cropScore = Math.min(100, Math.max(0, Number(cropYieldScore)));
  const salesScoreVal = Math.min(100, Math.max(0, Number(salesScore)));
  const utilityScoreVal = Math.min(100, Math.max(0, Number(utilityScore)));

  let score = Math.round(
    (mmScore * 0.30) + (cropScore * 0.25) + (salesScoreVal * 0.25) + (utilityScoreVal * 0.20)
  );

  if (saccoMember) score += 50;
  score = Math.min(900, Math.max(0, score));

  let risk: "Low" | "Medium" | "High";
  if (score >= 700) risk = "Low";
  else if (score >= 500) risk = "Medium";
  else risk = "High";

  let eligibleLoan: number;
  if (risk === "Low") eligibleLoan = Math.round((score / 900) * 5000000);
  else if (risk === "Medium") eligibleLoan = Math.round((score / 900) * 2000000);
  else eligibleLoan = Math.round((score / 900) * 500000);

  const factors = [
    { name: "Mobile Money History", score: mmScore, weight: 0.30 },
    { name: "Crop Yield History", score: cropScore, weight: 0.25 },
    { name: "Sales History", score: salesScoreVal, weight: 0.25 },
    { name: "Utility Payments", score: utilityScoreVal, weight: 0.20 },
  ];

  const result = {
    id: uuid(),
    userId: req.user!.id,
    name,
    district,
    score,
    risk,
    eligibleLoan,
    factors,
    timestamp: new Date().toISOString(),
  };

  creditScores.push(result);
  res.status(201).json(result);
});

router.get("/", (_req: Request, res: Response) => {
  res.json({ count: creditScores.length, data: creditScores });
});

export default router;
