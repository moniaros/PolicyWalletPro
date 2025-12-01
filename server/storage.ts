import { 
  type User, type InsertUser, 
  type HealthCheckup, type InsertHealthCheckup, 
  type HealthMetrics, type InsertHealthMetrics, 
  type RiskAssessment, type InsertRiskAssessment, 
  type PreventiveRecommendation, type InsertPreventiveRecommendation, 
  type StravaConnection, type InsertStravaConnection, 
  type DailyWellnessLog, type InsertDailyWellnessLog,
  type Policy, type InsertPolicy,
  type PolicyDocument, type InsertPolicyDocument,
  type PolicyBeneficiary, type InsertPolicyBeneficiary,
  type PolicyDriver, type InsertPolicyDriver,
  type PolicyCoverage, type InsertPolicyCoverage,
  type PolicyVehicle, type InsertPolicyVehicle,
  type PolicyProperty, type InsertPolicyProperty,
  users, policies, policyDocuments, policyBeneficiaries, policyDrivers, 
  policyCoverages, policyVehicles, policyProperties, healthCheckups,
  healthMetrics, riskAssessments, preventiveRecommendations, 
  stravaConnections, dailyWellnessLogs, userProfiles, appointments
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, and, gte, lte, desc } from "drizzle-orm";

export interface UserProfile {
  id: string;
  userId: string;
  fullName?: string;
  dateOfBirth?: string;
  ageGroup?: string;
  familyStatus?: string;
  dependents?: number;
  incomeRange?: string;
  healthStatus?: string;
  emergencyFund?: string;
  travelFrequency?: string;
  occupationRisk?: string;
  lifeStageFactors?: string[];
  currentCoverages?: string[];
  chronicConditions?: string[];
  dependentDetails?: any;
  updatedAt: Date;
  createdAt: Date;
}

export type InsertUserProfile = Omit<UserProfile, 'id' | 'updatedAt' | 'createdAt'>;

export interface Appointment {
  id: string;
  userId: string;
  policyType: string;
  serviceType: string;
  providerName: string;
  location: string;
  appointmentDate: Date;
  appointmentTime: string;
  notes?: string;
  status: string;
  createdAt: Date;
}

export type InsertAppointment = Omit<Appointment, 'id' | 'createdAt'>;

export interface IStorage {
  // User CRUD
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // User Profile
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: string, profile: Partial<InsertUserProfile>): Promise<UserProfile>;

  // Health Checkups
  getHealthCheckups(userId: string): Promise<HealthCheckup[]>;
  getHealthCheckup(id: string): Promise<HealthCheckup | undefined>;
  createHealthCheckup(checkup: InsertHealthCheckup): Promise<HealthCheckup>;
  updateHealthCheckup(id: string, checkup: Partial<InsertHealthCheckup>): Promise<HealthCheckup>;

  // Health Metrics
  getHealthMetrics(checkupId: string): Promise<HealthMetrics | undefined>;
  createHealthMetrics(metrics: InsertHealthMetrics): Promise<HealthMetrics>;

  // Risk Assessments
  getRiskAssessment(userId: string): Promise<RiskAssessment | undefined>;
  createRiskAssessment(assessment: InsertRiskAssessment): Promise<RiskAssessment>;

  // Preventive Recommendations
  getPreventiveRecommendations(userId: string): Promise<PreventiveRecommendation[]>;
  createPreventiveRecommendation(rec: InsertPreventiveRecommendation): Promise<PreventiveRecommendation>;
  updateRecommendation(id: string, completed: boolean): Promise<PreventiveRecommendation>;

  // Appointments
  getAppointments(userId: string): Promise<Appointment[]>;
  getAppointment(id: string): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: string, appointment: Partial<InsertAppointment>): Promise<Appointment>;
  deleteAppointment(id: string): Promise<void>;

  // Strava Connection
  getStravaConnection(userId: string): Promise<StravaConnection | undefined>;
  createStravaConnection(connection: InsertStravaConnection): Promise<StravaConnection>;
  updateStravaConnection(userId: string, connection: Partial<InsertStravaConnection>): Promise<StravaConnection>;
  deleteStravaConnection(userId: string): Promise<void>;

  // Daily Wellness Logs
  getDailyWellnessLog(userId: string, date: string): Promise<DailyWellnessLog | undefined>;
  getDailyWellnessLogs(userId: string, startDate: string, endDate: string): Promise<DailyWellnessLog[]>;
  createDailyWellnessLog(log: InsertDailyWellnessLog): Promise<DailyWellnessLog>;
  updateDailyWellnessLog(userId: string, date: string, log: Partial<InsertDailyWellnessLog>): Promise<DailyWellnessLog>;

  // Policies
  getPolicies(userId: string): Promise<Policy[]>;
  getPolicy(id: string): Promise<Policy | undefined>;
  createPolicy(policy: InsertPolicy): Promise<Policy>;
  updatePolicy(id: string, policy: Partial<InsertPolicy>): Promise<Policy>;
  deletePolicy(id: string): Promise<void>;

  // Policy Documents
  getPolicyDocuments(policyId: string): Promise<PolicyDocument[]>;
  getPolicyDocument(id: string): Promise<PolicyDocument | undefined>;
  createPolicyDocument(doc: InsertPolicyDocument): Promise<PolicyDocument>;
  updatePolicyDocument(id: string, doc: Partial<InsertPolicyDocument>): Promise<PolicyDocument>;

  // Policy Beneficiaries
  getPolicyBeneficiaries(policyId: string): Promise<PolicyBeneficiary[]>;
  createPolicyBeneficiary(beneficiary: InsertPolicyBeneficiary): Promise<PolicyBeneficiary>;
  updatePolicyBeneficiary(id: string, beneficiary: Partial<InsertPolicyBeneficiary>): Promise<PolicyBeneficiary>;
  deletePolicyBeneficiary(id: string): Promise<void>;

  // Policy Drivers
  getPolicyDrivers(policyId: string): Promise<PolicyDriver[]>;
  createPolicyDriver(driver: InsertPolicyDriver): Promise<PolicyDriver>;
  updatePolicyDriver(id: string, driver: Partial<InsertPolicyDriver>): Promise<PolicyDriver>;
  deletePolicyDriver(id: string): Promise<void>;

  // Policy Coverages
  getPolicyCoverages(policyId: string): Promise<PolicyCoverage[]>;
  createPolicyCoverage(coverage: InsertPolicyCoverage): Promise<PolicyCoverage>;
  updatePolicyCoverage(id: string, coverage: Partial<InsertPolicyCoverage>): Promise<PolicyCoverage>;
  deletePolicyCoverage(id: string): Promise<void>;

  // Policy Vehicles
  getPolicyVehicles(policyId: string): Promise<PolicyVehicle[]>;
  createPolicyVehicle(vehicle: InsertPolicyVehicle): Promise<PolicyVehicle>;
  updatePolicyVehicle(id: string, vehicle: Partial<InsertPolicyVehicle>): Promise<PolicyVehicle>;
  deletePolicyVehicle(id: string): Promise<void>;

  // Policy Properties
  getPolicyProperties(policyId: string): Promise<PolicyProperty[]>;
  createPolicyProperty(property: InsertPolicyProperty): Promise<PolicyProperty>;
  updatePolicyProperty(id: string, property: Partial<InsertPolicyProperty>): Promise<PolicyProperty>;
  deletePolicyProperty(id: string): Promise<void>;

  // Audit Logging
  logAuditEvent(event: any): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private userProfiles: Map<string, UserProfile>;
  private checkups: Map<string, HealthCheckup>;
  private metrics: Map<string, HealthMetrics>;
  private risks: Map<string, RiskAssessment>;
  private recommendations: Map<string, PreventiveRecommendation>;
  private appointments: Map<string, Appointment>;
  private stravaConnections: Map<string, StravaConnection>;
  private dailyWellnessLogs: Map<string, DailyWellnessLog>;
  private policies: Map<string, Policy>;
  private policyDocuments: Map<string, PolicyDocument>;
  private policyBeneficiaries: Map<string, PolicyBeneficiary>;
  private policyDrivers: Map<string, PolicyDriver>;
  private policyCoverages: Map<string, PolicyCoverage>;
  private policyVehicles: Map<string, PolicyVehicle>;
  private policyProperties: Map<string, PolicyProperty>;
  private auditLog: any[];

  constructor() {
    this.users = new Map();
    this.userProfiles = new Map();
    this.checkups = new Map();
    this.metrics = new Map();
    this.risks = new Map();
    this.recommendations = new Map();
    this.appointments = new Map();
    this.stravaConnections = new Map();
    this.dailyWellnessLogs = new Map();
    this.policies = new Map();
    this.policyDocuments = new Map();
    this.policyBeneficiaries = new Map();
    this.policyDrivers = new Map();
    this.policyCoverages = new Map();
    this.policyVehicles = new Map();
    this.policyProperties = new Map();
    this.auditLog = [];
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id } as User;
    this.users.set(id, user);
    return user;
  }

  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    return this.userProfiles.get(userId);
  }

  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const now = new Date();
    const newProfile: UserProfile = {
      ...profile,
      id: randomUUID(),
      updatedAt: now,
      createdAt: now,
    };
    this.userProfiles.set(profile.userId, newProfile);
    return newProfile;
  }

  async updateUserProfile(userId: string, partial: Partial<InsertUserProfile>): Promise<UserProfile> {
    let profile = this.userProfiles.get(userId);
    if (!profile) {
      profile = await this.createUserProfile({ userId, ...partial });
    } else {
      profile = { ...profile, ...partial, updatedAt: new Date() };
      this.userProfiles.set(userId, profile);
    }
    return profile;
  }

  async getHealthCheckups(userId: string): Promise<HealthCheckup[]> {
    return Array.from(this.checkups.values())
      .filter(c => c.userId === userId)
      .sort((a, b) => new Date(b.checkupDate).getTime() - new Date(a.checkupDate).getTime());
  }

  async getHealthCheckup(id: string): Promise<HealthCheckup | undefined> {
    return this.checkups.get(id);
  }

  async createHealthCheckup(checkup: InsertHealthCheckup): Promise<HealthCheckup> {
    const id = randomUUID();
    const newCheckup = {
      ...checkup,
      id,
      createdAt: new Date(),
      results: checkup.results || null,
      fileUrls: checkup.fileUrls || null,
    } as HealthCheckup;
    this.checkups.set(id, newCheckup);
    return newCheckup;
  }

  async updateHealthCheckup(id: string, partial: Partial<InsertHealthCheckup>): Promise<HealthCheckup> {
    const checkup = this.checkups.get(id);
    if (!checkup) throw new Error("Checkup not found");
    const updated: HealthCheckup = { ...checkup, ...partial } as HealthCheckup;
    this.checkups.set(id, updated);
    return updated;
  }

  async getHealthMetrics(checkupId: string): Promise<HealthMetrics | undefined> {
    return Array.from(this.metrics.values()).find(m => m.checkupId === checkupId);
  }

  async createHealthMetrics(metrics: InsertHealthMetrics): Promise<HealthMetrics> {
    const id = randomUUID();
    const newMetrics = {
      ...metrics,
      id,
      createdAt: new Date(),
    } as any;
    this.metrics.set(id, newMetrics);
    return newMetrics;
  }

  async getRiskAssessment(userId: string): Promise<RiskAssessment | undefined> {
    const assessments = Array.from(this.risks.values())
      .filter(r => r.userId === userId)
      .sort((a, b) => new Date(b.calculatedAt).getTime() - new Date(a.calculatedAt).getTime());
    return assessments[0];
  }

  async createRiskAssessment(assessment: InsertRiskAssessment): Promise<RiskAssessment> {
    const id = randomUUID();
    const newAssessment = {
      ...assessment,
      id,
      calculatedAt: new Date(),
    } as any;
    this.risks.set(id, newAssessment);
    return newAssessment;
  }

  async getPreventiveRecommendations(userId: string): Promise<PreventiveRecommendation[]> {
    return Array.from(this.recommendations.values())
      .filter(r => r.userId === userId && !r.completedAt)
      .sort((a, b) => {
        const priorityOrder = { "High": 0, "Medium": 1, "Low": 2 };
        return (priorityOrder[a.priority as keyof typeof priorityOrder] || 3) - (priorityOrder[b.priority as keyof typeof priorityOrder] || 3);
      });
  }

  async createPreventiveRecommendation(rec: InsertPreventiveRecommendation): Promise<PreventiveRecommendation> {
    const id = randomUUID();
    const newRec = {
      ...rec,
      id,
      createdAt: new Date(),
      coverageStatus: rec.coverageStatus || null,
      estimatedCost: rec.estimatedCost || null,
      completedAt: rec.completedAt || null,
    } as PreventiveRecommendation;
    this.recommendations.set(id, newRec);
    return newRec;
  }

  async updateRecommendation(id: string, completed: boolean): Promise<PreventiveRecommendation> {
    const rec = this.recommendations.get(id);
    if (!rec) throw new Error("Recommendation not found");
    const updated: PreventiveRecommendation = { ...rec, completedAt: completed ? new Date() : null } as any;
    this.recommendations.set(id, updated);
    return updated;
  }

  async getAppointments(userId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values())
      .filter(a => a.userId === userId)
      .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
  }

  async getAppointment(id: string): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async createAppointment(apt: InsertAppointment): Promise<Appointment> {
    const id = randomUUID();
    const newApt: Appointment = {
      ...apt,
      id,
      createdAt: new Date(),
    };
    this.appointments.set(id, newApt);
    return newApt;
  }

  async updateAppointment(id: string, partial: Partial<InsertAppointment>): Promise<Appointment> {
    const apt = this.appointments.get(id);
    if (!apt) throw new Error("Appointment not found");
    const updated: Appointment = { ...apt, ...partial };
    this.appointments.set(id, updated);
    return updated;
  }

  async deleteAppointment(id: string): Promise<void> {
    this.appointments.delete(id);
  }

  // Strava Connection Methods
  async getStravaConnection(userId: string): Promise<StravaConnection | undefined> {
    return this.stravaConnections.get(userId);
  }

  async createStravaConnection(connection: InsertStravaConnection): Promise<StravaConnection> {
    const now = new Date();
    const newConnection: StravaConnection = {
      ...connection,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    } as StravaConnection;
    this.stravaConnections.set(connection.userId, newConnection);
    return newConnection;
  }

  async updateStravaConnection(userId: string, partial: Partial<InsertStravaConnection>): Promise<StravaConnection> {
    let connection = this.stravaConnections.get(userId);
    if (!connection) {
      connection = await this.createStravaConnection({ userId, connected: false, ...partial } as InsertStravaConnection);
    } else {
      connection = { ...connection, ...partial, updatedAt: new Date() } as StravaConnection;
      this.stravaConnections.set(userId, connection);
    }
    return connection;
  }

  async deleteStravaConnection(userId: string): Promise<void> {
    this.stravaConnections.delete(userId);
  }

  // Daily Wellness Log Methods
  async getDailyWellnessLog(userId: string, date: string): Promise<DailyWellnessLog | undefined> {
    const key = `${userId}_${date}`;
    return this.dailyWellnessLogs.get(key);
  }

  async getDailyWellnessLogs(userId: string, startDate: string, endDate: string): Promise<DailyWellnessLog[]> {
    return Array.from(this.dailyWellnessLogs.values())
      .filter(log => log.userId === userId && log.date >= startDate && log.date <= endDate)
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  async createDailyWellnessLog(log: InsertDailyWellnessLog): Promise<DailyWellnessLog> {
    const now = new Date();
    const key = `${log.userId}_${log.date}`;
    const newLog: DailyWellnessLog = {
      ...log,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    } as DailyWellnessLog;
    this.dailyWellnessLogs.set(key, newLog);
    return newLog;
  }

  async updateDailyWellnessLog(userId: string, date: string, partial: Partial<InsertDailyWellnessLog>): Promise<DailyWellnessLog> {
    const key = `${userId}_${date}`;
    let log = this.dailyWellnessLogs.get(key);
    if (!log) {
      log = await this.createDailyWellnessLog({ userId, date, ...partial } as InsertDailyWellnessLog);
    } else {
      log = { ...log, ...partial, updatedAt: new Date() } as DailyWellnessLog;
      this.dailyWellnessLogs.set(key, log);
    }
    return log;
  }

  async logAuditEvent(event: any): Promise<void> {
    this.auditLog.push(event);
    // Keep only last 10000 events in memory
    if (this.auditLog.length > 10000) {
      this.auditLog = this.auditLog.slice(-10000);
    }
  }

  // Policy Methods
  async getPolicies(userId: string): Promise<Policy[]> {
    return Array.from(this.policies.values())
      .filter(p => p.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getPolicy(id: string): Promise<Policy | undefined> {
    return this.policies.get(id);
  }

  async createPolicy(policy: InsertPolicy): Promise<Policy> {
    const id = randomUUID();
    const now = new Date();
    const newPolicy: Policy = {
      ...policy,
      id,
      status: policy.status || "active",
      autoRenew: policy.autoRenew || false,
      premiumFrequency: policy.premiumFrequency || "annual",
      addedMethod: policy.addedMethod || "manual",
      startDate: new Date(policy.startDate),
      endDate: new Date(policy.endDate),
      createdAt: now,
      updatedAt: now,
    } as Policy;
    this.policies.set(id, newPolicy);
    return newPolicy;
  }

  async updatePolicy(id: string, partial: Partial<InsertPolicy>): Promise<Policy> {
    const policy = this.policies.get(id);
    if (!policy) throw new Error("Policy not found");
    const updated: Policy = { ...policy, ...partial, updatedAt: new Date() } as Policy;
    this.policies.set(id, updated);
    return updated;
  }

  async deletePolicy(id: string): Promise<void> {
    this.policies.delete(id);
  }

  // Policy Document Methods
  async getPolicyDocuments(policyId: string): Promise<PolicyDocument[]> {
    return Array.from(this.policyDocuments.values())
      .filter(d => d.policyId === policyId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getPolicyDocument(id: string): Promise<PolicyDocument | undefined> {
    return this.policyDocuments.get(id);
  }

  async createPolicyDocument(doc: InsertPolicyDocument): Promise<PolicyDocument> {
    const id = randomUUID();
    const newDoc: PolicyDocument = {
      ...doc,
      id,
      parseStatus: doc.parseStatus || "pending",
      createdAt: new Date(),
    } as PolicyDocument;
    this.policyDocuments.set(id, newDoc);
    return newDoc;
  }

  async updatePolicyDocument(id: string, partial: Partial<InsertPolicyDocument>): Promise<PolicyDocument> {
    const doc = this.policyDocuments.get(id);
    if (!doc) throw new Error("Document not found");
    const updated: PolicyDocument = { ...doc, ...partial } as PolicyDocument;
    this.policyDocuments.set(id, updated);
    return updated;
  }

  // Policy Beneficiary Methods
  async getPolicyBeneficiaries(policyId: string): Promise<PolicyBeneficiary[]> {
    return Array.from(this.policyBeneficiaries.values())
      .filter(b => b.policyId === policyId);
  }

  async createPolicyBeneficiary(beneficiary: InsertPolicyBeneficiary): Promise<PolicyBeneficiary> {
    const id = randomUUID();
    const newBeneficiary: PolicyBeneficiary = {
      ...beneficiary,
      id,
      createdAt: new Date(),
    } as PolicyBeneficiary;
    this.policyBeneficiaries.set(id, newBeneficiary);
    return newBeneficiary;
  }

  async updatePolicyBeneficiary(id: string, partial: Partial<InsertPolicyBeneficiary>): Promise<PolicyBeneficiary> {
    const beneficiary = this.policyBeneficiaries.get(id);
    if (!beneficiary) throw new Error("Beneficiary not found");
    const updated: PolicyBeneficiary = { ...beneficiary, ...partial } as PolicyBeneficiary;
    this.policyBeneficiaries.set(id, updated);
    return updated;
  }

  async deletePolicyBeneficiary(id: string): Promise<void> {
    this.policyBeneficiaries.delete(id);
  }

  // Policy Driver Methods
  async getPolicyDrivers(policyId: string): Promise<PolicyDriver[]> {
    return Array.from(this.policyDrivers.values())
      .filter(d => d.policyId === policyId);
  }

  async createPolicyDriver(driver: InsertPolicyDriver): Promise<PolicyDriver> {
    const id = randomUUID();
    const newDriver: PolicyDriver = {
      ...driver,
      id,
      createdAt: new Date(),
    } as PolicyDriver;
    this.policyDrivers.set(id, newDriver);
    return newDriver;
  }

  async updatePolicyDriver(id: string, partial: Partial<InsertPolicyDriver>): Promise<PolicyDriver> {
    const driver = this.policyDrivers.get(id);
    if (!driver) throw new Error("Driver not found");
    const updated: PolicyDriver = { ...driver, ...partial } as PolicyDriver;
    this.policyDrivers.set(id, updated);
    return updated;
  }

  async deletePolicyDriver(id: string): Promise<void> {
    this.policyDrivers.delete(id);
  }

  // Policy Coverage Methods
  async getPolicyCoverages(policyId: string): Promise<PolicyCoverage[]> {
    return Array.from(this.policyCoverages.values())
      .filter(c => c.policyId === policyId);
  }

  async createPolicyCoverage(coverage: InsertPolicyCoverage): Promise<PolicyCoverage> {
    const id = randomUUID();
    const newCoverage: PolicyCoverage = {
      ...coverage,
      id,
      isActive: coverage.isActive ?? true,
      createdAt: new Date(),
    } as PolicyCoverage;
    this.policyCoverages.set(id, newCoverage);
    return newCoverage;
  }

  async updatePolicyCoverage(id: string, partial: Partial<InsertPolicyCoverage>): Promise<PolicyCoverage> {
    const coverage = this.policyCoverages.get(id);
    if (!coverage) throw new Error("Coverage not found");
    const updated: PolicyCoverage = { ...coverage, ...partial } as PolicyCoverage;
    this.policyCoverages.set(id, updated);
    return updated;
  }

  async deletePolicyCoverage(id: string): Promise<void> {
    this.policyCoverages.delete(id);
  }

  // Policy Vehicle Methods
  async getPolicyVehicles(policyId: string): Promise<PolicyVehicle[]> {
    return Array.from(this.policyVehicles.values())
      .filter(v => v.policyId === policyId);
  }

  async createPolicyVehicle(vehicle: InsertPolicyVehicle): Promise<PolicyVehicle> {
    const id = randomUUID();
    const newVehicle: PolicyVehicle = {
      ...vehicle,
      id,
      hasAlarm: vehicle.hasAlarm ?? false,
      hasTracker: vehicle.hasTracker ?? false,
      createdAt: new Date(),
    } as PolicyVehicle;
    this.policyVehicles.set(id, newVehicle);
    return newVehicle;
  }

  async updatePolicyVehicle(id: string, partial: Partial<InsertPolicyVehicle>): Promise<PolicyVehicle> {
    const vehicle = this.policyVehicles.get(id);
    if (!vehicle) throw new Error("Vehicle not found");
    const updated: PolicyVehicle = { ...vehicle, ...partial } as PolicyVehicle;
    this.policyVehicles.set(id, updated);
    return updated;
  }

  async deletePolicyVehicle(id: string): Promise<void> {
    this.policyVehicles.delete(id);
  }

  // Policy Property Methods
  async getPolicyProperties(policyId: string): Promise<PolicyProperty[]> {
    return Array.from(this.policyProperties.values())
      .filter(p => p.policyId === policyId);
  }

  async createPolicyProperty(property: InsertPolicyProperty): Promise<PolicyProperty> {
    const id = randomUUID();
    const newProperty: PolicyProperty = {
      ...property,
      id,
      country: property.country || "Greece",
      hasBasement: property.hasBasement ?? false,
      hasGarage: property.hasGarage ?? false,
      hasPool: property.hasPool ?? false,
      hasGarden: property.hasGarden ?? false,
      isRented: property.isRented ?? false,
      createdAt: new Date(),
    } as PolicyProperty;
    this.policyProperties.set(id, newProperty);
    return newProperty;
  }

  async updatePolicyProperty(id: string, partial: Partial<InsertPolicyProperty>): Promise<PolicyProperty> {
    const property = this.policyProperties.get(id);
    if (!property) throw new Error("Property not found");
    const updated: PolicyProperty = { ...property, ...partial } as PolicyProperty;
    this.policyProperties.set(id, updated);
    return updated;
  }

  async deletePolicyProperty(id: string): Promise<void> {
    this.policyProperties.delete(id);
  }
}

// Database-backed storage implementation
export class DbStorage implements IStorage {
  // User Methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // User Profile Methods
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
    return result[0] as UserProfile | undefined;
  }

  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const result = await db.insert(userProfiles).values(profile as any).returning();
    return result[0] as UserProfile;
  }

  async updateUserProfile(userId: string, partial: Partial<InsertUserProfile>): Promise<UserProfile> {
    const existing = await this.getUserProfile(userId);
    if (existing) {
      const result = await db.update(userProfiles)
        .set({ ...partial, updatedAt: new Date() } as any)
        .where(eq(userProfiles.userId, userId))
        .returning();
      return result[0] as UserProfile;
    } else {
      return this.createUserProfile({ userId, ...partial });
    }
  }

  // Health Checkup Methods
  async getHealthCheckups(userId: string): Promise<HealthCheckup[]> {
    return db.select().from(healthCheckups)
      .where(eq(healthCheckups.userId, userId))
      .orderBy(desc(healthCheckups.checkupDate));
  }

  async getHealthCheckup(id: string): Promise<HealthCheckup | undefined> {
    const result = await db.select().from(healthCheckups).where(eq(healthCheckups.id, id)).limit(1);
    return result[0];
  }

  async createHealthCheckup(checkup: InsertHealthCheckup): Promise<HealthCheckup> {
    const result = await db.insert(healthCheckups).values(checkup as any).returning();
    return result[0];
  }

  async updateHealthCheckup(id: string, partial: Partial<InsertHealthCheckup>): Promise<HealthCheckup> {
    const result = await db.update(healthCheckups)
      .set(partial as any)
      .where(eq(healthCheckups.id, id))
      .returning();
    return result[0];
  }

  // Health Metrics Methods
  async getHealthMetrics(checkupId: string): Promise<HealthMetrics | undefined> {
    const result = await db.select().from(healthMetrics)
      .where(eq(healthMetrics.checkupId, checkupId)).limit(1);
    return result[0];
  }

  async createHealthMetrics(metrics: InsertHealthMetrics): Promise<HealthMetrics> {
    const result = await db.insert(healthMetrics).values(metrics as any).returning();
    return result[0];
  }

  // Risk Assessment Methods
  async getRiskAssessment(userId: string): Promise<RiskAssessment | undefined> {
    const result = await db.select().from(riskAssessments)
      .where(eq(riskAssessments.userId, userId))
      .orderBy(desc(riskAssessments.calculatedAt))
      .limit(1);
    return result[0];
  }

  async createRiskAssessment(assessment: InsertRiskAssessment): Promise<RiskAssessment> {
    const result = await db.insert(riskAssessments).values(assessment as any).returning();
    return result[0];
  }

  // Preventive Recommendation Methods
  async getPreventiveRecommendations(userId: string): Promise<PreventiveRecommendation[]> {
    return db.select().from(preventiveRecommendations)
      .where(eq(preventiveRecommendations.userId, userId))
      .orderBy(desc(preventiveRecommendations.createdAt));
  }

  async createPreventiveRecommendation(rec: InsertPreventiveRecommendation): Promise<PreventiveRecommendation> {
    const result = await db.insert(preventiveRecommendations).values(rec as any).returning();
    return result[0];
  }

  async updateRecommendation(id: string, completed: boolean): Promise<PreventiveRecommendation> {
    const result = await db.update(preventiveRecommendations)
      .set({ completedAt: completed ? new Date() : null })
      .where(eq(preventiveRecommendations.id, id))
      .returning();
    return result[0];
  }

  // Appointment Methods
  async getAppointments(userId: string): Promise<Appointment[]> {
    const result = await db.select().from(appointments)
      .where(eq(appointments.userId, userId))
      .orderBy(desc(appointments.appointmentDate));
    return result as Appointment[];
  }

  async getAppointment(id: string): Promise<Appointment | undefined> {
    const result = await db.select().from(appointments).where(eq(appointments.id, id)).limit(1);
    return result[0] as Appointment | undefined;
  }

  async createAppointment(apt: InsertAppointment): Promise<Appointment> {
    const result = await db.insert(appointments).values(apt as any).returning();
    return result[0] as Appointment;
  }

  async updateAppointment(id: string, partial: Partial<InsertAppointment>): Promise<Appointment> {
    const result = await db.update(appointments)
      .set(partial as any)
      .where(eq(appointments.id, id))
      .returning();
    return result[0] as Appointment;
  }

  async deleteAppointment(id: string): Promise<void> {
    await db.delete(appointments).where(eq(appointments.id, id));
  }

  // Strava Connection Methods
  async getStravaConnection(userId: string): Promise<StravaConnection | undefined> {
    const result = await db.select().from(stravaConnections)
      .where(eq(stravaConnections.userId, userId)).limit(1);
    return result[0];
  }

  async createStravaConnection(connection: InsertStravaConnection): Promise<StravaConnection> {
    const result = await db.insert(stravaConnections).values(connection as any).returning();
    return result[0];
  }

  async updateStravaConnection(userId: string, partial: Partial<InsertStravaConnection>): Promise<StravaConnection> {
    const existing = await this.getStravaConnection(userId);
    if (existing) {
      const result = await db.update(stravaConnections)
        .set({ ...partial, updatedAt: new Date() } as any)
        .where(eq(stravaConnections.userId, userId))
        .returning();
      return result[0];
    } else {
      return this.createStravaConnection({ userId, connected: false, ...partial } as InsertStravaConnection);
    }
  }

  async deleteStravaConnection(userId: string): Promise<void> {
    await db.delete(stravaConnections).where(eq(stravaConnections.userId, userId));
  }

  // Daily Wellness Log Methods
  async getDailyWellnessLog(userId: string, date: string): Promise<DailyWellnessLog | undefined> {
    const result = await db.select().from(dailyWellnessLogs)
      .where(and(eq(dailyWellnessLogs.userId, userId), eq(dailyWellnessLogs.date, date)))
      .limit(1);
    return result[0];
  }

  async getDailyWellnessLogs(userId: string, startDate: string, endDate: string): Promise<DailyWellnessLog[]> {
    return db.select().from(dailyWellnessLogs)
      .where(and(
        eq(dailyWellnessLogs.userId, userId),
        gte(dailyWellnessLogs.date, startDate),
        lte(dailyWellnessLogs.date, endDate)
      ))
      .orderBy(desc(dailyWellnessLogs.date));
  }

  async createDailyWellnessLog(log: InsertDailyWellnessLog): Promise<DailyWellnessLog> {
    const result = await db.insert(dailyWellnessLogs).values(log as any).returning();
    return result[0];
  }

  async updateDailyWellnessLog(userId: string, date: string, partial: Partial<InsertDailyWellnessLog>): Promise<DailyWellnessLog> {
    const existing = await this.getDailyWellnessLog(userId, date);
    if (existing) {
      const result = await db.update(dailyWellnessLogs)
        .set({ ...partial, updatedAt: new Date() } as any)
        .where(and(eq(dailyWellnessLogs.userId, userId), eq(dailyWellnessLogs.date, date)))
        .returning();
      return result[0];
    } else {
      return this.createDailyWellnessLog({ userId, date, ...partial } as InsertDailyWellnessLog);
    }
  }

  // Policy Methods
  async getPolicies(userId: string): Promise<Policy[]> {
    return db.select().from(policies)
      .where(eq(policies.userId, userId))
      .orderBy(desc(policies.createdAt));
  }

  async getPolicy(id: string): Promise<Policy | undefined> {
    const result = await db.select().from(policies).where(eq(policies.id, id)).limit(1);
    return result[0];
  }

  async createPolicy(policy: InsertPolicy): Promise<Policy> {
    const result = await db.insert(policies).values(policy as any).returning();
    return result[0];
  }

  async updatePolicy(id: string, partial: Partial<InsertPolicy>): Promise<Policy> {
    const result = await db.update(policies)
      .set({ ...partial, updatedAt: new Date() } as any)
      .where(eq(policies.id, id))
      .returning();
    return result[0];
  }

  async deletePolicy(id: string): Promise<void> {
    await db.delete(policies).where(eq(policies.id, id));
  }

  // Policy Document Methods
  async getPolicyDocuments(policyId: string): Promise<PolicyDocument[]> {
    return db.select().from(policyDocuments)
      .where(eq(policyDocuments.policyId, policyId))
      .orderBy(desc(policyDocuments.createdAt));
  }

  async getPolicyDocument(id: string): Promise<PolicyDocument | undefined> {
    const result = await db.select().from(policyDocuments).where(eq(policyDocuments.id, id)).limit(1);
    return result[0];
  }

  async createPolicyDocument(doc: InsertPolicyDocument): Promise<PolicyDocument> {
    const result = await db.insert(policyDocuments).values(doc as any).returning();
    return result[0];
  }

  async updatePolicyDocument(id: string, partial: Partial<InsertPolicyDocument>): Promise<PolicyDocument> {
    const result = await db.update(policyDocuments)
      .set(partial as any)
      .where(eq(policyDocuments.id, id))
      .returning();
    return result[0];
  }

  // Policy Beneficiary Methods
  async getPolicyBeneficiaries(policyId: string): Promise<PolicyBeneficiary[]> {
    return db.select().from(policyBeneficiaries)
      .where(eq(policyBeneficiaries.policyId, policyId));
  }

  async createPolicyBeneficiary(beneficiary: InsertPolicyBeneficiary): Promise<PolicyBeneficiary> {
    const result = await db.insert(policyBeneficiaries).values(beneficiary as any).returning();
    return result[0];
  }

  async updatePolicyBeneficiary(id: string, partial: Partial<InsertPolicyBeneficiary>): Promise<PolicyBeneficiary> {
    const result = await db.update(policyBeneficiaries)
      .set(partial as any)
      .where(eq(policyBeneficiaries.id, id))
      .returning();
    return result[0];
  }

  async deletePolicyBeneficiary(id: string): Promise<void> {
    await db.delete(policyBeneficiaries).where(eq(policyBeneficiaries.id, id));
  }

  // Policy Driver Methods
  async getPolicyDrivers(policyId: string): Promise<PolicyDriver[]> {
    return db.select().from(policyDrivers)
      .where(eq(policyDrivers.policyId, policyId));
  }

  async createPolicyDriver(driver: InsertPolicyDriver): Promise<PolicyDriver> {
    const result = await db.insert(policyDrivers).values(driver as any).returning();
    return result[0];
  }

  async updatePolicyDriver(id: string, partial: Partial<InsertPolicyDriver>): Promise<PolicyDriver> {
    const result = await db.update(policyDrivers)
      .set(partial as any)
      .where(eq(policyDrivers.id, id))
      .returning();
    return result[0];
  }

  async deletePolicyDriver(id: string): Promise<void> {
    await db.delete(policyDrivers).where(eq(policyDrivers.id, id));
  }

  // Policy Coverage Methods
  async getPolicyCoverages(policyId: string): Promise<PolicyCoverage[]> {
    return db.select().from(policyCoverages)
      .where(eq(policyCoverages.policyId, policyId));
  }

  async createPolicyCoverage(coverage: InsertPolicyCoverage): Promise<PolicyCoverage> {
    const result = await db.insert(policyCoverages).values(coverage as any).returning();
    return result[0];
  }

  async updatePolicyCoverage(id: string, partial: Partial<InsertPolicyCoverage>): Promise<PolicyCoverage> {
    const result = await db.update(policyCoverages)
      .set(partial as any)
      .where(eq(policyCoverages.id, id))
      .returning();
    return result[0];
  }

  async deletePolicyCoverage(id: string): Promise<void> {
    await db.delete(policyCoverages).where(eq(policyCoverages.id, id));
  }

  // Policy Vehicle Methods
  async getPolicyVehicles(policyId: string): Promise<PolicyVehicle[]> {
    return db.select().from(policyVehicles)
      .where(eq(policyVehicles.policyId, policyId));
  }

  async createPolicyVehicle(vehicle: InsertPolicyVehicle): Promise<PolicyVehicle> {
    const result = await db.insert(policyVehicles).values(vehicle as any).returning();
    return result[0];
  }

  async updatePolicyVehicle(id: string, partial: Partial<InsertPolicyVehicle>): Promise<PolicyVehicle> {
    const result = await db.update(policyVehicles)
      .set(partial as any)
      .where(eq(policyVehicles.id, id))
      .returning();
    return result[0];
  }

  async deletePolicyVehicle(id: string): Promise<void> {
    await db.delete(policyVehicles).where(eq(policyVehicles.id, id));
  }

  // Policy Property Methods
  async getPolicyProperties(policyId: string): Promise<PolicyProperty[]> {
    return db.select().from(policyProperties)
      .where(eq(policyProperties.policyId, policyId));
  }

  async createPolicyProperty(property: InsertPolicyProperty): Promise<PolicyProperty> {
    const result = await db.insert(policyProperties).values(property as any).returning();
    return result[0];
  }

  async updatePolicyProperty(id: string, partial: Partial<InsertPolicyProperty>): Promise<PolicyProperty> {
    const result = await db.update(policyProperties)
      .set(partial as any)
      .where(eq(policyProperties.id, id))
      .returning();
    return result[0];
  }

  async deletePolicyProperty(id: string): Promise<void> {
    await db.delete(policyProperties).where(eq(policyProperties.id, id));
  }

  // Audit Logging
  async logAuditEvent(event: any): Promise<void> {
    console.log("[AUDIT]", JSON.stringify(event));
  }
}

// Use database storage by default
export const storage: IStorage = new DbStorage();
