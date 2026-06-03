import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET, AuthUser } from "../middleware/auth";
import { users } from "../data/mockData";

const router = Router();

router.post("/login", (req: Request, res: Response) => {
  const { phone, pin } = req.body;

  if (!phone || !pin) {
    res.status(400).json({ error: "Phone and pin are required" });
    return;
  }

  const demoAccounts: Record<string, AuthUser> = {
    "+256700000001": { id: "admin-001", phone: "+256700000001", name: "Bank of Uganda Admin", role: "admin", district: "Kampala" },
    "+256700000002": { id: "citizen-001", phone: "+256700000002", name: "Citizen Demo", role: "citizen", district: "Wakiso" },
    "+256700000003": { id: "farmer-001", phone: "+256700000003", name: "Farmer Demo", role: "farmer", district: "Mbale" },
    "+256700000004": { id: "sme-001", phone: "+256700000004", name: "SME Owner Demo", role: "sme", district: "Mbarara" },
  };

  if (demoAccounts[phone] && pin === "1234") {
    const authUser = demoAccounts[phone];
    const token = jwt.sign(authUser, JWT_SECRET, { expiresIn: "24h" });
    res.json({ token, user: authUser, role: authUser.role });
    return;
  }

  if (pin !== "1234") {
    res.status(401).json({ error: "Invalid phone number or PIN" });
    return;
  }

  const user = users.find(u => u.phone === phone);
  if (!user) {
    res.status(401).json({ error: "Invalid phone number or PIN" });
    return;
  }

  const authUser: AuthUser = {
    id: user.id,
    phone: user.phone,
    name: user.name,
    role: user.role,
    district: user.district,
  };

  const token = jwt.sign(authUser, JWT_SECRET, { expiresIn: "24h" });
  res.json({ token, user: authUser, role: user.role });
});

export default router;
