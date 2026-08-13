"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = exports.ConflictError = void 0;
exports.listProducts = listProducts;
exports.getProductById = getProductById;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
const prisma_1 = __importDefault(require("../lib/prisma"));
async function listProducts() {
    return prisma_1.default.product.findMany({ orderBy: { created_at: "desc" } });
}
async function getProductById(id) {
    return prisma_1.default.product.findUnique({ where: { id } });
}
async function createProduct(data) {
    const normalizedSku = data.sku.toUpperCase();
    const existing = await prisma_1.default.product.findFirst({
        where: { sku: { equals: normalizedSku, mode: "insensitive" } },
    });
    if (existing) {
        throw new ConflictError(`SKU "${data.sku}" already exists`);
    }
    if (data.quantity < 0) {
        throw new ValidationError("Quantity cannot be negative");
    }
    if (data.price <= 0) {
        throw new ValidationError("Price must be greater than 0");
    }
    return prisma_1.default.product.create({
        data: { ...data, sku: normalizedSku },
    });
}
async function updateProduct(id, data) {
    if (data.quantity !== undefined && data.quantity < 0) {
        throw new ValidationError("Quantity cannot be negative");
    }
    if (data.price !== undefined && data.price <= 0) {
        throw new ValidationError("Price must be greater than 0");
    }
    if (data.sku) {
        const normalizedSku = data.sku.toUpperCase();
        const existing = await prisma_1.default.product.findFirst({
            where: { sku: { equals: normalizedSku, mode: "insensitive" }, NOT: { id } },
        });
        if (existing) {
            throw new ConflictError(`SKU "${data.sku}" already exists`);
        }
        data.sku = normalizedSku;
    }
    return prisma_1.default.product.update({ where: { id }, data });
}
async function deleteProduct(id) {
    return prisma_1.default.product.delete({ where: { id } });
}
class ConflictError extends Error {
}
exports.ConflictError = ConflictError;
class ValidationError extends Error {
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=productservice.js.map