"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listActivityLogs = listActivityLogs;
const prisma_1 = __importDefault(require("../lib/prisma"));
async function listActivityLogs(filters) {
    return prisma_1.default.activityLog.findMany({
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
//# sourceMappingURL=activityLogService.js.map