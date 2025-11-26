import { storage } from "./storage";
import { generateToken } from "./middleware";

// Simple password hashing (use bcrypt in production)
function hashPassword(password: string): string {
  return Buffer.from(password).toString("base64");
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export async function register(username: string, password: string, email?: string) {
  // Check if user exists
  const existing = await storage.getUserByUsername(username);
  if (existing) {
    throw new Error("User already exists");
  }

  // Create user
  const user = await storage.createUser({
    username,
    password: hashPassword(password),
  });

  // Generate token
  const token = generateToken(user.id, "customer");

  return {
    id: user.id,
    username: user.username,
    token,
  };
}

export async function login(username: string, password: string) {
  // Find user
  const user = await storage.getUserByUsername(username);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Verify password
  if (!verifyPassword(password, user.password)) {
    throw new Error("Invalid credentials");
  }

  // Generate token
  const token = generateToken(user.id, "customer");

  return {
    id: user.id,
    username: user.username,
    token,
  };
}
