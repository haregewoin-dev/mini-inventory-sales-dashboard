"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const requireAuths_1 = require("../middleware/requireAuths");
const salesService_1 = require("../services/salesService");
const router = (0, express_1.Router)();
router.get("/", requireAuths_1.RequireAuth, async (_req, res) => {
    const sales = await (0, salesService_1.listSales)();
    res.json({ sales });
});
router.post("/", requireAuths_1.RequireAuth, async (req, res) => {
    try {
        const sale = await (0, salesService_1.recordSale)({
            product_id: req.body.product_id,
            user_id: req.user.id,
            quantity: Number(req.body.quantity),
        });
        res.status(201).json({ sale });
    }
    catch (err) {
        if (err instanceof salesService_1.InsufficientStockError)
            return res.status(409).json({ error: err.message });
        if (err instanceof salesService_1.NotFoundError)
            return res.status(404).json({ error: err.message });
        if (err instanceof Error)
            return res.status(400).json({ error: err.message });
        throw err;
    }
});
router.get("/analytics/best-sellers", requireAuths_1.RequireAuth, async (req, res) => {
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const bestSellers = await (0, salesService_1.getBestSellers)(limit);
    res.json({ bestSellers });
});
router.get("/analytics/daily-totals", requireAuths_1.RequireAuth, async (req, res) => {
    const days = req.query.days ? Number(req.query.days) : 30;
    const dailyTotals = await (0, salesService_1.getDailyTotals)(days);
    res.json({ dailyTotals });
});
exports.default = router;
//# sourceMappingURL=sales.js.map