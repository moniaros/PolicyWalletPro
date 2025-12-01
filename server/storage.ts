import { type User, type InsertUser, type HealthCheckup, type InsertHealthCheckup, type HealthMetrics, type InsertHealthMetrics, type RiskAssessment, type InsertRiskAssessment, type PreventiveRecommendation, type InsertPreventiveRecommendation, type StravaConnection, type InsertStravaConnection, type DailyWellnessLog, type InsertDailyWellnessLog } from "@shared/schema";
import { randomUUID } from "crypto";

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
}

export const storage = new MemStorage();
