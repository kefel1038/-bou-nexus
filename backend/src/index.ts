import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import { savingsRouter, investmentRouter } from "./routes/savings";
import creditRoutes from "./routes/credit";
import complaintsRoutes from "./routes/complaints";
import fraudRoutes from "./routes/fraud";
import analyticsRoutes from "./routes/analytics";
import smeRoutes from "./routes/sme";
import fxRoutes from "./routes/fx";
import escrowRoutes from "./routes/escrow";
import inclusionRoutes from "./routes/inclusion";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "BoU Nexus API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/savings", savingsRouter);
app.use("/api/investments", investmentRouter);
app.use("/api/credit-score", creditRoutes);
app.use("/api/credit-scores", creditRoutes);
app.use("/api/complaints", complaintsRoutes);
app.use("/api/fraud-alerts", fraudRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/sme", smeRoutes);
app.use("/api/fx", fxRoutes);
app.use("/api/escrow", escrowRoutes);
app.use("/api/inclusion-map", inclusionRoutes);

app.listen(PORT, () => {
  console.log(`BoU Nexus API running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

export default app;
