import { Router } from "express";
import { RequireAuth } from "@/middleware/requireAuths";
import { listActivityLogs } from "../services/activityLogService";


const router = Router();

router.get("/", RequireAuth, async (req, res) => {
  const logs = await listActivityLogs({
    userId: req.query.userId as string | undefined,
    from: req.query.from as string | undefined,
    to: req.query.to as string | undefined,
  });
  res.json({ logs });
});

export default router;