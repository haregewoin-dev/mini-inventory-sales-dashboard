import dotenv from "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import { RequireAuth } from "./middleware/requireAuths.js";
import { requireRole } from "./middleware/reqRole.js";

const app = express();
const url = process.env.FRONTEND_URL;

app.use(cors({
  origin: url,
  credentials: true
})
)
app.use(express.json());

app.use("/api/auth", authRoutes);


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