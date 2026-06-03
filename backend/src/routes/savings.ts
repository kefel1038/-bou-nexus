import { Router, Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { authenticate } from "../middleware/auth";
import { savingsAccounts, investments } from "../data/mockData";

export const savingsRouter = Router();

savingsRouter.get("/", (_req: Request, res: Response) => {
  res.json({ count: savingsAccounts.length, data: savingsAccounts });
});

savingsRouter.post("/", authenticate, (req: Request, res: Response) => {
  const { name, district, phone, amount, investmentType } = req.body;
  if (!name || !district || !phone || !amount || !investmentType) {
    res.status(400).json({ error: "name, district, phone, amount, and investmentType are required" });
    return;
  }

  const validTypes = ["savings", "tbill", "tbond"];
  if (!validTypes.includes(investmentType)) {
    res.status(400).json({ error: "investmentType must be savings, tbill, or tbond" });
    return;
  }

  const rate = investmentType === "tbill" ? 0.12 : investmentType === "tbond" ? 0.14 : 0.04;
  const months = investmentType === "savings" ? 1 : investmentType === "tbill" ? 3 : 12;

  const account = {
    id: uuid(),
    userId: req.user!.id,
    name,
    district,
    phone,
    amount: Number(amount),
    investmentType,
    timestamp: new Date().toISOString(),
    status: "active" as const,
    expectedReturn: investmentType === "savings" ? 0 : Number((Number(amount) * rate * (months / 12)).toFixed(2)),
  };

  savingsAccounts.push(account);
  res.status(201).json(account);
});

export const investmentRouter = Router();

investmentRouter.get("/", (_req: Request, res: Response) => {
  res.json({ count: investments.length, data: investments });
});

investmentRouter.post("/", authenticate, (req: Request, res: Response) => {
  const { name, district, phone, amount, type } = req.body;
  if (!name || !district || !phone || !amount || !type) {
    res.status(400).json({ error: "name, district, phone, amount, and type are required" });
    return;
  }

  if (type !== "tbill" && type !== "tbond") {
    res.status(400).json({ error: "type must be tbill or tbond" });
    return;
  }

  const days = type === "tbill" ? 91 : 365;
  const rate = type === "tbill" ? 12 : 14;
  const maturityDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  const investment = {
    id: uuid(),
    userId: req.user!.id,
    name,
    district,
    phone,
    amount: Number(amount),
    type,
    rate,
    timestamp: new Date().toISOString(),
    maturityDate: maturityDate.toISOString(),
  };

  investments.push(investment);
  res.status(201).json(investment);
});
