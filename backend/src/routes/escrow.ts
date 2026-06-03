import { Router, Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { authenticate } from "../middleware/auth";
import { escrowTransactions } from "../data/mockData";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({ count: escrowTransactions.length, data: escrowTransactions });
});

router.post("/", authenticate, (req: Request, res: Response) => {
  const { parentName, parentPhone, schoolName, studentName, amount } = req.body;
  if (!parentName || !parentPhone || !schoolName || !studentName || !amount) {
    res.status(400).json({ error: "parentName, parentPhone, schoolName, studentName, and amount are required" });
    return;
  }

  const transaction = {
    id: uuid(),
    parentId: req.user!.id,
    parentName,
    parentPhone,
    schoolName,
    studentName,
    amount: Number(amount),
    status: "deposited" as const,
    depositedAt: new Date().toISOString(),
  };

  escrowTransactions.push(transaction);
  res.status(201).json(transaction);
});

router.patch("/:id/request", (req: Request, res: Response) => {
  const txn = escrowTransactions.find(t => t.id === req.params.id);
  if (!txn) {
    res.status(404).json({ error: "Escrow transaction not found" });
    return;
  }

  if (txn.status !== "deposited") {
    res.status(400).json({ error: `Cannot request release. Current status: ${txn.status}` });
    return;
  }

  txn.status = "requested";
  txn.requestedAt = new Date().toISOString();
  res.json(txn);
});

router.patch("/:id/approve", (req: Request, res: Response) => {
  const txn = escrowTransactions.find(t => t.id === req.params.id);
  if (!txn) {
    res.status(404).json({ error: "Escrow transaction not found" });
    return;
  }

  if (txn.status !== "requested") {
    res.status(400).json({ error: `Cannot approve. Current status: ${txn.status}` });
    return;
  }

  txn.status = "approved";
  txn.approvedAt = new Date().toISOString();
  res.json(txn);
});

router.patch("/:id/release", (req: Request, res: Response) => {
  const txn = escrowTransactions.find(t => t.id === req.params.id);
  if (!txn) {
    res.status(404).json({ error: "Escrow transaction not found" });
    return;
  }

  if (txn.status !== "approved") {
    res.status(400).json({ error: `Cannot release. Current status: ${txn.status}` });
    return;
  }

  txn.status = "released";
  txn.releasedAt = new Date().toISOString();
  res.json(txn);
});

export default router;
