import { Router, Request, Response } from "express";
import { fxRates, generateFXHistory } from "../data/mockData";

const router = Router();

const fxHistory = generateFXHistory();

router.get("/rates", (_req: Request, res: Response) => {
  res.json({ count: fxRates.length, data: fxRates });
});

router.get("/history", (req: Request, res: Response) => {
  const { pair, days } = req.query;

  let filtered = fxHistory;
  if (pair) {
    const decodedPair = Array.isArray(pair) ? pair[0] : pair;
    filtered = filtered.filter(r => r.pair === decodedPair);
  }

  if (days) {
    const numDays = Number(days);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - numDays);
    filtered = filtered.filter(r => new Date(r.date) >= cutoff);
  }

  res.json({ count: filtered.length, data: filtered });
});

export default router;
