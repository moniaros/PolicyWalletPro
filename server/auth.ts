import { storage } from "./storage";
import { generateToken } from "./middleware";

// Simple password hashing (use bcrypt in production)
function hashPassword(password: string): string {
  return Buffer.from(password).toString("base64");
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export async function register(email: string, password: string) {
  // Validate email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Invalid email address");
  }

  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  // Check if user exists
  const existing = await storage.getUserByEmail(email);
  if (existing) {
    throw new Error("Email already registered");
  }

  // Create user
  const user = await storage.createUser({
    email,
    password: hashPassword(password),
  });

  // Generate token
  const token = generateToken(user.id, "customer");

  return {
    id: user.id,
    email: user.email,
    token,
  };
}

export async function login(email: string, password: string) {
  // Validate email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Invalid email address");
  }

  // Find user by email
  const user = await storage.getUserByEmail(email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Verify password
  if (!verifyPassword(password, user.password)) {
    throw new Error("Invalid email or password");
  }

  // Generate token
  const token = generateToken(user.id, "customer");

  return {
    id: user.id,
    email: user.email,
    token,
  };
}
