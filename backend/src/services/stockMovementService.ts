import prisma from "@/lib/prisma";
import type { StockChangeType } from "@prisma/client";

const VALID_TYPES: StockChangeType[] = ["RESTOCK", "SALE", "ADJUSTMENT"];
export class ValidationError extends Error {}
export class NotFoundError extends Error {}

export async function listStockMovements(filters: {
  productId?: string;
  type?: string;
  from?: string;
  to?: string;
}) {
    return prisma.stockMovement.findMany({
    where: {
      product_id: filters.productId || undefined,
      change_type: (filters.type as StockChangeType) || undefined,
      created_at: {
        gte: filters.from ? new Date(filters.from) : undefined,
        lte: filters.to ? new Date(filters.to) : undefined,
      },
    },
    orderBy: { created_at: "desc" },
    include: {
      product: { select: { name: true, sku: true } },
      user: { select: { name: true } },
    },
  });
}


export async function createManualMovement(data: {
  product_id: string;
  user_id: string;
  change_type: string;
  quantity_change: number;
  note?: string;
}) {
    if (!VALID_TYPES.includes(data.change_type as StockChangeType)) {
    throw new ValidationError(`Invalid change_type. Must be one of: ${VALID_TYPES.join(", ")}`);
  }
  if (data.change_type === "SALE") {
    throw new ValidationError("SALE movements are created automatically by the Sales API, not manually");
  }
  if (data.quantity_change === 0) {
    throw new ValidationError("quantity_change cannot be zero");
  }
  // RESTOCK should increase stock, ADJUSTMENT/DAMAGE-style corrections can go either way
  if (data.change_type === "RESTOCK" && data.quantity_change < 0) {
    throw new ValidationError("RESTOCK must have a positive quantity_change");
  }
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id: data.product_id } });
    if (!product) throw new NotFoundError("Product not found");

    const newQuantity = product.quantity + data.quantity_change;
    if (newQuantity < 0) {
      throw new ValidationError("Resulting quantity cannot be negative");
    }
    const movement = await tx.stockMovement.create({
      data: {
        product_id: data.product_id,
        user_id: data.user_id,
        change_type: data.change_type as StockChangeType,
        quantity_change: data.quantity_change,
        note: data.note,
      },
    });
    await tx.product.update({
      where: { id: data.product_id },
      data: { quantity: newQuantity },
    });

    await tx.activityLog.create({
      data: {
        user_id: data.user_id,
        action: "STOCK_MOVEMENT_CREATED",
        metadata: { movement_id: movement.id, product_id: data.product_id, change: data.quantity_change },
      },
    });

    return movement;
  });

}

