"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireAuth = RequireAuth;
const supabase_js_1 = require("../lib/supabase.js");
const prisma_js_1 = __importDefault(require("../lib/prisma.js"));
async function RequireAuth(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
        return res.status(401).json({ error: "unauthorized" });
    try {
        const { data, error } = await supabase_js_1.supabase.auth.getUser(token);
        if (error || !data.user) {
            return res.status(401).json({ error: "Invalid token" });
        }
        const dbUser = await prisma_js_1.default.user.findUnique({
            where: { id: data.user.id },
        });
        if (!dbUser) {
            return res.status(401).json({ error: "User not found" });
        }
        req.user = {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            role: dbUser.role,
        };
        next();
    }
    catch (err) {
        return res.status(403).json({ error: "Verification failed" });
    }
}
//# sourceMappingURL=requireAuths.js.map