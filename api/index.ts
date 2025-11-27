import fs from "node:fs";
import path from "node:path";
import express, { type Request, type Response } from "express";
import { registerRoutes } from "../server/routes";

const app = express();
let routesInitialized = false;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const requestPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (requestPath.startsWith("/api")) {
      let logLine = `${req.method} ${requestPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      console.log(logLine);
    }
  });

  next();
});

// Serve static files from dist/public
const publicPath = path.resolve(import.meta.dirname, "..", "dist", "public");

app.use(express.static(publicPath, {
  maxAge: "1d",
  etag: false,
  index: false,
}));

// API routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// SPA fallback - serve index.html for all non-API routes
app.use("*", (req, res) => {
  const indexPath = path.join(publicPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

// Error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("Error:", err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Initialize routes on first request
async function ensureRoutesInitialized() {
  if (!routesInitialized) {
    try {
      await registerRoutes(app);
      routesInitialized = true;
    } catch (error) {
      console.error("Failed to initialize routes:", error);
    }
  }
}

// Vercel serverless handler
export default async function handler(req: Request, res: Response) {
  await ensureRoutesInitialized();
  return app(req, res);
}
