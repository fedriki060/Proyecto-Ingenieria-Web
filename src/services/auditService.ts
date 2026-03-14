import type { AuditLog } from "../types";
import { AuditAction } from "../types";
import { seedAuditLogs } from "../data/seed";

let auditLogs = [...seedAuditLogs];

export function getAuditLogs(): AuditLog[] {
  return [...auditLogs];
}

export function getAuditLogsByUser(userId: number): AuditLog[] {
  return auditLogs.filter((log) => log.userId === userId);
}

export function getAuditLogsByAction(action: AuditAction): AuditLog[] {
  return auditLogs.filter((log) => log.action === action);
}

export function getAuditLogsByEntity(entityType: string, entityId: number): AuditLog[] {
  return auditLogs.filter((log) => log.entityType === entityType && log.entityId === entityId);
}

export function logAuditEvent(
  userId: number,
  action: AuditAction,
  entityType: "RESERVATION" | "SPACE" | "USER",
  entityId: number,
  changes?: Record<string, any>
): AuditLog {
  const log: AuditLog = {
    id: Math.max(...auditLogs.map((l) => l.id), 0) + 1,
    userId,
    action,
    entityType,
    entityId,
    changes,
    timestamp: new Date(),
  };

  auditLogs.push(log);
  return log;
}

export function getRecentAuditLogs(limit: number = 50): AuditLog[] {
  return auditLogs.slice(-limit);
}