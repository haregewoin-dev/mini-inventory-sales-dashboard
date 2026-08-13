"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_js_1 = __importDefault(require("./routes/auth.js"));
const requireAuths_js_1 = require("./middleware/requireAuths.js");
const reqRole_js_1 = require("./middleware/reqRole.js");
const products_1 = __importDefault(require("./routes/products"));
const sales_1 = __importDefault(require("./routes/sales"));
const stockMovements_1 = __importDefault(require("./routes/stockMovements"));
const activityLogs_1 = __importDefault(require("./routes/activityLogs"));
const app = (0, express_1.default)();
const url = process.env.FRONTEND_URL;
app.use((0, cors_1.default)({
    origin: url,
    credentials: true
}));
app.use(express_1.default.json());
app.use("/api/auth", auth_js_1.default);
app.use("/api/products", products_1.default);
app.use("/api/sales", sales_1.default);
app.use("/api/stock-movements", stockMovements_1.default);
app.use("/api/activity-logs", activityLogs_1.default);
app.get("/api/me", requireAuths_js_1.RequireAuth, (req, res) => {
    res.json({ user: req.user });
});
app.get("/api/admin-only", requireAuths_js_1.RequireAuth, (0, reqRole_js_1.requireRole)("ADMIN"), (req, res) => {
    res.json({ message: `Welcome, ADMIN ${req.user?.email}` });
});
app.get("/api/staff-or-admin", requireAuths_js_1.RequireAuth, (0, reqRole_js_1.requireRole)("STAFF", "ADMIN"), (req, res) => {
    res.json({ message: `Hello ${req.user?.role} ${req.user?.email}` });
});
const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//# sourceMappingURL=index.js.map