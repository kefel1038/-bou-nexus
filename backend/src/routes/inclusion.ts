import { Router, Request, Response } from "express";
import { inclusionData } from "../data/mockData";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({ count: inclusionData.length, data: inclusionData });
});

router.get("/:district", (req: Request, res: Response) => {
  const data = inclusionData.find(
    d => d.district.toLowerCase() === req.params.district.toLowerCase()
  );
  if (!data) {
    res.status(404).json({ error: `District '${req.params.district}' not found` });
    return;
  }
  res.json(data);
});

export default router;
