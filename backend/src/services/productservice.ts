import prisma from "../lib/prisma";
import type { Prisma } from "@prisma/client";

export async function listProducts() {
  return prisma.product.findMany({ orderBy: { created_at: "desc" } });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({ where: { id } });
}

export async function createProduct(data: {
  name: string;
  sku: string;
  category?: string;
  price: number;
  quantity: number;
  supplier?: string;
}) {
  const normalizedSku = data.sku.toUpperCase();

  const existing = await prisma.product.findFirst({
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

  return prisma.product.create({
    data: { ...data, sku: normalizedSku },
  });
}

export async function updateProduct(
  id: string,
  data: Partial<{
    name: string;
    sku: string;
    category: string;
    price: number;
    quantity: number;
    supplier: string;
  }>
) {
  if (data.quantity !== undefined && data.quantity < 0) {
    throw new ValidationError("Quantity cannot be negative");
  }
  if (data.price !== undefined && data.price <= 0) {
    throw new ValidationError("Price must be greater than 0");
  }

  if (data.sku) {
    const normalizedSku = data.sku.toUpperCase();
    const existing = await prisma.product.findFirst({
      where: { sku: { equals: normalizedSku, mode: "insensitive" }, NOT: { id } },
    });
    if (existing) {
      throw new ConflictError(`SKU "${data.sku}" already exists`);
    }
    data.sku = normalizedSku;
  }

  return prisma.product.update({ where: { id }, data });
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}

export class ConflictError extends Error {}
export class ValidationError extends Error {}