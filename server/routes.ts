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

  // Policy Document Parsing with Gemini AI - Enhanced comprehensive extraction
  app.post("/api/policies/parse-document", async (req, res) => {
    try {
      const { documentContent, documentBase64, documentType, mimeType, insurerId, policyType } = req.body;
      
      if (!documentContent && !documentBase64) {
        return res.status(400).json({ error: "Document content or base64 data is required" });
      }

      const allowedMimeTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'text/plain',
      ];
      
      if (mimeType && !allowedMimeTypes.includes(mimeType)) {
        return res.status(400).json({ error: "Unsupported file type. Please upload PDF, JPEG, PNG, or text file." });
      }

      const maxBase64Size = 10 * 1024 * 1024;
      if (documentBase64 && documentBase64.length > maxBase64Size) {
        return res.status(413).json({ error: "Document too large. Maximum file size is 10MB." });
      }

      if (documentContent && documentContent.length > 5 * 1024 * 1024) {
        return res.status(413).json({ error: "Text content too large. Maximum size is 5MB." });
      }

      const apiKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY;

      if (!apiKey || apiKey === '_DUMMY_API_KEY_') {
        return res.status(500).json({ error: "Gemini AI integration not configured. Please set up your Google AI API key in settings." });
      }

      const ai = new GoogleGenAI({
        apiKey,
      });

      const comprehensivePrompt = `You are an expert Greek/European insurance document parser specializing in ACORD standards. 
Analyze this insurance policy document thoroughly and extract ALL available information in the following JSON structure.
For Greek documents, look for ΑΦΜ (tax ID), ΑΜΚΑ (social security), and other Greek-specific identifiers.

Return ONLY valid JSON (no markdown, no explanation):

{
  "policy": {
    "policyNumber": "string - policy number/ID",
    "policyName": "string - product name",
    "policyType": "health|auto|home|life|travel|business|pet",
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD",
    "premium": "number - annual premium in EUR",
    "premiumFrequency": "monthly|quarterly|semi-annual|annual",
    "totalCoverage": "number - total coverage amount",
    "deductible": "number - deductible amount",
    "currency": "EUR|USD|GBP",
    "autoRenew": "boolean",
    "paymentMethod": "bank_transfer|credit_card|direct_debit"
  },
  "policyholder": {
    "fullName": "string",
    "afm": "string - 9-digit Greek tax ID (ΑΦΜ)",
    "amka": "string - Greek social security number",
    "idNumber": "string - ID card or passport",
    "dateOfBirth": "YYYY-MM-DD",
    "gender": "male|female|other",
    "address": "string - full address",
    "city": "string",
    "postalCode": "string",
    "country": "string - default Greece",
    "phone": "string - with country code",
    "mobile": "string",
    "email": "string",
    "occupation": "string"
  },
  "beneficiaries": [
    {
      "name": "string",
      "relationship": "spouse|child|parent|sibling|other",
      "percentage": "number - 0-100",
      "dateOfBirth": "YYYY-MM-DD",
      "afm": "string",
      "contact": "string"
    }
  ],
  "coverages": [
    {
      "name": "string - coverage type name",
      "code": "string - coverage code",
      "limit": "number - coverage limit",
      "deductible": "number",
      "premium": "number - premium for this coverage",
      "waitingPeriod": "number - days",
      "description": "string"
    }
  ],
  "vehicle": {
    "make": "string - manufacturer",
    "model": "string",
    "year": "number",
    "plate": "string - license plate",
    "vin": "string - vehicle identification number",
    "engineCC": "number - engine capacity",
    "fuelType": "petrol|diesel|electric|hybrid|lpg",
    "color": "string",
    "usage": "personal|commercial|fleet",
    "parkingType": "garage|street|parking_lot",
    "hasAlarm": "boolean",
    "hasTracker": "boolean",
    "mileage": "number"
  },
  "drivers": [
    {
      "name": "string",
      "dateOfBirth": "YYYY-MM-DD",
      "licenseNumber": "string",
      "licenseDate": "YYYY-MM-DD",
      "licenseExpiry": "YYYY-MM-DD",
      "isPrimary": "boolean",
      "yearsExperience": "number",
      "accidentsLast5Years": "number"
    }
  ],
  "property": {
    "address": "string",
    "city": "string",
    "postalCode": "string",
    "country": "string",
    "type": "apartment|house|villa|commercial",
    "squareMeters": "number",
    "yearBuilt": "number",
    "floors": "number",
    "construction": "concrete|brick|wood|mixed",
    "hasBasement": "boolean",
    "hasGarage": "boolean",
    "hasPool": "boolean",
    "hasGarden": "boolean",
    "isRented": "boolean",
    "securitySystem": "string"
  },
  "health": {
    "preExistingConditions": ["string"],
    "medications": ["string"],
    "hospitalizationHistory": "string",
    "smokingStatus": "never|former|current",
    "familyMedicalHistory": "string"
  },
  "confidence": {
    "overall": "number - 0-100 confidence score",
    "notes": "string - any parsing notes or uncertainties"
  }
}

Only include sections relevant to the document type. Omit empty/null fields.
For ${policyType || 'general'} insurance from ${insurerId || 'unknown insurer'}:

Document (${documentType || 'text'}):
${documentContent || '[Base64 document provided]'}`;

      let response;
      
      if (documentBase64 && mimeType) {
        response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [
            {
              role: "user",
              parts: [
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: documentBase64,
                  },
                },
                { text: comprehensivePrompt },
              ],
            },
          ],
        });
      } else {
        response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: comprehensivePrompt,
        });
      }

      const text = response.text || "";
      let parsedData: any = {};
      
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedData = JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.error("Failed to parse Gemini response:", parseError);
        return res.status(422).json({ 
          error: "Could not extract structured data from document",
          rawResponse: text.substring(0, 500)
        });
      }

      res.json({
        success: true,
        parsedData,
        confidence: parsedData.confidence?.overall || 75,
        rawResponse: text.length > 1000 ? text.substring(0, 1000) + "..." : text,
      });
    } catch (error: any) {
      console.error("Document parsing error:", error);
      res.status(500).json({ 
        error: "Failed to parse document", 
        details: error.message 
      });
    }
  });

  // Get all policies for a user
  app.get("/api/policies", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const policies = await storage.getPolicies(req.userId!);
      res.json(policies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch policies" });
    }
  });

  // Get single policy with all related data
  app.get("/api/policies/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const policy = await storage.getPolicy(id);
      
      if (!policy) {
        return res.status(404).json({ error: "Policy not found" });
      }

      const [beneficiaries, drivers, coverages, vehicles, properties, documents] = await Promise.all([
        storage.getPolicyBeneficiaries(id),
        storage.getPolicyDrivers(id),
        storage.getPolicyCoverages(id),
        storage.getPolicyVehicles(id),
        storage.getPolicyProperties(id),
        storage.getPolicyDocuments(id),
      ]);

      res.json({
        ...policy,
        beneficiaries,
        drivers,
        coverages,
        vehicles,
        properties,
        documents,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch policy details" });
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

  // Create new policy with all related data (from AI parsing or manual entry)
  app.post("/api/policies", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { policy, beneficiaries, drivers, coverages, vehicle, property, documents } = req.body;
      
      if (!policy?.policyNumber || !policy?.insurerId || !policy?.policyType) {
        return res.status(400).json({ error: "Missing required policy fields" });
      }

      const policyData = {
        userId: req.userId!,
        policyNumber: policy.policyNumber,
        policyName: policy.policyName || policy.policyNumber,
        policyType: policy.policyType,
        insurerId: policy.insurerId,
        startDate: new Date(policy.startDate),
        endDate: new Date(policy.endDate),
        premium: policy.premium?.toString() || "0",
        premiumFrequency: policy.premiumFrequency || "annual",
        coverageAmount: policy.totalCoverage?.toString() || policy.coverageAmount?.toString() || "0",
        deductible: policy.deductible?.toString() || "0",
        status: "active" as const,
        autoRenew: policy.autoRenew || false,
        addedMethod: policy.addedMethod || "ai_parsed",
        holderName: policy.holderName || req.body.policyholder?.fullName,
        holderAfm: policy.holderAfm || req.body.policyholder?.afm,
        holderAddress: policy.holderAddress || req.body.policyholder?.address,
        holderPhone: policy.holderPhone || req.body.policyholder?.phone,
        holderEmail: policy.holderEmail || req.body.policyholder?.email,
      };

      const createdPolicy = await storage.createPolicy(policyData);
      const policyId = createdPolicy.id;

      if (beneficiaries && Array.isArray(beneficiaries)) {
        for (const b of beneficiaries) {
          const fullName = b.name || b.fullName;
          if (!fullName) continue;
          
          try {
            await storage.createPolicyBeneficiary({
              policyId,
              userId: req.userId!,
              beneficiaryType: b.beneficiaryType || "primary",
              fullName,
              relationship: b.relationship || "other",
              percentage: b.percentage?.toString() || "100",
              dateOfBirth: b.dateOfBirth || null,
              afm: b.afm,
              phone: b.contact || b.phone,
            });
          } catch (err) {
            console.warn("Failed to create beneficiary:", err);
          }
        }
      }

      if (drivers && Array.isArray(drivers)) {
        for (const d of drivers) {
          const fullName = d.name || d.fullName;
          if (!fullName) continue;
          
          try {
            await storage.createPolicyDriver({
              policyId,
              userId: req.userId!,
              driverType: d.isPrimary ? "primary" : (d.driverType || "primary"),
              fullName,
              dateOfBirth: d.dateOfBirth || new Date().toISOString().split('T')[0],
              licenseNumber: d.licenseNumber || "PENDING",
              licenseIssueDate: d.licenseDate || d.licenseIssueDate,
              licenseExpiryDate: d.licenseExpiry || d.licenseExpiryDate,
              yearsLicensed: d.yearsExperience || d.yearsLicensed,
            });
          } catch (err) {
            console.warn("Failed to create driver:", err);
          }
        }
      }

      if (coverages && Array.isArray(coverages)) {
        for (const c of coverages) {
          const coverageName = c.name || c.coverageName;
          if (!coverageName) continue;
          
          try {
            await storage.createPolicyCoverage({
              policyId,
              userId: req.userId!,
              coverageType: c.code || c.coverageType || "other",
              coverageName,
              limitAmount: c.limit?.toString() || c.limitAmount?.toString() || "0",
              deductible: c.deductible?.toString() || "0",
              waitingPeriod: c.waitingPeriod || c.waitingPeriodDays || 0,
              description: c.description,
              isActive: true,
            });
          } catch (err) {
            console.warn("Failed to create coverage:", err);
          }
        }
      }

      if (vehicle) {
        try {
          await storage.createPolicyVehicle({
            policyId,
            userId: req.userId!,
            vehicleType: vehicle.vehicleType || "car",
            make: vehicle.make || "Unknown",
            model: vehicle.model || "Unknown",
            year: vehicle.year || new Date().getFullYear(),
            licensePlate: vehicle.plate || vehicle.licensePlate || "PENDING",
            vin: vehicle.vin,
            engineSize: vehicle.engineCC || vehicle.engineSize,
            fuelType: vehicle.fuelType,
            color: vehicle.color,
            primaryUse: vehicle.usage || vehicle.primaryUse || "personal",
            garageAddress: vehicle.parkingType || vehicle.garageAddress,
            hasAlarm: vehicle.hasAlarm || false,
            hasTracker: vehicle.hasTracker || false,
            currentMileage: vehicle.mileage || vehicle.currentMileage,
          });
        } catch (err) {
          console.warn("Failed to create vehicle:", err);
        }
      }

      if (property) {
        try {
          await storage.createPolicyProperty({
            policyId,
            userId: req.userId!,
            address: property.address || "Unknown",
            city: property.city,
            postalCode: property.postalCode,
            country: property.country || "Greece",
            propertyType: property.type || property.propertyType || "apartment",
            squareMeters: property.squareMeters,
            yearBuilt: property.yearBuilt,
            numberOfFloors: property.floors || property.numberOfFloors,
            constructionType: property.construction || property.constructionType,
            hasBasement: property.hasBasement || false,
            hasGarage: property.hasGarage || false,
            hasPool: property.hasPool || false,
            hasGarden: property.hasGarden || false,
            securitySystem: property.securitySystem,
          });
        } catch (err) {
          console.warn("Failed to create property:", err);
        }
      }

      await auditLog(req.userId!, "policy_created", "policies", { policyId, policyNumber: policy.policyNumber });

      const fullPolicy = await storage.getPolicy(policyId);
      res.status(201).json(fullPolicy);
    } catch (error: any) {
      console.error("Policy creation error:", error);
      res.status(400).json({ error: "Failed to create policy", details: error.message });
    }
  });

  // Update policy
  app.patch("/api/policies/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const policy = await storage.getPolicy(id);
      
      if (!policy || policy.userId !== req.userId) {
        return res.status(404).json({ error: "Policy not found" });
      }

      const updated = await storage.updatePolicy(id, req.body);
      await auditLog(req.userId!, "policy_updated", "policies", { policyId: id });
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: "Failed to update policy" });
    }
  });

  // Delete policy
  app.delete("/api/policies/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const policy = await storage.getPolicy(id);
      
      if (!policy || policy.userId !== req.userId) {
        return res.status(404).json({ error: "Policy not found" });
      }

      await storage.deletePolicy(id);
      await auditLog(req.userId!, "policy_deleted", "policies", { policyId: id });
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Failed to delete policy" });
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
