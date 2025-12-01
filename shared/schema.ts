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

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
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

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

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
