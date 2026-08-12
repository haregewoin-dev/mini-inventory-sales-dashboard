import { Router } from "express";
import { RequireAuth } from "@/middleware/requireAuths";
import {
  recordSale,
  listSales,
  getBestSellers,
  getDailyTotals,
  InsufficientStockError,
  NotFoundError,
} from "../services/salesService";

const router = Router();

router.get("/", RequireAuth, async (_req, res) => {
  const sales = await listSales();
  res.json({ sales });
});

router.post("/", RequireAuth, async (req, res) => {
  try {
    const sale = await recordSale({
      product_id: req.body.product_id,
      user_id: req.user!.id,
      quantity: Number(req.body.quantity),
    });
    res.status(201).json({ sale });
  } catch (err) {
    if (err instanceof InsufficientStockError) return res.status(409).json({ error: err.message });
    if (err instanceof NotFoundError) return res.status(404).json({ error: err.message });
    if (err instanceof Error) return res.status(400).json({ error: err.message });
    throw err;
  }
});

router.get("/analytics/best-sellers", RequireAuth, async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : 5;
  const bestSellers = await getBestSellers(limit);
  res.json({ bestSellers });
});

router.get("/analytics/daily-totals", RequireAuth, async (req, res) => {
  const days = req.query.days ? Number(req.query.days) : 30;
  const dailyTotals = await getDailyTotals(days);
  res.json({ dailyTotals });
});

export default router;