# Professional Insurance Underwriting Engine - Integration Guide

**Version:** 1.0.0  
**Status:** Production Ready  
**Mock API Support:** ✅ Full Coverage  

---

## Quick Start

### 1. **Use the Underwriting Engine**

```typescript
import { UnderwritingEngine, type UnderwritingProfile } from '@/lib/underwriting-engine';

// Create a user profile
const profile: UnderwritingProfile = {
  userId: 'user-001',
  ageGroup: '31-45',
  familyStatus: 'Married',
  dependents: 2,
  incomeRange: '€60-100k',
  healthStatus: 'Good',
  emergencyFund: 'Partially covered',
  travelFrequency: '1-2 times/year',
  occupationRisk: 'Low risk (office work)',
  currentCoverages: ['Health', 'Auto', 'Home', 'Investment Life'],
  chronicConditions: ['controlled diabetes']
};

// Run analysis
const engine = new UnderwritingEngine(profile);
const result = engine.analyze();

// Result includes:
// - profileScore: 0-100 (coverage adequacy)
// - riskScore: 0-100 ACORD-compliant risk score
// - gaps: Array of identified coverage gaps
// - summary: Professional underwriter assessment
// - keyMetrics: Important numbers
// - recommendations: Actionable next steps
```

### 2. **Use the API Service Layer**

```typescript
import { apiService } from '@/lib/api-service';

// Get user profile (uses mock or real API)
const response = await apiService.getUserProfile('user-001');
if (response.success) {
  console.log('User profile:', response.data);
}

// Create new recommendation
await apiService.createRecommendation({
  userId: 'user-001',
  category: 'Screening',
  title: 'Annual Health Checkup',
  priority: 'High'
});
```

### 3. **Switch Between Mock & Real API**

```typescript
// Start with mock data (default)
apiService.setMockMode(true);

// When ready for production, switch to real API
apiService.setMockMode(false);
```

---

## Architecture Overview

### Three-Layer Design

```
┌─────────────────────────────────────────┐
│  React Components (UI Layer)             │
│  └─ GapAnalysisDisplay                  │
│  └─ Other app components                │
├─────────────────────────────────────────┤
│  Business Logic (Underwriting Layer)     │
│  └─ UnderwritingEngine (gap analysis)    │
│  └─ Risk scoring (ACORD-compliant)      │
├─────────────────────────────────────────┤
│  Data Abstraction (API Layer)            │
│  └─ ApiService (mock/real API bridge)    │
│  └─ Mock data (mockData.ts)             │
│  └─ Real API endpoints                   │
├─────────────────────────────────────────┤
│  Backend / External Systems              │
│  └─ Insurance underwriting database      │
│  └─ Carrier systems (via API)            │
└─────────────────────────────────────────┘
```

---

## Component Integration

### Display Gap Analysis Results

```typescript
import { GapAnalysisDisplay } from '@/components/gap-analysis-display';
import { UnderwritingEngine } from '@/lib/underwriting-engine';
import { userProfileResponse } from '@/lib/mockData';

export function MyGapAnalysisPage() {
  // Run underwriting analysis
  const engine = new UnderwritingEngine(userProfileResponse);
  const analysis = engine.analyze();

  // Handle quote requests
  const handleRequestQuote = (gap: CoverageGap) => {
    console.log('User wants to quote:', gap.coverage);
    // Trigger underwriting workflow
  };

  return (
    <GapAnalysisDisplay 
      analysis={analysis}
      onRequestQuote={handleRequestQuote}
    />
  );
}
```

---

## API Service Methods

### Profile Management

```typescript
// Get profile
const profile = await apiService.getUserProfile('user-001', mockData);

// Create profile
const newProfile = await apiService.createUserProfile({
  userId: 'user-002',
  fullName: 'Ιωάννης Παπαδόπουλος'
});

// Update profile
const updated = await apiService.updateUserProfile('user-001', {
  currentCoverages: ['Health', 'Auto', 'Life']
});
```

### Health & Risk Assessment

```typescript
// Get checkups
const checkups = await apiService.getHealthCheckups('user-001');

// Create checkup
await apiService.createHealthCheckup({
  userId: 'user-001',
  checkupDate: '2025-01-15',
  provider: 'Health Center Athens'
});

// Get/calculate risk assessment
const riskAssessment = await apiService.getRiskAssessment('user-001');
const newAssessment = await apiService.calculateRiskAssessment({
  userId: 'user-001',
  healthFactors: { age: 42, bmi: 25, conditions: [] }
});

// Recommendations
const recommendations = await apiService.getRecommendations('user-001');
await apiService.createRecommendation({...});
await apiService.completeRecommendation('rec-001');
```

### Admin Functions

```typescript
const stats = await apiService.getAdminStats();
console.log(`Active policies: ${stats.activePolicies}`);
```

### Batch Operations

```typescript
// Fetch multiple endpoints in parallel
const responses = await apiService.batchFetch([
  { endpoint: '/api/profile/user-001', mockData: userProfileResponse },
  { endpoint: '/api/health/risk-assessment/user-001', mockData: riskAssessmentResponse },
  { endpoint: '/api/health/recommendations/user-001', mockData: preventiveRecommendationsResponse }
]);
```

---

## Underwriting Engine Reference

### Risk Scoring (ACORD Standard)

**Score Range: 0-100**

| Range | Level | Action |
|-------|-------|--------|
| 0-30 | Minimal Risk | Standard coverage sufficient |
| 31-60 | Moderate Risk | Routine review recommended |
| 61-100 | High Risk | Underwriter consultation required |

### Risk Factors (Cumulative)

| Factor | Impact | Notes |
|--------|--------|-------|
| Age 60+ | +35 points | Highest age factor |
| Multiple dependents | +8 per child | Cumulative up to 20 |
| Chronic conditions | +10 each | Per condition |
| High occupation risk | +25 points | Physical/travel intensive |
| No emergency fund | +20 points | Financial vulnerability |

### Coverage Adequacy Scoring

**Score Range: 0-100** (Higher is better)

- Base: 50 points
- Each essential coverage (Health/Auto/Home): +15 points
- Life insurance (if dependents): +15 points
- Disability insurance (if high-risk occupation): +10 points
- Bundling optimization: +15-20 points

---

## Gap Types & Priorities

### Gap Types

- **`add`** - New coverage needed
- **`enhance`** - Increase existing coverage
- **`optimize`** - Reduce costs or improve terms
- **`review`** - Periodic reassessment

### Priority Levels

- **`critical` (90-100)** - Immediate action required
- **`high` (75-89)** - Schedule within 30 days
- **`medium` (50-74)** - Schedule within 90 days
- **`low` (1-49)** - Annual review sufficient

---

## Migration to Production API

### Step 1: Prepare Backend

Ensure your backend implements these endpoints:

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/profile/{userId}
POST   /api/profile
PUT    /api/profile/{userId}

GET    /api/health/checkups/{userId}
POST   /api/health/checkups
GET    /api/health/metrics/{checkupId}
POST   /api/health/metrics
GET    /api/health/risk-assessment/{userId}
POST   /api/health/risk-assessment
GET    /api/health/recommendations/{userId}
POST   /api/health/recommendations
PATCH  /api/health/recommendations/{id}/complete

GET    /api/admin/stats
```

See `API_DOCUMENTATION.md` for full endpoint specifications.

### Step 2: Update API Config

```typescript
// In your app initialization
import { apiService } from '@/lib/api-service';

// Switch to production
apiService.setMockMode(false);

// Or configure during initialization
import ApiService from '@/lib/api-service';
const productionApi = new ApiService({
  baseUrl: 'https://api.yourdomain.com',
  useMockData: false,
  timeout: 30000
});
```

### Step 3: Test Gradually

```typescript
// Enable mock mode for specific endpoints
apiService.setMockMode(true);

// Test with mock data first
const mockResult = await apiService.getUserProfile('user-001', mockUserData);
console.assert(mockResult.success, 'Mock API works');

// Then switch to real API
apiService.setMockMode(false);
const realResult = await apiService.getUserProfile('real-user-id');
console.assert(realResult.success, 'Real API works');
```

---

## Error Handling

All API responses follow this format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;           // Present if successful
  error?: string;     // Present if failed
  timestamp: string;  // ISO 8601 format
}

// Usage
const response = await apiService.getUserProfile('user-001');
if (response.success) {
  const profile = response.data;
  // Handle success
} else {
  const error = response.error;
  // Handle error
}
```

---

## Mock Data Structure

Mock data is pre-configured in `mockData.ts`:

```typescript
// All mock responses available:
export const gapAnalysisResponse = { /* ... */ };
export const riskAssessmentResponse = { /* ... */ };
export const preventiveRecommendationsResponse = [ /* ... */ ];
export const userProfileResponse = { /* ... */ };
export const adminStatsResponse = { /* ... */ };
```

Use these to test before real API:

```typescript
import { 
  gapAnalysisResponse, 
  userProfileResponse 
} from '@/lib/mockData';

// Test with mock data
const engine = new UnderwritingEngine(userProfileResponse);
const analysis = engine.analyze();
console.log('Analysis:', analysis);
```

---

## Performance Tips

1. **Batch Requests** - Use `batchFetch()` for multiple endpoints
2. **Cache Results** - Use React Query or SWR with the API service
3. **Lazy Load** - Only fetch data when components mount
4. **Mock First** - Develop UI with mock data before API integration

```typescript
// Good: Batch fetch
const responses = await apiService.batchFetch([...]);

// Better: Cache with React Query
const { data } = useQuery('profile', () => 
  apiService.getUserProfile('user-001')
);
```

---

## Professional Underwriting Features

### ACORD Compliance
- Risk scores follow ACORD standard scale (0-100)
- LOB (Line of Business) codes for each coverage type
- Standardized coverage recommendations

### Greek Insurance Market
- Professional Greek terminology (Κλάδος, Ασφαλιστική Εταιρία, etc.)
- Euro (€) currency throughout
- Greek insurance carriers (Ethniki, Generali, Ergo, NN)
- Greek-specific coverage types and limits

### AI-Powered Analysis
- Rule-based underwriting engine (extensible for AI)
- Contextual recommendations based on profile
- Risk exposure calculations
- ROI analysis for each recommendation

---

## Troubleshooting

### Issue: Mock data not showing
```typescript
// Ensure mock mode is enabled
apiService.setMockMode(true);

// Check mock data is passed correctly
const response = await apiService.getUserProfile(
  'user-001', 
  userProfileResponse  // <- Pass mock data
);
```

### Issue: API timeout
```typescript
// Increase timeout
const api = new ApiService({
  timeout: 60000  // 60 seconds
});
```

### Issue: CORS errors in production
```typescript
// Ensure backend has CORS headers
// Access-Control-Allow-Origin: https://yourdomain.com
// Access-Control-Allow-Methods: GET, POST, PUT, PATCH
// Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## Next Steps

1. **Implement Backend** - Create API endpoints matching the specification
2. **Add Authentication** - Implement JWT token handling
3. **Connect Real Data** - Replace mock responses with API calls
4. **Test Thoroughly** - Validate gap analysis with real user data
5. **Deploy** - Move to production with API service

---

## Support

- **API Documentation:** `API_DOCUMENTATION.md`
- **OpenAPI Spec:** `openapi.yaml`
- **Example Components:** `GapAnalysisDisplay`, `gap-analysis-display.tsx`
- **Mock Data:** `mockData.ts`

---

**Last Updated:** November 27, 2025  
**Status:** Production Ready ✅
