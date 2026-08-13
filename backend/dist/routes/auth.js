"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_1 = require("../lib/supabase");
const prisma_1 = __importDefault(require("../lib/prisma"));
const requireAuths_1 = require("../middleware/requireAuths");
const reqRole_1 = require("../middleware/reqRole");
const router = (0, express_1.Router)();
router.post("/signup", requireAuths_1.RequireAuth, (0, reqRole_1.requireRole)("ADMIN"), async (req, res) => {
    const { email, name, password, role } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json({ error: "email, name and password required!" });
    }
    const assignedRole = role === "ADMIN" ? "ADMIN" : "STAFF";
    const { data, error } = await supabase_1.supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
    });
    if (error || !data.user) {
        return res.status(400).json({ error: error?.message ?? "signup failed" });
    }
    if (!data.user.email) {
        return res.status(400).json({ error: "Signup failed: no email returned" });
    }
    const dbUser = await prisma_1.default.user.create({
        data: {
            id: data.user.id,
            email: data.user.email,
            name,
            role: assignedRole,
        },
    });
    res.status(201).json({ user: dbUser });
});
router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
    }
    const { data, error } = await supabase_1.supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
        return res.status(401).json({ error: error?.message ?? "Invalid credentials" });
    }
    res.json({ session: data.session });
});
exports.default = router;
//# sourceMappingURL=auth.js.map