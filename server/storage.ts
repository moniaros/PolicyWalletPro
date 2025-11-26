import { type User, type InsertUser, type HealthCheckup, type InsertHealthCheckup, type HealthMetrics, type InsertHealthMetrics, type RiskAssessment, type InsertRiskAssessment, type PreventiveRecommendation, type InsertPreventiveRecommendation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User CRUD
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private checkups: Map<string, HealthCheckup>;
  private metrics: Map<string, HealthMetrics>;
  private risks: Map<string, RiskAssessment>;
  private recommendations: Map<string, PreventiveRecommendation>;

  constructor() {
    this.users = new Map();
    this.checkups = new Map();
    this.metrics = new Map();
    this.risks = new Map();
    this.recommendations = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
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
    const newCheckup: HealthCheckup = {
      ...checkup,
      id,
      createdAt: new Date(),
    };
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
    const newRec: PreventiveRecommendation = {
      ...rec,
      id,
      createdAt: new Date(),
    };
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
}

export const storage = new MemStorage();
