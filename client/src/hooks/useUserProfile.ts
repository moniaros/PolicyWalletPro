import { useEffect, useState } from "react";

export interface UserProfileData {
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
}

export function useUserProfile(): UserProfileData | null {
  const [profile, setProfile] = useState<UserProfileData | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("userProfile");
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile({
          fullName: parsed.fullName,
          dateOfBirth: parsed.dateOfBirth,
          ageGroup: parsed.ageGroup,
          familyStatus: parsed.familyStatus,
          dependents: parseInt(parsed.dependents) || 0,
          incomeRange: parsed.incomeRange,
          healthStatus: parsed.healthStatus,
          emergencyFund: parsed.emergencyFund,
          travelFrequency: parsed.travelFrequency,
          occupationRisk: parsed.occupationRisk,
          lifeStageFactors: parsed.lifeStageFactors || [],
          currentCoverages: parsed.currentCoverages || [],
          chronicConditions: parsed.chronicConditions || [],
        });
      }
    } catch (error) {
      console.error("Failed to load user profile:", error);
    }
  }, []);

  return profile;
}
