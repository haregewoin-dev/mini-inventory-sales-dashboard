import prisma from "../lib/prisma";

export async function listActivityLogs(filters: { userId?: string; from?: string; to?: string }) {
  return prisma.activityLog.findMany({
    where: {
      user_id: filters.userId || undefined,
      created_at: {
        gte: filters.from ? new Date(filters.from) : undefined,
        lte: filters.to ? new Date(filters.to) : undefined,
      },
    },
    orderBy: { created_at: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });
}