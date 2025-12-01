import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertHealthCheckupSchema, insertHealthMetricsSchema, insertPreventiveRecommendationSchema, insertUserSchema, insertUserProfileSchema, insertStravaConnectionSchema, insertDailyWellnessLogSchema } from "@shared/schema";
import { z } from "zod";
import { authMiddleware, errorHandler, adminMiddleware, type AuthRequest } from "./middleware";
import { login, register } from "./auth";
import { auditLog } from "./middleware";
import { GoogleGenAI, Type } from "@google/genai";

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

      const baseUrl = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;
      const apiKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY;

      if (!baseUrl || !apiKey) {
        return res.status(500).json({ error: "Gemini AI integration not configured. Please ensure Replit AI Integrations are enabled." });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          apiVersion: "",
          baseUrl,
        },
      });

      const extractionPrompt = `You are an expert, highly accurate Greek/European insurance policy parser specializing in ACORD standards.
Analyze the provided insurance document image or PDF thoroughly and extract EVERY piece of information available.

CRITICAL INSTRUCTIONS:
- Do NOT hallucinate or invent data. If a field is not clearly visible in the document, use null.
- Dates should be in YYYY-MM-DD format.
- All monetary values should be numbers (no currency symbols).
- For Greek documents, look for ΑΦΜ (9-digit tax ID), ΑΜΚΑ (social security), policy numbers.
- Extract ALL coverages, benefits, and perks mentioned in the document.

COMPREHENSIVE EXTRACTION REQUIREMENTS:
1. INSURER DETAILS: Extract the insurance company's full name, address, phone numbers, email, website, customer support hotline, claims department contact, and any branch/office locations mentioned.

2. POLICYHOLDER DATA: Extract complete personal information including name, tax ID (ΑΦΜ), social security (ΑΜΚΑ), ID number, address, contact details, occupation, and any co-insured persons.

3. BENEFICIARIES: Extract all beneficiaries with their relationship, percentage share, and contact information.

4. COVERAGES & LIMITS: Extract every coverage type with its limit, deductible, waiting period, and any conditions or exclusions.

5. PERKS & BENEFITS: Look for value-added services like:
   - Roadside assistance / Οδική βοήθεια
   - Free annual health checkups / Δωρεάν ετήσιος έλεγχος
   - Legal assistance / Νομική προστασία
   - Travel assistance
   - Discount programs or partnerships
   - Wellness benefits
   - 24/7 helplines
   - Mobile app benefits
   - Any other included services the policyholder might not be fully aware of

6. CLAIM PROCEDURES: Extract the claim submission process including:
   - Required documents for claims
   - Deadlines for claim submission
   - Contact methods (phone, email, portal)
   - Claims department hours
   - Any specific conditions or requirements

7. POSSIBLE CLAIMS: Based on the coverage types, generate a list of specific claim scenarios that this policy covers. For each scenario provide:
   - A descriptive title
   - A brief description of the covered event
   - The step-by-step process to submit this type of claim
   - Required documents specific to this claim type

Context: This is a ${policyType || 'general'} insurance policy from ${insurerId || 'an insurer'}.`;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          policy: {
            type: Type.OBJECT,
            properties: {
              policyNumber: { type: Type.STRING },
              policyName: { type: Type.STRING },
              policyType: { type: Type.STRING },
              startDate: { type: Type.STRING },
              endDate: { type: Type.STRING },
              premium: { type: Type.NUMBER },
              premiumFrequency: { type: Type.STRING },
              totalCoverage: { type: Type.NUMBER },
              deductible: { type: Type.NUMBER },
              currency: { type: Type.STRING },
              autoRenew: { type: Type.BOOLEAN },
              paymentMethod: { type: Type.STRING }
            }
          },
          insurer: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              legalName: { type: Type.STRING },
              address: { type: Type.STRING },
              city: { type: Type.STRING },
              postalCode: { type: Type.STRING },
              country: { type: Type.STRING },
              phone: { type: Type.STRING },
              fax: { type: Type.STRING },
              email: { type: Type.STRING },
              website: { type: Type.STRING },
              customerSupportPhone: { type: Type.STRING },
              customerSupportEmail: { type: Type.STRING },
              customerSupportHours: { type: Type.STRING },
              claimsDepartmentPhone: { type: Type.STRING },
              claimsDepartmentEmail: { type: Type.STRING },
              emergencyHotline: { type: Type.STRING },
              afm: { type: Type.STRING },
              registrationNumber: { type: Type.STRING },
              branches: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    address: { type: Type.STRING },
                    phone: { type: Type.STRING }
                  }
                }
              }
            }
          },
          policyholder: {
            type: Type.OBJECT,
            properties: {
              fullName: { type: Type.STRING },
              afm: { type: Type.STRING },
              amka: { type: Type.STRING },
              idNumber: { type: Type.STRING },
              dateOfBirth: { type: Type.STRING },
              gender: { type: Type.STRING },
              address: { type: Type.STRING },
              city: { type: Type.STRING },
              postalCode: { type: Type.STRING },
              country: { type: Type.STRING },
              phone: { type: Type.STRING },
              mobile: { type: Type.STRING },
              email: { type: Type.STRING },
              occupation: { type: Type.STRING },
              maritalStatus: { type: Type.STRING },
              nationality: { type: Type.STRING }
            }
          },
          coInsured: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                fullName: { type: Type.STRING },
                relationship: { type: Type.STRING },
                dateOfBirth: { type: Type.STRING },
                afm: { type: Type.STRING }
              }
            }
          },
          beneficiaries: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                relationship: { type: Type.STRING },
                percentage: { type: Type.NUMBER },
                dateOfBirth: { type: Type.STRING },
                afm: { type: Type.STRING },
                contact: { type: Type.STRING },
                address: { type: Type.STRING }
              }
            }
          },
          coverages: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                code: { type: Type.STRING },
                limit: { type: Type.NUMBER },
                deductible: { type: Type.NUMBER },
                premium: { type: Type.NUMBER },
                waitingPeriod: { type: Type.NUMBER },
                description: { type: Type.STRING },
                exclusions: { type: Type.ARRAY, items: { type: Type.STRING } },
                conditions: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          },
          perks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                howToUse: { type: Type.STRING },
                contactNumber: { type: Type.STRING },
                website: { type: Type.STRING },
                limitations: { type: Type.STRING },
                reminderNote: { type: Type.STRING }
              }
            }
          },
          claimProcess: {
            type: Type.OBJECT,
            properties: {
              generalSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
              requiredDocuments: { type: Type.ARRAY, items: { type: Type.STRING } },
              deadlineDays: { type: Type.NUMBER },
              deadlineDescription: { type: Type.STRING },
              contactPhone: { type: Type.STRING },
              contactEmail: { type: Type.STRING },
              onlinePortal: { type: Type.STRING },
              officeHours: { type: Type.STRING },
              emergencyProcedure: { type: Type.STRING },
              paymentMethod: { type: Type.STRING },
              paymentTimeframe: { type: Type.STRING }
            }
          },
          possibleClaims: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                coveredBy: { type: Type.STRING },
                estimatedCoverage: { type: Type.STRING },
                steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                requiredDocuments: { type: Type.ARRAY, items: { type: Type.STRING } },
                timeLimit: { type: Type.STRING },
                tips: { type: Type.STRING }
              }
            }
          },
          vehicle: {
            type: Type.OBJECT,
            properties: {
              make: { type: Type.STRING },
              model: { type: Type.STRING },
              year: { type: Type.NUMBER },
              plate: { type: Type.STRING },
              vin: { type: Type.STRING },
              engineCC: { type: Type.NUMBER },
              fuelType: { type: Type.STRING },
              color: { type: Type.STRING },
              usage: { type: Type.STRING },
              parkingType: { type: Type.STRING },
              hasAlarm: { type: Type.BOOLEAN },
              hasTracker: { type: Type.BOOLEAN },
              mileage: { type: Type.NUMBER }
            }
          },
          drivers: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                fullName: { type: Type.STRING },
                dateOfBirth: { type: Type.STRING },
                licenseNumber: { type: Type.STRING },
                licenseIssueDate: { type: Type.STRING },
                licenseExpiry: { type: Type.STRING },
                isPrimary: { type: Type.BOOLEAN },
                yearsExperience: { type: Type.NUMBER },
                accidentsLast5Years: { type: Type.NUMBER }
              }
            }
          },
          property: {
            type: Type.OBJECT,
            properties: {
              address: { type: Type.STRING },
              city: { type: Type.STRING },
              postalCode: { type: Type.STRING },
              country: { type: Type.STRING },
              type: { type: Type.STRING },
              squareMeters: { type: Type.NUMBER },
              yearBuilt: { type: Type.NUMBER },
              floors: { type: Type.NUMBER },
              construction: { type: Type.STRING },
              hasBasement: { type: Type.BOOLEAN },
              hasGarage: { type: Type.BOOLEAN },
              hasPool: { type: Type.BOOLEAN },
              hasGarden: { type: Type.BOOLEAN },
              isRented: { type: Type.BOOLEAN },
              securitySystem: { type: Type.STRING }
            }
          },
          health: {
            type: Type.OBJECT,
            properties: {
              preExistingConditions: { type: Type.ARRAY, items: { type: Type.STRING } },
              medications: { type: Type.ARRAY, items: { type: Type.STRING } },
              hospitalizationHistory: { type: Type.STRING },
              smokingStatus: { type: Type.STRING },
              familyMedicalHistory: { type: Type.STRING }
            }
          },
          exclusions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                description: { type: Type.STRING },
                details: { type: Type.STRING }
              }
            }
          },
          specialConditions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING }
              }
            }
          },
          confidence: {
            type: Type.OBJECT,
            properties: {
              overall: { type: Type.NUMBER },
              notes: { type: Type.STRING }
            }
          }
        }
      };

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
                { text: extractionPrompt },
              ],
            },
          ],
          config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema as any,
          },
        });
      } else {
        response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `${extractionPrompt}\n\nDocument content:\n${documentContent}`,
          config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema as any,
          },
        });
      }

      const text = response.text || "";
      let parsedData: any = {};
      
      try {
        parsedData = JSON.parse(text);
      } catch (parseError) {
        console.error("Failed to parse Gemini response:", parseError);
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsedData = JSON.parse(jsonMatch[0]);
          } catch {
            return res.status(422).json({ 
              error: "Could not extract structured data from document",
              rawResponse: text.substring(0, 500)
            });
          }
        }
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

  // Step 3: Plain-Language Analysis - After user verification
  app.post("/api/policies/analyze-verified", async (req, res) => {
    try {
      const { verifiedData, policyType, language } = req.body;
      
      if (!verifiedData) {
        return res.status(400).json({ error: "Verified data is required" });
      }

      const baseUrl = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;
      const apiKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY;

      if (!baseUrl || !apiKey) {
        return res.status(500).json({ error: "Gemini AI integration not configured" });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          apiVersion: "",
          baseUrl,
        },
      });

      const isGreek = language === 'el';
      
      const analysisPrompt = isGreek 
        ? `Είσαι ένας εξειδικευμένος σύμβουλος ασφαλίσεων που εξηγεί ένα ασφαλιστήριο σε έναν πελάτη.
Με βάση τα παρακάτω δεδομένα πολιτικής JSON, παρέχεις μια απλή, κατανοητή περίληψη.

- summary: Μία πρόταση που περιγράφει τι καλύπτει αυτό το ασφαλιστήριο.
- keyCoverages: Οι 3 πιο σημαντικές καλύψεις και τι σημαίνει κάθε μία με απλά λόγια.
- keyNumbers: Το Συνολικό Ασφάλιστρο, σημαντικές απαλλαγές, και όρια κάλυψης.
- thingsToKnow: Μία σημαντική εξαίρεση ή προϋπόθεση που πρέπει να γνωρίζει ο χρήστης.
- benefits: Τυχόν παροχές ή πλεονεκτήματα (π.χ. ετήσιος έλεγχος υγείας, οδική βοήθεια).

Χρησιμοποίησε απλή γλώσσα. Αποφεύγεις την ορολογία. Η απάντηση πρέπει να είναι JSON.

Δεδομένα Πολιτικής:
${JSON.stringify(verifiedData, null, 2)}`
        : `You are a helpful insurance expert explaining a policy to a client.
Based on the following JSON policy data, provide a simple, easy-to-understand summary.

- summary: A one-sentence summary of what this policy covers.
- keyCoverages: List the 3 most important coverages and what they mean in one simple sentence each.
- keyNumbers: Clearly state the Total Premium, any significant Deductibles, and coverage limits.
- thingsToKnow: Briefly mention one important exclusion or condition the user should be aware of.
- benefits: Any perks or benefits included (e.g., annual health checkup, roadside assistance).

Keep the language simple and direct. Avoid jargon. The response must be a JSON object.

Policy Data:
${JSON.stringify(verifiedData, null, 2)}`;

      const analysisSchema = {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          keyCoverages: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          keyNumbers: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          thingsToKnow: { type: Type.STRING },
          benefits: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      };

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: analysisPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: analysisSchema as any,
        },
      });

      const text = response.text || "";
      let aiAnalysis: any = {};
      
      try {
        aiAnalysis = JSON.parse(text);
      } catch (parseError) {
        console.error("Failed to parse analysis response:", parseError);
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          aiAnalysis = JSON.parse(jsonMatch[0]);
        }
      }

      res.json({
        success: true,
        aiAnalysis,
      });
    } catch (error: any) {
      console.error("Policy analysis error:", error);
      res.status(500).json({ 
        error: "Failed to analyze policy", 
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
