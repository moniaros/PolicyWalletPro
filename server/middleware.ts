import type { Request, Response, NextFunction } from "express";
import { storage } from "./storage";

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
  user?: any;
}

// Simple JWT-like token handler (without external dependencies)
export function generateToken(userId: string, role: string): string {
  return Buffer.from(JSON.stringify({ userId, role, iat: Date.now() })).toString("base64");
}

export function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    return decoded;
  } catch {
    return null;
  }
}

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }

  const token = authHeader.slice(7);
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const user = await storage.getUser(decoded.userId);
  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  req.userId = decoded.userId;
  req.userRole = decoded.role || "customer";
  req.user = user;
  next();
}

export async function adminMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (req.userRole !== "admin" && req.userRole !== "adjuster") {
    return res.status(403).json({ error: "Insufficient permissions" });
  }
  next();
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Error:", err);
  
  if (err.name === "ZodError") {
    return res.status(400).json({ error: "Validation failed", details: err.errors });
  }

  if (err.message.includes("duplicate")) {
    return res.status(409).json({ error: "Resource already exists" });
  }

  return res.status(500).json({ error: "Internal server error" });
}

export async function auditLog(
  userId: string,
  action: string,
  resource: string,
  changes: any
) {
  // Log to storage for audit trail
  const timestamp = new Date().toISOString();
  console.log(`[AUDIT] ${timestamp} | User: ${userId} | Action: ${action} | Resource: ${resource}`);
  
  // In production, store in database
  await storage.logAuditEvent({
    userId,
    action,
    resource,
    changes,
    timestamp,
  });
}
