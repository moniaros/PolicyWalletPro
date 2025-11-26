// Biometric authentication utilities for mobile security
export async function isBiometricAvailable(): Promise<boolean> {
  if (!("PublicKeyCredential" in window)) {
    return false;
  }

  try {
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return available;
  } catch (error) {
    console.error("Error checking biometric availability:", error);
    return false;
  }
}

export async function registerBiometric(userId: string): Promise<boolean> {
  try {
    if (!("PublicKeyCredential" in window)) {
      return false;
    }

    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const userIdBuffer = new TextEncoder().encode(userId);

    const credential = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: {
          name: "PolicyGuard",
          id: window.location.hostname,
        },
        user: {
          id: userIdBuffer,
          name: userId,
          displayName: userId,
        },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }],
        timeout: 60000,
        attestation: "direct",
      },
    });

    if (!credential) {
      return false;
    }

    // Store credential ID for later authentication
    const credentialId = Array.from(new Uint8Array((credential as any).rawId))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    localStorage.setItem(`biometric_${userId}`, credentialId);
    return true;
  } catch (error) {
    console.error("Biometric registration failed:", error);
    return false;
  }
}

export async function authenticateWithBiometric(userId: string): Promise<boolean> {
  try {
    if (!("PublicKeyCredential" in window)) {
      return false;
    }

    const credentialId = localStorage.getItem(`biometric_${userId}`);
    if (!credentialId) {
      return false;
    }

    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const allowCredentials = [
      {
        id: new Uint8Array(credentialId.match(/.{1,2}/g)!.map((x) => parseInt(x, 16))),
        type: "public-key" as const,
      },
    ];

    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge,
        timeout: 60000,
        userVerification: "preferred",
        allowCredentials,
      },
    });

    return !!assertion;
  } catch (error) {
    console.error("Biometric authentication failed:", error);
    return false;
  }
}

// Simple PIN/pattern lock for devices without biometric
export function generatePinHash(pin: string): string {
  // Simple hash for demo - use proper hashing in production
  return Array.from(pin)
    .reduce((hash, char) => ((hash << 5) - hash) + char.charCodeAt(0), 0)
    .toString();
}

export function validatePin(pin: string, storedHash: string): boolean {
  return generatePinHash(pin) === storedHash;
}
