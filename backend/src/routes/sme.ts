import { Router, Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { authenticate } from "../middleware/auth";
import { smes, inventory, cashflowRecords } from "../data/mockData";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({ count: smes.length, data: smes });
});

router.post("/", authenticate, (req: Request, res: Response) => {
  const { businessName, ownerName, district, sector, monthlyRevenue } = req.body;
  if (!businessName || !ownerName || !district || !sector || !monthlyRevenue) {
    res.status(400).json({ error: "businessName, ownerName, district, sector, and monthlyRevenue are required" });
    return;
  }

  const sme = {
    id: uuid(),
    ownerId: req.user!.id,
    businessName,
    ownerName,
    district,
    sector,
    monthlyRevenue: Number(monthlyRevenue),
    healthScore: Math.round(Math.random() * 80 + 20),
    registeredAt: new Date().toISOString(),
  };

  smes.push(sme);
  res.status(201).json(sme);
});

router.get("/:id/inventory", (req: Request, res: Response) => {
  const sme = smes.find(s => s.id === req.params.id);
  if (!sme) {
    res.status(404).json({ error: "SME not found" });
    return;
  }

  const items = inventory.filter(i => i.smeId === req.params.id);
  res.json({ smeId: req.params.id, count: items.length, data: items });
});

router.post("/:id/inventory", authenticate, (req: Request, res: Response) => {
  const sme = smes.find(s => s.id === req.params.id);
  if (!sme) {
    res.status(404).json({ error: "SME not found" });
    return;
  }

  const { name, quantity, unitPrice, category } = req.body;
  if (!name || !quantity || !unitPrice || !category) {
    res.status(400).json({ error: "name, quantity, unitPrice, and category are required" });
    return;
  }

  const item = {
    id: uuid(),
    smeId: req.params.id,
    name,
    quantity: Number(quantity),
    unitPrice: Number(unitPrice),
    category,
  };

  inventory.push(item);
  res.status(201).json(item);
});

router.get("/:id/cashflow", (req: Request, res: Response) => {
  const sme = smes.find(s => s.id === req.params.id);
  if (!sme) {
    res.status(404).json({ error: "SME not found" });
    return;
  }

  const records = cashflowRecords.filter(r => r.smeId === req.params.id);
  const totalIncome = records.filter(r => r.type === "income").reduce((s, r) => s + r.amount, 0);
  const totalExpense = records.filter(r => r.type === "expense").reduce((s, r) => s + r.amount, 0);

  res.json({
    smeId: req.params.id,
    count: records.length,
    summary: { totalIncome, totalExpense, netCashflow: totalIncome - totalExpense },
    data: records,
  });
});

router.post("/:id/cashflow", authenticate, (req: Request, res: Response) => {
  const sme = smes.find(s => s.id === req.params.id);
  if (!sme) {
    res.status(404).json({ error: "SME not found" });
    return;
  }

  const { type, amount, category, description } = req.body;
  if (!type || !amount || !category || !description) {
    res.status(400).json({ error: "type, amount, category, and description are required" });
    return;
  }

  if (type !== "income" && type !== "expense") {
    res.status(400).json({ error: "type must be 'income' or 'expense'" });
    return;
  }

  const record = {
    id: uuid(),
    smeId: req.params.id,
    type,
    amount: Number(amount),
    category,
    description,
    date: new Date().toISOString(),
  };

  cashflowRecords.push(record);
  res.status(201).json(record);
});

router.get("/:id/health", (req: Request, res: Response) => {
  const sme = smes.find(s => s.id === req.params.id);
  if (!sme) {
    res.status(404).json({ error: "SME not found" });
    return;
  }

  const records = cashflowRecords.filter(r => r.smeId === req.params.id);
  const totalIncome = records.filter(r => r.type === "income").reduce((s, r) => s + r.amount, 0);
  const totalExpense = records.filter(r => r.type === "expense").reduce((s, r) => s + r.amount, 0);
  const profitability = totalIncome > 0 ? (totalIncome - totalExpense) / totalIncome : 0;

  let status: "healthy" | "stable" | "at-risk";
  if (sme.healthScore >= 70 && profitability >= 0) status = "healthy";
  else if (sme.healthScore >= 40) status = "stable";
  else status = "at-risk";

  res.json({
    smeId: sme.id,
    businessName: sme.businessName,
    healthScore: sme.healthScore,
    status,
    monthlyRevenue: sme.monthlyRevenue,
    profitability: parseFloat(profitability.toFixed(4)),
    cashflowRatio: totalExpense > 0 ? parseFloat((totalIncome / totalExpense).toFixed(2)) : 0,
    recommendations: status === "healthy"
      ? ["Consider expanding operations", "Look into investment opportunities"]
      : status === "stable"
        ? ["Improve cash flow management", "Explore SACCO membership for better rates"]
        : ["Urgent financial restructuring needed", "Consult with BOU SME support desk"],
  });
});

export default router;
