import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertHealthCheckupSchema, insertHealthMetricsSchema, insertPreventiveRecommendationSchema, insertUserSchema, insertUserProfileSchema, insertStravaConnectionSchema, insertDailyWellnessLogSchema } from "@shared/schema";
import { z } from "zod";
import { authMiddleware, errorHandler, adminMiddleware, type AuthRequest } from "./middleware";
import { login, register } from "./auth";
import { auditLog } from "./middleware";
import { GoogleGenAI } from "@google/genai";

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

  // Strava Connection Routes
  app.get("/api/strava/connection/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const connection = await storage.getStravaConnection(userId);
      res.json(connection || { connected: false });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Strava connection" });
    }
  });

  app.post("/api/strava/connect", async (req, res) => {
    try {
      const { userId, athleteId, athleteName, athleteProfile } = req.body;
      
      const connection = await storage.createStravaConnection({
        userId,
        stravaAthleteId: athleteId,
        athleteName,
        athleteProfile,
        connected: true,
        accessToken: null,
        refreshToken: null,
        expiresAt: null,
      });
      
      res.status(201).json(connection);
    } catch (error) {
      res.status(400).json({ error: "Failed to create Strava connection" });
    }
  });

  app.delete("/api/strava/connection/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      await storage.deleteStravaConnection(userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to disconnect Strava" });
    }
  });

  // Daily Wellness Log Routes
  app.get("/api/wellness/daily/:userId/:date", async (req, res) => {
    try {
      const { userId, date } = req.params;
      const log = await storage.getDailyWellnessLog(userId, date);
      
      if (!log) {
        return res.json({
          userId,
          date,
          steps: 0,
          stepsGoal: 10000,
          waterGlasses: 0,
          waterGoal: 8,
          sleepHours: "0",
          sleepGoal: "8",
          calories: 0,
          caloriesGoal: 2000,
          activeMinutes: 0,
          activeMinutesGoal: 30,
        });
      }
      
      res.json(log);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch wellness log" });
    }
  });

  app.get("/api/wellness/history/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const { startDate, endDate } = req.query;
      
      const logs = await storage.getDailyWellnessLogs(
        userId, 
        startDate as string || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate as string || new Date().toISOString().split('T')[0]
      );
      
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch wellness history" });
    }
  });

  app.post("/api/wellness/daily", async (req, res) => {
    try {
      const log = await storage.createDailyWellnessLog(req.body);
      res.status(201).json(log);
    } catch (error) {
      res.status(400).json({ error: "Failed to create wellness log" });
    }
  });

  app.patch("/api/wellness/daily/:userId/:date", async (req, res) => {
    try {
      const { userId, date } = req.params;
      const log = await storage.updateDailyWellnessLog(userId, date, req.body);
      res.json(log);
    } catch (error) {
      res.status(500).json({ error: "Failed to update wellness log" });
    }
  });

  // Policy Document Parsing with Gemini AI
  app.post("/api/policies/parse-document", async (req, res) => {
    try {
      const { documentContent, documentType, insurerId, policyType } = req.body;
      
      if (!documentContent) {
        return res.status(400).json({ error: "Document content is required" });
      }

      // Initialize Gemini AI using Replit's AI integration
      const baseUrl = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;
      const apiKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY;

      if (!baseUrl || !apiKey) {
        return res.status(500).json({ error: "Gemini AI integration not configured" });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { baseUrl },
      });

      const prompt = `You are an expert Greek insurance document parser. Analyze this insurance policy document and extract the following information in JSON format:

{
  "policyNumber": "the policy number/ID",
  "policyName": "name of the policy product",
  "startDate": "YYYY-MM-DD format",
  "endDate": "YYYY-MM-DD format",
  "premium": "annual premium amount in EUR (just the number)",
  "premiumFrequency": "monthly|quarterly|annual",
  "coverageAmount": "total coverage amount in EUR (just the number)",
  "deductible": "deductible amount in EUR (just the number)",
  "holderName": "policyholder full name",
  "holderAfm": "9-digit Greek tax ID (ΑΦΜ)",
  "holderAddress": "full address",
  "holderPhone": "phone number with country code",
  "holderEmail": "email address",
  "vehicleMake": "for auto insurance - car manufacturer",
  "vehicleModel": "for auto insurance - car model",
  "vehiclePlate": "for auto insurance - license plate",
  "propertyAddress": "for home insurance - property address",
  "propertySqm": "for home insurance - square meters"
}

Only include fields that are present in the document. Return valid JSON only.

Document type: ${policyType || 'general'}
Insurer: ${insurerId || 'unknown'}

Document content:
${documentContent}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      // Parse the response
      const text = response.text || "";
      let parsedData = {};
      
      try {
        // Try to extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedData = JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.error("Failed to parse Gemini response:", parseError);
      }

      res.json({
        success: true,
        parsedData,
        rawResponse: text,
      });
    } catch (error: any) {
      console.error("Document parsing error:", error);
      res.status(500).json({ 
        error: "Failed to parse document", 
        details: error.message 
      });
    }
  });

  // Search for policy in insurer database (simulated)
  app.get("/api/policies/search/:insurerId/:policyNumber", async (req, res) => {
    try {
      const { insurerId, policyNumber } = req.params;

      // In a real implementation, this would query the insurer's API or database
      // For now, simulate a search with mock data
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate found policy (in production, this would be from actual insurer DB)
      if (policyNumber && policyNumber.length >= 5) {
        res.json({
          found: true,
          policy: {
            policyNumber,
            insurerId,
            policyName: "Standard Coverage Plan",
            startDate: "2024-01-01",
            endDate: "2024-12-31",
            premium: "1200",
            premiumFrequency: "annual",
            coverageAmount: "100000",
            deductible: "500",
          }
        });
      } else {
        res.json({
          found: false,
          message: "Policy not found in insurer database"
        });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to search for policy" });
    }
  });

  // Create new policy
  app.post("/api/policies", async (req, res) => {
    try {
      const policyData = req.body;
      
      // Validate required fields
      if (!policyData.policyNumber || !policyData.insurerId || !policyData.policyType) {
        return res.status(400).json({ error: "Missing required policy fields" });
      }

      // In a real implementation, save to database
      // For now, return the policy data with an ID
      const newPolicy = {
        id: `policy-${Date.now()}`,
        ...policyData,
        createdAt: new Date().toISOString(),
        status: "active",
      };

      res.status(201).json(newPolicy);
    } catch (error) {
      res.status(400).json({ error: "Failed to create policy" });
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
