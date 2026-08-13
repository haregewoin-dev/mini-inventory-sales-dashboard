"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const requireAuths_1 = require("../middleware/requireAuths");
const activityLogService_1 = require("../services/activityLogService");
const router = (0, express_1.Router)();
router.get("/", requireAuths_1.RequireAuth, async (req, res) => {
    const logs = await (0, activityLogService_1.listActivityLogs)({
        userId: req.query.userId,
        from: req.query.from,
        to: req.query.to,
    });
    res.json({ logs });
});
exports.default = router;
//# sourceMappingURL=activityLogs.js.map