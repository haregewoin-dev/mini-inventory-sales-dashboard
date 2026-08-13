import { Router } from "express";
import { RequireAuth } from "../middleware/requireAuths";
import { requireRole } from "../middleware/reqRole";
import {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  ConflictError,
  ValidationError,
} from "../services/productservice";

const router = Router();

router.get("/", RequireAuth, async (_req, res) => {
  const products = await listProducts();
  res.json({ products });
});

router.get("/:id", RequireAuth, async (req, res) => {
     const { id } = req.params;
  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid product id" });
  }
  const product = await getProductById(id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json({ product });
});

router.post("/", RequireAuth, requireRole("ADMIN", "STAFF"), async (req, res) => {
  try {
    const product = await createProduct(req.body);
    res.status(201).json({ product });
  } catch (err) {
    if (err instanceof ConflictError) return res.status(409).json({ error: err.message });
    if (err instanceof ValidationError) return res.status(400).json({ error: err.message });
    throw err;
  }
});

router.patch("/:id", RequireAuth, requireRole("ADMIN", "STAFF"), async (req, res) => {
  
   const { id } = req.params;
  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid product id" });
  }
    try {
    const product = await updateProduct(id, req.body);
    res.json({ product });
  } catch (err) {
    if (err instanceof ConflictError) return res.status(409).json({ error: err.message });
    if (err instanceof ValidationError) return res.status(400).json({ error: err.message });
    throw err;
  }
});

router.delete("/:id", RequireAuth, requireRole("ADMIN"), async (req, res) => {
     const { id } = req.params;
  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid product id" });
  }
  await deleteProduct(id);
  res.status(204).send();
});

export default router;