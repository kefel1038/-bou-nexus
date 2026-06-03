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

  if (phone === "+256700000001" && pin === "1234") {
    const adminUser: AuthUser = {
      id: "admin-001",
      phone: "+256700000001",
      name: "Bank of Uganda Admin",
      role: "admin",
      district: "Kampala",
    };
    const token = jwt.sign(adminUser, JWT_SECRET, { expiresIn: "24h" });
    res.json({ token, user: adminUser, role: "admin" });
    return;
  }

  const user = users.find(u => u.phone === phone);
  if (!user) {
    res.status(401).json({ error: "Invalid phone number or PIN" });
    return;
  }

  if (pin !== "1234") {
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
