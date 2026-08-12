import dotenv from "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import { RequireAuth } from "./middleware/requireAuths.js";
import { requireRole } from "./middleware/reqRole.js";
import productRoutes from "./routes/products";
import salesRoute from "./routes/sales"
import stockMovementRoutes from "./routes/stockMovements";
import activityLogRoutes from "./routes/activityLogs";


const app = express();
const url = process.env.FRONTEND_URL;

app.use(cors({
  origin: url,
  credentials: true
})
)
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", salesRoute)
app.use("/api/stock-movements", stockMovementRoutes);
app.use("/api/activity-logs", activityLogRoutes);


app.get("/api/me", RequireAuth, (req, res) => {
  res.json({ user: req.user });
});


app.get("/api/admin-only", RequireAuth, requireRole("ADMIN"), (req, res) => {
  res.json({ message: `Welcome, ADMIN ${req.user?.email}` });
});

app.get("/api/staff-or-admin", RequireAuth, requireRole("STAFF", "ADMIN"), (req, res) => {
  res.json({ message: `Hello ${req.user?.role} ${req.user?.email}` });
});



const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));