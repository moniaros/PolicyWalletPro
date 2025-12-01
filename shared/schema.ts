import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username"),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});

// Greek Insurers Table
export const insurers = pgTable("insurers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  nameEn: text("name_en"),
  logo: text("logo"), // URL or base64 encoded logo
  website: text("website"),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  supportedTypes: text("supported_types").array(), // Array of insurance types: "health", "auto", "home", "life", "travel", etc.
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// User Policies Table
export const policies = pgTable("policies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  insurerId: varchar("insurer_id").notNull(),
  policyNumber: text("policy_number").notNull(),
  policyType: text("policy_type").notNull(), // "health", "auto", "home", "life", "travel", "pet", "business"
  policyName: text("policy_name"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  premium: decimal("premium", { precision: 10, scale: 2 }).notNull(),
  premiumFrequency: text("premium_frequency").notNull().default("annual"), // "monthly", "quarterly", "annual"
  coverageAmount: decimal("coverage_amount", { precision: 12, scale: 2 }),
  deductible: decimal("deductible", { precision: 10, scale: 2 }),
  status: text("status").notNull().default("active"), // "active", "expired", "cancelled", "pending"
  autoRenew: boolean("auto_renew").notNull().default(false),
  // Customer data from document parsing
  holderName: text("holder_name"),
  holderAfm: text("holder_afm"), // Greek Tax ID
  holderAddress: text("holder_address"),
  holderPhone: text("holder_phone"),
  holderEmail: text("holder_email"),
  // Policy-specific data (stored as JSON)
  coverageDetails: jsonb("coverage_details"), // Detailed coverage info
  vehicleData: jsonb("vehicle_data"), // For auto insurance: make, model, plate, VIN
  propertyData: jsonb("property_data"), // For home insurance: address, sqm, type
  healthData: jsonb("health_data"), // For health insurance: hospital network, max coverage
  lifeData: jsonb("life_data"), // For life insurance: beneficiaries, sum assured
  // Document info
  documentUrl: text("document_url"),
  documentParsedData: jsonb("document_parsed_data"), // Raw AI parsed data
  // Metadata
  addedMethod: text("added_method").notNull().default("manual"), // "document", "search", "manual"
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const healthCheckups = pgTable("health_checkups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  checkupDate: timestamp("checkup_date").notNull(),
  checkupType: text("checkup_type").notNull(), // "Annual", "Dental", "Eye", "Cardiac", etc.
  provider: text("provider").notNull(), // Doctor/Clinic name
  results: text("results"), // Detailed findings
  fileUrls: text("file_urls").array(), // URLs to uploaded files
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const healthMetrics = pgTable("health_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  checkupId: varchar("checkup_id").notNull(),
  bloodPressure: text("blood_pressure"), // e.g., "120/80"
  heartRate: integer("heart_rate"), // bpm
  weight: text("weight"), // kg as string
  height: text("height"), // cm as string
  bmi: text("bmi"), // as string
  cholesterol: integer("cholesterol"), // mg/dL
  bloodSugar: integer("blood_sugar"), // mg/dL
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const riskAssessments = pgTable("risk_assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  riskScore: integer("risk_score").notNull(), // 0-100
  riskLevel: text("risk_level").notNull(), // "Low", "Moderate", "High"
  healthFactors: jsonb("health_factors"), // { age, bmi, conditions: [], etc. }
  recommendations: text("recommendations").array(),
  nextCheckupDue: timestamp("next_checkup_due"),
  calculatedAt: timestamp("calculated_at").notNull().default(sql`now()`),
});

export const preventiveRecommendations = pgTable("preventive_recommendations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  category: text("category").notNull(), // "Screening", "Lifestyle", "Preventive", "Vaccinations"
  title: text("title").notNull(),
  description: text("description").notNull(),
  priority: text("priority").notNull(), // "High", "Medium", "Low"
  coverageStatus: text("coverage_status"), // "Covered", "Partially Covered", "Not Covered"
  estimatedCost: varchar("estimated_cost"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  fullName: text("full_name"),
  dateOfBirth: text("date_of_birth"),
  ageGroup: text("age_group"), // "18-30", "31-45", "46-60", "60+"
  familyStatus: text("family_status"), // "Single", "Married", "Domestic Partner", "Widowed/Divorced"
  dependents: integer("dependents").default(0),
  incomeRange: text("income_range"), // "<€30k", "€30-60k", "€60-100k", "€100-150k", ">€150k"
  healthStatus: text("health_status"), // "Excellent", "Good", "Fair", "Has chronic conditions"
  emergencyFund: text("emergency_fund"), // "Yes, well covered", "Partially covered", "Minimal or none"
  travelFrequency: text("travel_frequency"), // "Never", "1-2 times/year", "3-6 times/year", "Monthly+"
  occupationRisk: text("occupation_risk"), // "Low risk", "Medium risk", "High risk"
  lifeStageFactors: text("life_stage_factors").array(), // "First home", "Young children", "Mortgage", etc
  currentCoverages: text("current_coverages").array(), // "Health", "Auto", "Home", "Life", etc
  chronicConditions: text("chronic_conditions").array(), // Medical conditions
  dependentDetails: jsonb("dependent_details"), // Spouse, children details
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const appointments = pgTable("appointments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  policyType: text("policy_type").notNull(), // "Health", "Auto", "Home", "Pet"
  serviceType: text("service_type").notNull(), // "Cardiology", "Dental", "Auto Repair", etc.
  providerName: text("provider_name").notNull(),
  location: text("location").notNull(),
  appointmentDate: timestamp("appointment_date").notNull(),
  appointmentTime: text("appointment_time").notNull(),
  notes: text("notes"),
  status: text("status").notNull().default("Scheduled"), // "Scheduled", "Completed", "Cancelled"
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const stravaConnections = pgTable("strava_connections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  stravaAthleteId: text("strava_athlete_id"),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
  athleteName: text("athlete_name"),
  athleteProfile: text("athlete_profile"), // profile picture URL
  connected: boolean("connected").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const dailyWellnessLogs = pgTable("daily_wellness_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD format
  steps: integer("steps").default(0),
  stepsGoal: integer("steps_goal").default(10000),
  waterGlasses: integer("water_glasses").default(0),
  waterGoal: integer("water_goal").default(8),
  sleepHours: decimal("sleep_hours", { precision: 3, scale: 1 }).default("0"),
  sleepGoal: decimal("sleep_goal", { precision: 3, scale: 1 }).default("8"),
  calories: integer("calories").default(0),
  caloriesGoal: integer("calories_goal").default(2000),
  activeMinutes: integer("active_minutes").default(0),
  activeMinutesGoal: integer("active_minutes_goal").default(30),
  heartRateAvg: integer("heart_rate_avg"),
  distance: decimal("distance", { precision: 5, scale: 2 }), // km
  mood: text("mood"), // "great", "good", "okay", "low"
  notes: text("notes"),
  stravaActivities: jsonb("strava_activities"), // Array of activity summaries from Strava
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// Policy Documents Table - Stores uploaded document files
export const policyDocuments = pgTable("policy_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  policyId: varchar("policy_id").notNull(),
  userId: varchar("user_id").notNull(),
  documentType: text("document_type").notNull(), // "policy", "certificate", "endorsement", "receipt", "claim", "id_card"
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(), // "application/pdf", "image/jpeg", etc.
  fileSize: integer("file_size"), // bytes
  fileData: text("file_data"), // base64 encoded file content
  fileUrl: text("file_url"), // external URL if stored elsewhere
  extractedText: text("extracted_text"), // OCR/parsed text content
  aiParsedData: jsonb("ai_parsed_data"), // Full AI extracted structured data
  parseStatus: text("parse_status").notNull().default("pending"), // "pending", "processing", "completed", "failed"
  parseError: text("parse_error"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Policy Beneficiaries Table - Stores beneficiaries for life/health policies
export const policyBeneficiaries = pgTable("policy_beneficiaries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  policyId: varchar("policy_id").notNull(),
  userId: varchar("user_id").notNull(),
  beneficiaryType: text("beneficiary_type").notNull(), // "primary", "contingent", "irrevocable"
  fullName: text("full_name").notNull(),
  relationship: text("relationship").notNull(), // "spouse", "child", "parent", "sibling", "other"
  dateOfBirth: text("date_of_birth"),
  afm: text("afm"), // Greek Tax ID
  idNumber: text("id_number"), // ID card or passport
  percentage: decimal("percentage", { precision: 5, scale: 2 }).notNull(), // % of benefit
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Policy Drivers Table - Stores drivers for auto insurance policies
export const policyDrivers = pgTable("policy_drivers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  policyId: varchar("policy_id").notNull(),
  userId: varchar("user_id").notNull(),
  driverType: text("driver_type").notNull(), // "primary", "secondary", "occasional"
  fullName: text("full_name").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  afm: text("afm"), // Greek Tax ID
  licenseNumber: text("license_number").notNull(),
  licenseIssueDate: text("license_issue_date"),
  licenseExpiryDate: text("license_expiry_date"),
  licenseCategories: text("license_categories").array(), // ["B", "A1", "C"]
  yearsLicensed: integer("years_licensed"),
  accidentHistory: jsonb("accident_history"), // [{date, description, atFault}]
  violations: jsonb("violations"), // [{date, type, points}]
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Policy Coverages Table - Detailed coverage breakdown
export const policyCoverages = pgTable("policy_coverages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  policyId: varchar("policy_id").notNull(),
  userId: varchar("user_id").notNull(),
  coverageType: text("coverage_type").notNull(), // "liability", "collision", "comprehensive", "medical", "dental", "vision"
  coverageName: text("coverage_name").notNull(), // Display name
  coverageNameEl: text("coverage_name_el"), // Greek name
  description: text("description"),
  descriptionEl: text("description_el"), // Greek description
  limitAmount: decimal("limit_amount", { precision: 12, scale: 2 }), // Coverage limit in EUR
  limitType: text("limit_type"), // "per_incident", "annual", "lifetime", "per_person"
  deductible: decimal("deductible", { precision: 10, scale: 2 }),
  coPayPercent: decimal("co_pay_percent", { precision: 5, scale: 2 }), // Co-pay percentage
  waitingPeriod: integer("waiting_period"), // Days before coverage begins
  isActive: boolean("is_active").notNull().default(true),
  exclusions: text("exclusions").array(), // List of exclusions
  conditions: text("conditions").array(), // Special conditions
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Policy Vehicles Table - Vehicle details for auto insurance
export const policyVehicles = pgTable("policy_vehicles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  policyId: varchar("policy_id").notNull(),
  userId: varchar("user_id").notNull(),
  vehicleType: text("vehicle_type").notNull(), // "car", "motorcycle", "truck", "van"
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  licensePlate: text("license_plate").notNull(),
  vin: text("vin"), // Vehicle Identification Number
  engineSize: text("engine_size"), // cc
  fuelType: text("fuel_type"), // "petrol", "diesel", "electric", "hybrid", "lpg"
  color: text("color"),
  currentMileage: integer("current_mileage"),
  purchaseDate: text("purchase_date"),
  purchasePrice: decimal("purchase_price", { precision: 10, scale: 2 }),
  marketValue: decimal("market_value", { precision: 10, scale: 2 }),
  garageAddress: text("garage_address"),
  primaryUse: text("primary_use"), // "personal", "commute", "business"
  annualMileage: integer("annual_mileage"),
  hasAlarm: boolean("has_alarm").default(false),
  hasTracker: boolean("has_tracker").default(false),
  modifications: text("modifications").array(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Policy Properties Table - Property details for home/property insurance
export const policyProperties = pgTable("policy_properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  policyId: varchar("policy_id").notNull(),
  userId: varchar("user_id").notNull(),
  propertyType: text("property_type").notNull(), // "apartment", "house", "villa", "commercial", "land"
  address: text("address").notNull(),
  city: text("city"),
  postalCode: text("postal_code"),
  region: text("region"),
  country: text("country").default("Greece"),
  squareMeters: decimal("square_meters", { precision: 8, scale: 2 }),
  yearBuilt: integer("year_built"),
  constructionType: text("construction_type"), // "concrete", "brick", "wood", "steel"
  numberOfFloors: integer("number_of_floors"),
  floorNumber: integer("floor_number"), // For apartments
  hasBasement: boolean("has_basement").default(false),
  hasGarage: boolean("has_garage").default(false),
  hasPool: boolean("has_pool").default(false),
  hasGarden: boolean("has_garden").default(false),
  heatingType: text("heating_type"), // "central", "autonomous", "ac", "fireplace"
  securitySystem: text("security_system"), // "alarm", "cctv", "guard", "none"
  buildingValue: decimal("building_value", { precision: 12, scale: 2 }),
  contentsValue: decimal("contents_value", { precision: 12, scale: 2 }),
  isRented: boolean("is_rented").default(false),
  occupancyType: text("occupancy_type"), // "primary", "secondary", "vacation", "rental"
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
});

export const insertInsurerSchema = createInsertSchema(insurers).omit({
  id: true,
  createdAt: true,
});

export const insertPolicySchema = createInsertSchema(policies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHealthCheckupSchema = createInsertSchema(healthCheckups).omit({
  id: true,
  createdAt: true,
});

export const insertHealthMetricsSchema = createInsertSchema(healthMetrics).omit({
  id: true,
  createdAt: true,
});

export const insertRiskAssessmentSchema = createInsertSchema(riskAssessments).omit({
  id: true,
  calculatedAt: true,
});

export const insertPreventiveRecommendationSchema = createInsertSchema(preventiveRecommendations).omit({
  id: true,
  createdAt: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
});

export const insertStravaConnectionSchema = createInsertSchema(stravaConnections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDailyWellnessLogSchema = createInsertSchema(dailyWellnessLogs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPolicyDocumentSchema = createInsertSchema(policyDocuments).omit({
  id: true,
  createdAt: true,
});

export const insertPolicyBeneficiarySchema = createInsertSchema(policyBeneficiaries).omit({
  id: true,
  createdAt: true,
});

export const insertPolicyDriverSchema = createInsertSchema(policyDrivers).omit({
  id: true,
  createdAt: true,
});

export const insertPolicyCoverageSchema = createInsertSchema(policyCoverages).omit({
  id: true,
  createdAt: true,
});

export const insertPolicyVehicleSchema = createInsertSchema(policyVehicles).omit({
  id: true,
  createdAt: true,
});

export const insertPolicyPropertySchema = createInsertSchema(policyProperties).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertInsurer = z.infer<typeof insertInsurerSchema>;
export type Insurer = typeof insurers.$inferSelect;

export type InsertPolicy = z.infer<typeof insertPolicySchema>;
export type Policy = typeof policies.$inferSelect;

export type InsertHealthCheckup = z.infer<typeof insertHealthCheckupSchema>;
export type HealthCheckup = typeof healthCheckups.$inferSelect;

export type InsertHealthMetrics = z.infer<typeof insertHealthMetricsSchema>;
export type HealthMetrics = typeof healthMetrics.$inferSelect;

export type InsertRiskAssessment = z.infer<typeof insertRiskAssessmentSchema>;
export type RiskAssessment = typeof riskAssessments.$inferSelect;

export type InsertPreventiveRecommendation = z.infer<typeof insertPreventiveRecommendationSchema>;
export type PreventiveRecommendation = typeof preventiveRecommendations.$inferSelect;

export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;

export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;

export type InsertStravaConnection = z.infer<typeof insertStravaConnectionSchema>;
export type StravaConnection = typeof stravaConnections.$inferSelect;

export type InsertDailyWellnessLog = z.infer<typeof insertDailyWellnessLogSchema>;
export type DailyWellnessLog = typeof dailyWellnessLogs.$inferSelect;

export type InsertPolicyDocument = z.infer<typeof insertPolicyDocumentSchema>;
export type PolicyDocument = typeof policyDocuments.$inferSelect;

export type InsertPolicyBeneficiary = z.infer<typeof insertPolicyBeneficiarySchema>;
export type PolicyBeneficiary = typeof policyBeneficiaries.$inferSelect;

export type InsertPolicyDriver = z.infer<typeof insertPolicyDriverSchema>;
export type PolicyDriver = typeof policyDrivers.$inferSelect;

export type InsertPolicyCoverage = z.infer<typeof insertPolicyCoverageSchema>;
export type PolicyCoverage = typeof policyCoverages.$inferSelect;

export type InsertPolicyVehicle = z.infer<typeof insertPolicyVehicleSchema>;
export type PolicyVehicle = typeof policyVehicles.$inferSelect;

export type InsertPolicyProperty = z.infer<typeof insertPolicyPropertySchema>;
export type PolicyProperty = typeof policyProperties.$inferSelect;
