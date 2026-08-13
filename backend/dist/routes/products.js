"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const requireAuths_1 = require("../middleware/requireAuths");
const reqRole_1 = require("../middleware/reqRole");
const productservice_1 = require("../services/productservice");
const router = (0, express_1.Router)();
router.get("/", requireAuths_1.RequireAuth, async (_req, res) => {
    const products = await (0, productservice_1.listProducts)();
    res.json({ products });
});
router.get("/:id", requireAuths_1.RequireAuth, async (req, res) => {
    const { id } = req.params;
    if (typeof id !== "string") {
        return res.status(400).json({ error: "Invalid product id" });
    }
    const product = await (0, productservice_1.getProductById)(id);
    if (!product)
        return res.status(404).json({ error: "Product not found" });
    res.json({ product });
});
router.post("/", requireAuths_1.RequireAuth, (0, reqRole_1.requireRole)("ADMIN", "STAFF"), async (req, res) => {
    try {
        const product = await (0, productservice_1.createProduct)(req.body);
        res.status(201).json({ product });
    }
    catch (err) {
        if (err instanceof productservice_1.ConflictError)
            return res.status(409).json({ error: err.message });
        if (err instanceof productservice_1.ValidationError)
            return res.status(400).json({ error: err.message });
        throw err;
    }
});
router.patch("/:id", requireAuths_1.RequireAuth, (0, reqRole_1.requireRole)("ADMIN", "STAFF"), async (req, res) => {
    const { id } = req.params;
    if (typeof id !== "string") {
        return res.status(400).json({ error: "Invalid product id" });
    }
    try {
        const product = await (0, productservice_1.updateProduct)(id, req.body);
        res.json({ product });
    }
    catch (err) {
        if (err instanceof productservice_1.ConflictError)
            return res.status(409).json({ error: err.message });
        if (err instanceof productservice_1.ValidationError)
            return res.status(400).json({ error: err.message });
        throw err;
    }
});
router.delete("/:id", requireAuths_1.RequireAuth, (0, reqRole_1.requireRole)("ADMIN"), async (req, res) => {
    const { id } = req.params;
    if (typeof id !== "string") {
        return res.status(400).json({ error: "Invalid product id" });
    }
    await (0, productservice_1.deleteProduct)(id);
    res.status(204).send();
});
exports.default = router;
//# sourceMappingURL=products.js.map