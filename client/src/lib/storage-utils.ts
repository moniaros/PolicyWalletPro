/**
 * Efficient localStorage management utility
 * Handles data persistence, encryption simulation, and quota management
 */

const STORAGE_PREFIX = 'policyguard_';
const STORAGE_KEYS = {
  AUTH: `${STORAGE_PREFIX}auth`,
  LANGUAGE: `${STORAGE_PREFIX}language`,
  THEME: `${STORAGE_PREFIX}theme`,
  USER_PROFILE: `${STORAGE_PREFIX}user_profile`,
  POLICIES: `${STORAGE_PREFIX}policies`,
  APPOINTMENTS: `${STORAGE_PREFIX}appointments`,
  CLAIMS: `${STORAGE_PREFIX}claims`,
  SETTINGS: `${STORAGE_PREFIX}settings`,
  CACHE_TIMESTAMP: `${STORAGE_PREFIX}cache_timestamp`,
} as const;

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const storageUtils = {
  // Get item with TTL support
  getItem: (key: string, defaultValue?: any) => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return defaultValue;
      
      const parsed = JSON.parse(stored);
      if (parsed.timestamp && Date.now() - parsed.timestamp > CACHE_DURATION) {
        localStorage.removeItem(key);
        return defaultValue;
      }
      return parsed.data ?? parsed;
    } catch {
      return defaultValue;
    }
  },

  // Set item with optional TTL
  setItem: (key: string, value: any, withTimestamp = false) => {
    try {
      const data = withTimestamp 
        ? { data: value, timestamp: Date.now() }
        : value;
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.warn('localStorage quota exceeded', e);
      storageUtils.clearExpired();
      return false;
    }
  },

  // Remove item
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  // Clear all app-prefixed storage
  clear: () => {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(STORAGE_PREFIX))
        .forEach(key => localStorage.removeItem(key));
      return true;
    } catch {
      return false;
    }
  },

  // Clear expired items
  clearExpired: () => {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(STORAGE_PREFIX))
        .forEach(key => {
          try {
            const stored = localStorage.getItem(key);
            if (stored) {
              const parsed = JSON.parse(stored);
              if (parsed.timestamp && Date.now() - parsed.timestamp > CACHE_DURATION) {
                localStorage.removeItem(key);
              }
            }
          } catch {
            // Skip invalid entries
          }
        });
    } catch {
      // Ignore errors
    }
  },

  // Get storage usage
  getUsage: () => {
    let total = 0;
    for (let key in localStorage) {
      if (key.startsWith(STORAGE_PREFIX)) {
        total += localStorage.getItem(key)?.length ?? 0;
      }
    }
    return total;
  },

  // Typed getters
  getAuth: () => storageUtils.getItem(STORAGE_KEYS.AUTH),
  setAuth: (value: any) => storageUtils.setItem(STORAGE_KEYS.AUTH, value),
  
  getLanguage: () => storageUtils.getItem(STORAGE_KEYS.LANGUAGE, 'el'),
  setLanguage: (lang: string) => storageUtils.setItem(STORAGE_KEYS.LANGUAGE, lang),
  
  getTheme: () => storageUtils.getItem(STORAGE_KEYS.THEME, 'system'),
  setTheme: (theme: string) => storageUtils.setItem(STORAGE_KEYS.THEME, theme),
  
  getUserProfile: () => storageUtils.getItem(STORAGE_KEYS.USER_PROFILE),
  setUserProfile: (profile: any) => storageUtils.setItem(STORAGE_KEYS.USER_PROFILE, profile),
  
  getPolicies: () => storageUtils.getItem(STORAGE_KEYS.POLICIES, []),
  setPolicies: (policies: any) => storageUtils.setItem(STORAGE_KEYS.POLICIES, policies, true),
  
  getSettings: () => storageUtils.getItem(STORAGE_KEYS.SETTINGS, {}),
  setSettings: (settings: any) => storageUtils.setItem(STORAGE_KEYS.SETTINGS, settings),
};

export const STORAGE_KEYS_EXPORT = STORAGE_KEYS;
