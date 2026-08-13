import { Router } from "express";
import { RequireAuth } from "../middleware/requireAuths";
import { requireRole } from "../middleware/reqRole";
import {
  listStockMovements,
  createManualMovement,
  ValidationError,
  NotFoundError,
} from "../services/stockMovementService";


const router = Router();

router.get("/", RequireAuth, async (req, res) => {
  const movements = await listStockMovements({
    productId: req.query.productId as string | undefined,
    type: req.query.type as string | undefined,
    from: req.query.from as string | undefined,
    to: req.query.to as string | undefined,
  });
  res.json({ movements });
});

router.post("/", RequireAuth, async (req, res) => {
  try {
    const movement = await createManualMovement({
      product_id: req.body.product_id,
      user_id: req.user!.id,
      change_type: req.body.change_type,
      quantity_change: Number(req.body.quantity_change),
      note: req.body.note,
    });
    res.status(201).json({ movement });
  } catch (err) {
    if (err instanceof ValidationError) return res.status(400).json({ error: err.message });
    if (err instanceof NotFoundError) return res.status(404).json({ error: err.message });
    throw err;
  }
});

export default router;