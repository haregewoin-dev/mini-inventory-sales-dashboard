"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const requireAuths_1 = require("../middleware/requireAuths");
const stockMovementService_1 = require("../services/stockMovementService");
const router = (0, express_1.Router)();
router.get("/", requireAuths_1.RequireAuth, async (req, res) => {
    const movements = await (0, stockMovementService_1.listStockMovements)({
        productId: req.query.productId,
        type: req.query.type,
        from: req.query.from,
        to: req.query.to,
    });
    res.json({ movements });
});
router.post("/", requireAuths_1.RequireAuth, async (req, res) => {
    try {
        const movement = await (0, stockMovementService_1.createManualMovement)({
            product_id: req.body.product_id,
            user_id: req.user.id,
            change_type: req.body.change_type,
            quantity_change: Number(req.body.quantity_change),
            note: req.body.note,
        });
        res.status(201).json({ movement });
    }
    catch (err) {
        if (err instanceof stockMovementService_1.ValidationError)
            return res.status(400).json({ error: err.message });
        if (err instanceof stockMovementService_1.NotFoundError)
            return res.status(404).json({ error: err.message });
        throw err;
    }
});
exports.default = router;
//# sourceMappingURL=stockMovements.js.map