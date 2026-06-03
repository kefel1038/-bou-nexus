import { Router, Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { authenticate, authorize } from "../middleware/auth";
import { complaints } from "../data/mockData";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({ count: complaints.length, data: complaints });
});

router.get("/stats", (_req: Request, res: Response) => {
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
    byStatus,
    byDistrict,
    resolutionRate: complaints.length > 0
      ? Math.round((complaints.filter(c => c.status === "resolved").length / complaints.length) * 100)
      : 0,
  });
});

router.post("/", (req: Request, res: Response) => {
  const { name, phone, district, complaintType, language, message } = req.body;
  if (!name || !phone || !district || !complaintType || !language || !message) {
    res.status(400).json({ error: "All fields are required: name, phone, district, complaintType, language, message" });
    return;
  }

  const validTypes = ["fraud", "hidden_charges", "loan_abuse", "agent_misconduct"];
  if (!validTypes.includes(complaintType)) {
    res.status(400).json({ error: "complaintType must be one of: fraud, hidden_charges, loan_abuse, agent_misconduct" });
    return;
  }

  const validLangs = ["English", "Luganda", "Luo", "Runyankole", "Ateso", "Swahili"];
  if (!validLangs.includes(language)) {
    res.status(400).json({ error: "Invalid language" });
    return;
  }

  const complaint = {
    id: uuid(),
    name,
    phone,
    district,
    complaintType,
    language,
    message,
    status: "open" as const,
    timestamp: new Date().toISOString(),
  };

  complaints.push(complaint);
  res.status(201).json(complaint);
});

router.patch("/:id/resolve", authenticate, authorize("bou_analyst", "admin"), (req: Request, res: Response) => {
  const complaint = complaints.find(c => c.id === req.params.id);
  if (!complaint) {
    res.status(404).json({ error: "Complaint not found" });
    return;
  }

  complaint.status = "resolved";
  complaint.resolvedAt = new Date().toISOString();
  res.json(complaint);
});

export default router;
