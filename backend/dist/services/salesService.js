"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.InsufficientStockError = void 0;
exports.recordSale = recordSale;
exports.listSales = listSales;
exports.getBestSellers = getBestSellers;
exports.getDailyTotals = getDailyTotals;
const prisma_1 = __importDefault(require("../lib/prisma"));
class InsufficientStockError extends Error {
}
exports.InsufficientStockError = InsufficientStockError;
class NotFoundError extends Error {
}
exports.NotFoundError = NotFoundError;
async function recordSale(data) {
    if (data.quantity <= 0) {
        throw new Error("Quantity must be greater than 0");
    }
    return prisma_1.default.$transaction(async (tx) => {
        const product = await tx.product.findUnique({ where: { id: data.product_id } });
        if (!product)
            throw new NotFoundError("Product not found");
        if (product.quantity < data.quantity) {
            throw new InsufficientStockError(`Only ${product.quantity} units of "${product.name}" available`);
        }
        const totalAmount = Number(product.price) * data.quantity;
        const sale = await tx.sale.create({
            data: {
                product_id: data.product_id,
                user_id: data.user_id,
                quantity: data.quantity,
                sale_price: product.price,
                total_amount: totalAmount,
            },
        });
        await tx.product.update({
            where: { id: data.product_id },
            data: { quantity: { decrement: data.quantity } },
        });
        await tx.stockMovement.create({
            data: {
                product_id: data.product_id,
                user_id: data.user_id,
                change_type: "SALE",
                quantity_change: -data.quantity,
                note: `Sale #${sale.id}`,
            },
        });
        return sale;
    });
}
async function listSales() {
    return prisma_1.default.sale.findMany({
        orderBy: { sale_date: "desc" },
        include: { product: { select: { name: true, sku: true } }, user: { select: { name: true } } },
    });
}
async function getBestSellers(limit = 5) {
    const result = await prisma_1.default.sale.groupBy({
        by: ["product_id"],
        _sum: { quantity: true, total_amount: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: limit,
    });
    const productIds = result.map((r) => r.product_id);
    const products = await prisma_1.default.product.findMany({ where: { id: { in: productIds } } });
    const productMap = new Map(products.map((p) => [p.id, p]));
    return result.map((r) => ({
        product: productMap.get(r.product_id),
        totalQuantitySold: r._sum.quantity ?? 0,
        totalRevenue: r._sum.total_amount ?? 0,
    }));
}
async function getDailyTotals(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sales = await prisma_1.default.sale.findMany({
        where: { sale_date: { gte: since } },
        select: { sale_date: true, total_amount: true },
    });
    const byDay = new Map();
    for (const sale of sales) {
        const day = sale.sale_date.toISOString().slice(0, 10);
        byDay.set(day, (byDay.get(day) ?? 0) + Number(sale.total_amount));
    }
    return Array.from(byDay.entries())
        .map(([date, total]) => ({ date, total }))
        .sort((a, b) => a.date.localeCompare(b.date));
}
//# sourceMappingURL=salesService.js.map