import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertHealthCheckupSchema, insertHealthMetricsSchema, insertPreventiveRecommendationSchema, insertUserSchema, insertUserProfileSchema } from "@shared/schema";
import { z } from "zod";
import { authMiddleware, errorHandler, adminMiddleware, type AuthRequest } from "./middleware";
import { login, register } from "./auth";
import { auditLog } from "./middleware";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }
      const user = await register(email, password);
      await auditLog("system", "user_registered", "users", { email });
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }
      const user = await login(email, password);
      await auditLog("system", "user_login", "users", { email });
      res.json(user);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  });

  app.get("/api/auth/me", authMiddleware, (req: AuthRequest, res) => {
    res.json({
      id: req.userId,
      username: req.user?.username,
      role: req.userRole,
    });
  });

  // User Profile - GET
  app.get("/api/profile/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const profile = await storage.getUserProfile(userId);
      res.json(profile || null);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  // User Profile - POST/Create
  app.post("/api/profile", async (req, res) => {
    try {
      const profile = await storage.createUserProfile(req.body);
      res.status(201).json(profile);
    } catch (error) {
      res.status(400).json({ error: "Failed to create profile" });
    }
  });

  // User Profile - PUT/Update
  app.put("/api/profile/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const profile = await storage.updateUserProfile(userId, req.body);
      res.json(profile);
    } catch (error) {
      res.status(400).json({ error: "Failed to update profile" });
    }
  });

  // Admin Stats - Protected by admin middleware
  app.get("/api/admin/stats", authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
    try {
      res.json({
        totalUsers: 2400,
        activePolicies: 1800,
        pendingClaims: 240,
        claimsApproved: "92%",
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Health Checkups - GET all checkups for user
  app.get("/api/health/checkups/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const checkups = await storage.getHealthCheckups(userId);
      res.json(checkups);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch checkups" });
    }
  });

  // Health Checkups - POST new checkup
  app.post("/api/health/checkups", async (req, res) => {
    try {
      const validated = insertHealthCheckupSchema.parse(req.body);
      const checkup = await storage.createHealthCheckup(validated);
      res.status(201).json(checkup);
    } catch (error) {
      res.status(400).json({ error: "Invalid checkup data" });
    }
  });

  // Health Metrics - GET metrics for a checkup
  app.get("/api/health/metrics/:checkupId", async (req, res) => {
    try {
      const { checkupId } = req.params;
      const metrics = await storage.getHealthMetrics(checkupId);
      res.json(metrics || {});
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch metrics" });
    }
  });

  // Health Metrics - POST new metrics
  app.post("/api/health/metrics", async (req, res) => {
    try {
      const validated = insertHealthMetricsSchema.parse(req.body);
      const metrics = await storage.createHealthMetrics(validated);
      res.status(201).json(metrics);
    } catch (error) {
      res.status(400).json({ error: "Invalid metrics data" });
    }
  });

  // Risk Assessment - GET latest for user
  app.get("/api/health/risk-assessment/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const assessment = await storage.getRiskAssessment(userId);
      
      if (!assessment) {
        // Generate default assessment based on age
        const defaultRisk = {
          riskScore: 45,
          riskLevel: "Moderate",
          healthFactors: { age: 45, bmi: 25, conditions: [] },
          recommendations: [
            "Schedule annual health screening",
            "Monitor blood pressure regularly",
            "Maintain consistent exercise routine"
          ],
          nextCheckupDue: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        };
        return res.json(defaultRisk);
      }
      
      res.json(assessment);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch risk assessment" });
    }
  });

  // Risk Assessment - POST calculate risk
  app.post("/api/health/risk-assessment", async (req, res) => {
    try {
      const { userId, healthFactors } = req.body;
      
      // Calculate risk score based on health factors (simplified ACORD-compliant model)
      let riskScore = 20; // Base score
      
      if (healthFactors.age >= 65) riskScore += 25;
      else if (healthFactors.age >= 50) riskScore += 15;
      else if (healthFactors.age >= 40) riskScore += 5;
      
      if (healthFactors.bmi > 30) riskScore += 20;
      else if (healthFactors.bmi > 25) riskScore += 10;
      
      if (healthFactors.conditions && healthFactors.conditions.length > 0) {
        riskScore += healthFactors.conditions.length * 10;
      }
      
      riskScore = Math.min(riskScore, 100);
      
      const riskLevel = riskScore >= 70 ? "High" : riskScore >= 50 ? "Moderate" : "Low";
      
      const assessment = await storage.createRiskAssessment({
        userId,
        riskScore,
        riskLevel,
        healthFactors,
        recommendations: generateRecommendations(riskScore, healthFactors),
        nextCheckupDue: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      });
      
      res.status(201).json(assessment);
    } catch (error) {
      res.status(400).json({ error: "Failed to calculate risk" });
    }
  });

  // Preventive Recommendations - GET active recommendations
  app.get("/api/health/recommendations/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const recommendations = await storage.getPreventiveRecommendations(userId);
      
      if (recommendations.length === 0) {
        // Generate default recommendations
        const defaults = [
          {
            userId,
            category: "Screening",
            title: "Annual Health Checkup",
            description: "Schedule your yearly comprehensive health screening to monitor vital health indicators.",
            priority: "High",
            coverageStatus: "Covered"
          },
          {
            userId,
            category: "Preventive",
            title: "Blood Pressure Monitoring",
            description: "Regular blood pressure checks help detect hypertension early.",
            priority: "High",
            coverageStatus: "Covered"
          },
          {
            userId,
            category: "Lifestyle",
            title: "Fitness & Exercise Program",
            description: "Engage in 150 minutes of moderate aerobic activity per week.",
            priority: "Medium",
            coverageStatus: "Partially Covered"
          }
        ];
        
        const created = await Promise.all(
          defaults.map(d => storage.createPreventiveRecommendation(d))
        );
        return res.json(created);
      }
      
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recommendations" });
    }
  });

  // Preventive Recommendations - POST new recommendation
  app.post("/api/health/recommendations", async (req, res) => {
    try {
      const validated = insertPreventiveRecommendationSchema.parse(req.body);
      const recommendation = await storage.createPreventiveRecommendation(validated);
      res.status(201).json(recommendation);
    } catch (error) {
      res.status(400).json({ error: "Invalid recommendation data" });
    }
  });

  // Mark recommendation as completed
  app.patch("/api/health/recommendations/:id/complete", async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await storage.updateRecommendation(id, true);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update recommendation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function generateRecommendations(riskScore: number, healthFactors: any): string[] {
  const recs: string[] = [];
  
  if (riskScore >= 70) {
    recs.push("Schedule quarterly health assessments");
    recs.push("Consult with healthcare provider immediately");
  } else if (riskScore >= 50) {
    recs.push("Schedule semi-annual health screening");
    recs.push("Monitor key health metrics monthly");
  } else {
    recs.push("Schedule annual health checkup");
  }
  
  if (healthFactors.bmi > 30) {
    recs.push("Consult nutritionist for weight management plan");
  }
  
  if (healthFactors.age >= 50) {
    recs.push("Screening tests appropriate for your age group");
  }
  
  if (healthFactors.conditions && healthFactors.conditions.includes("diabetes")) {
    recs.push("Regular glucose monitoring and specialist visits");
  }
  
  return recs;
}
