# PolicyWallet Insurance Agent Portal - API Documentation

**Version:** 1.0.0  
**Base URL:** `https://policywall.replit.app/api`  
**Authentication:** JWT Bearer Token  
**Response Format:** JSON  
**Currency:** EUR (€)  

---

## Table of Contents
1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Health & Wellness](#health--wellness)
4. [Admin Dashboard](#admin-dashboard)
5. [Error Handling](#error-handling)
6. [Status Codes](#status-codes)
7. [Integration Guide](#integration-guide)

---

## Authentication

### Register New User
**POST** `/auth/register`

Create a new user account for an insurance agent or customer.

**Request:**
```json
{
  "username": "agent_name",
  "password": "secure_password",
  "email": "agent@insurer.gr"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid-string",
  "username": "agent_name",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error:** `400 Bad Request`
```json
{
  "error": "Username and password required"
}
```

---

### Login User
**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request:**
```json
{
  "username": "agent_name",
  "password": "secure_password"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid-string",
  "username": "agent_name",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error:** `401 Unauthorized`
```json
{
  "error": "Invalid credentials"
}
```

---

### Get Current User
**GET** `/auth/me`

Retrieve current authenticated user information.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "id": "uuid-string",
  "username": "agent_name",
  "role": "customer"
}
```

**Error:** `401 Unauthorized` - Invalid or missing token

---

## User Management

### Get User Profile
**GET** `/profile/{userId}`

Retrieve user profile information including insurance questionnaire responses.

**Parameters:**
- `userId` (path, required): UUID of the user

**Response:** `200 OK`
```json
{
  "id": "uuid-string",
  "userId": "uuid-string",
  "fullName": "Ιωάννης Παπαδόπουλος",
  "dateOfBirth": "1985-05-12",
  "ageGroup": "31-45",
  "familyStatus": "Παντρεμένος/η",
  "dependents": 2,
  "incomeRange": "€60-100k",
  "healthStatus": "Καλή",
  "emergencyFund": "Ναι, καλά καλυμμένο",
  "travelFrequency": "1-2 φορές το χρόνο",
  "occupationRisk": "Χαμηλός κίνδυνος (γραφειακή εργασία)",
  "currentCoverages": ["Health", "Auto", "Home"],
  "chronicConditions": [],
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-15T10:30:00Z"
}
```

**Error:** `404 Not Found` - User profile doesn't exist

---

### Create User Profile
**POST** `/profile`

Create a new user profile after questionnaire completion.

**Request:**
```json
{
  "userId": "uuid-string",
  "fullName": "Ιωάννης Παπαδόπουλος",
  "dateOfBirth": "1985-05-12",
  "ageGroup": "31-45",
  "familyStatus": "Παντρεμένος/η",
  "dependents": 2,
  "incomeRange": "€60-100k",
  "healthStatus": "Καλή",
  "emergencyFund": "Ναι, καλά καλυμμένο",
  "travelFrequency": "1-2 φορές το χρόνο",
  "occupationRisk": "Χαμηλός κίνδυνος (γραφειακή εργασία)",
  "currentCoverages": ["Health", "Auto", "Home"],
  "chronicConditions": []
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid-string",
  "userId": "uuid-string",
  "fullName": "Ιωάννης Παπαδόπουλος",
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-15T10:30:00Z"
}
```

---

### Update User Profile
**PUT** `/profile/{userId}`

Update existing user profile information.

**Parameters:**
- `userId` (path, required): UUID of the user

**Request:** (Any subset of fields)
```json
{
  "fullName": "Σοφία Παπαδοπούλου",
  "dependents": 3,
  "currentCoverages": ["Health", "Auto", "Home", "Life"]
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid-string",
  "userId": "uuid-string",
  "fullName": "Σοφία Παπαδοπούλου",
  "dependents": 3,
  "currentCoverages": ["Health", "Auto", "Home", "Life"],
  "updatedAt": "2025-01-15T14:20:00Z"
}
```

---

## Health & Wellness

### Get Health Checkups
**GET** `/health/checkups/{userId}`

Retrieve all health checkups for a user (sorted by date, most recent first).

**Parameters:**
- `userId` (path, required): UUID of the user

**Response:** `200 OK`
```json
[
  {
    "id": "uuid-string",
    "userId": "uuid-string",
    "checkupDate": "2025-01-10",
    "provider": "Health Center Athens",
    "checkupType": "Annual Physical",
    "results": "Excellent health status",
    "fileUrls": ["https://example.com/checkup-2025-01-10.pdf"],
    "createdAt": "2025-01-10T09:00:00Z"
  }
]
```

---

### Create Health Checkup
**POST** `/health/checkups`

Record a new health checkup.

**Request:**
```json
{
  "userId": "uuid-string",
  "checkupDate": "2025-01-10",
  "provider": "Health Center Athens",
  "checkupType": "Annual Physical",
  "results": "Excellent health status",
  "fileUrls": ["https://example.com/checkup-2025-01-10.pdf"]
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid-string",
  "userId": "uuid-string",
  "checkupDate": "2025-01-10",
  "provider": "Health Center Athens",
  "createdAt": "2025-01-10T09:00:00Z"
}
```

---

### Get Health Metrics
**GET** `/health/metrics/{checkupId}`

Retrieve health metrics for a specific checkup.

**Parameters:**
- `checkupId` (path, required): UUID of the checkup

**Response:** `200 OK`
```json
{
  "id": "uuid-string",
  "checkupId": "uuid-string",
  "bloodPressure": "120/80",
  "cholesterol": "180 mg/dL",
  "bmi": 24.5,
  "glucose": "95 mg/dL",
  "weight": 75,
  "height": 175,
  "createdAt": "2025-01-10T09:00:00Z"
}
```

---

### Create Health Metrics
**POST** `/health/metrics`

Add health metrics data for a checkup.

**Request:**
```json
{
  "checkupId": "uuid-string",
  "bloodPressure": "120/80",
  "cholesterol": "180 mg/dL",
  "bmi": 24.5,
  "glucose": "95 mg/dL",
  "weight": 75,
  "height": 175
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid-string",
  "checkupId": "uuid-string",
  "bloodPressure": "120/80",
  "createdAt": "2025-01-10T09:00:00Z"
}
```

---

### Get Risk Assessment
**GET** `/health/risk-assessment/{userId}`

Retrieve the latest risk assessment for a user (ACORD-compliant scoring).

**Parameters:**
- `userId` (path, required): UUID of the user

**Response:** `200 OK`
```json
{
  "id": "uuid-string",
  "userId": "uuid-string",
  "riskScore": 45,
  "riskLevel": "Moderate",
  "healthFactors": {
    "age": 45,
    "bmi": 25,
    "conditions": []
  },
  "recommendations": [
    "Schedule annual health screening",
    "Monitor blood pressure regularly"
  ],
  "nextCheckupDue": "2025-10-10T00:00:00Z",
  "calculatedAt": "2025-01-10T10:30:00Z"
}
```

**Risk Levels:**
- `Low` (0-49): Minimal health risk
- `Moderate` (50-69): Standard health management recommended
- `High` (70-100): Immediate healthcare consultation required

---

### Calculate Risk Assessment
**POST** `/health/risk-assessment`

Calculate risk score based on health factors (ACORD-compliant model).

**Request:**
```json
{
  "userId": "uuid-string",
  "healthFactors": {
    "age": 45,
    "bmi": 25,
    "conditions": ["diabetes"]
  }
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid-string",
  "userId": "uuid-string",
  "riskScore": 55,
  "riskLevel": "Moderate",
  "healthFactors": {
    "age": 45,
    "bmi": 25,
    "conditions": ["diabetes"]
  },
  "recommendations": [
    "Schedule semi-annual health screening",
    "Regular glucose monitoring and specialist visits"
  ],
  "nextCheckupDue": "2025-04-10T00:00:00Z",
  "calculatedAt": "2025-01-10T10:30:00Z"
}
```

---

### Get Preventive Recommendations
**GET** `/health/recommendations/{userId}`

Retrieve active preventive health recommendations for a user.

**Parameters:**
- `userId` (path, required): UUID of the user

**Response:** `200 OK`
```json
[
  {
    "id": "uuid-string",
    "userId": "uuid-string",
    "category": "Screening",
    "title": "Annual Health Checkup",
    "description": "Schedule your yearly comprehensive health screening to monitor vital health indicators.",
    "priority": "High",
    "coverageStatus": "Covered",
    "createdAt": "2025-01-10T00:00:00Z"
  }
]
```

---

### Create Preventive Recommendation
**POST** `/health/recommendations`

Add a new preventive health recommendation.

**Request:**
```json
{
  "userId": "uuid-string",
  "category": "Screening",
  "title": "Annual Health Checkup",
  "description": "Schedule your yearly comprehensive health screening.",
  "priority": "High",
  "coverageStatus": "Covered"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid-string",
  "userId": "uuid-string",
  "category": "Screening",
  "title": "Annual Health Checkup",
  "priority": "High",
  "createdAt": "2025-01-10T00:00:00Z"
}
```

---

### Mark Recommendation as Complete
**PATCH** `/health/recommendations/{id}/complete`

Mark a preventive recommendation as completed.

**Parameters:**
- `id` (path, required): UUID of the recommendation

**Response:** `200 OK`
```json
{
  "id": "uuid-string",
  "userId": "uuid-string",
  "category": "Screening",
  "title": "Annual Health Checkup",
  "completedAt": "2025-01-15T14:30:00Z"
}
```

---

## Admin Dashboard

### Get Admin Statistics
**GET** `/admin/stats`

Retrieve high-level insurance platform analytics (Admin role required).

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response:** `200 OK`
```json
{
  "totalUsers": 2400,
  "activePolicies": 1800,
  "pendingClaims": 240,
  "claimsApproved": "92%"
}
```

**Error:** `403 Forbidden` - Non-admin users cannot access

---

## Error Handling

### Standard Error Response
All errors follow this format:

```json
{
  "error": "Error description in English",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common Error Messages

| Error | Status | Cause |
|-------|--------|-------|
| Username and password required | 400 | Missing authentication fields |
| Invalid credentials | 401 | Wrong password or non-existent user |
| User already exists | 400 | Username taken |
| Invalid checkup data | 400 | Malformed health checkup request |
| Invalid metrics data | 400 | Malformed health metrics request |
| Failed to fetch profile | 500 | Server error retrieving profile |
| Failed to update profile | 400 | Invalid profile update data |

---

## Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET or PATCH request |
| 201 | Created | Successful POST request (resource created) |
| 400 | Bad Request | Invalid request data or missing required fields |
| 401 | Unauthorized | Missing, invalid, or expired authentication token |
| 403 | Forbidden | Authenticated but insufficient permissions (e.g., non-admin accessing admin endpoints) |
| 404 | Not Found | Requested resource does not exist |
| 500 | Internal Server Error | Server-side error |

---

## Integration Guide

### For Insurance Agents

#### 1. Authentication Flow
```bash
# Step 1: Register or Login
curl -X POST https://policywall.replit.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "agent_name", "password": "password"}'

# Store the returned JWT token

# Step 2: Use token in subsequent requests
curl -X GET https://policywall.replit.app/api/auth/me \
  -H "Authorization: Bearer {token}"
```

#### 2. Customer Profile Management
```bash
# Get customer profile
curl -X GET https://policywall.replit.app/api/profile/{customerId} \
  -H "Authorization: Bearer {token}"

# Update customer profile
curl -X PUT https://policywall.replit.app/api/profile/{customerId} \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"currentCoverages": ["Health", "Auto", "Home"]}'
```

#### 3. Health & Risk Assessment
```bash
# Get customer risk assessment
curl -X GET https://policywall.replit.app/api/health/risk-assessment/{customerId} \
  -H "Authorization: Bearer {token}"

# Calculate new risk assessment
curl -X POST https://policywall.replit.app/api/health/risk-assessment \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "{customerId}",
    "healthFactors": {
      "age": 45,
      "bmi": 25,
      "conditions": []
    }
  }'
```

#### 4. Gap Analysis Integration
Risk scores map to insurance recommendations:
- **Low (0-49):** Basic coverage needs
- **Moderate (50-69):** Enhanced coverage recommended
- **High (70-100):** Comprehensive coverage + specialist consultation

---

### For Portal Integration

#### Authentication Headers
Always include:
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

#### Rate Limiting
- No rate limits currently implemented
- Recommended: Implement client-side rate limiting (max 100 requests/minute)

#### CORS Policy
- Supports CORS for integration with external portals
- Configure CORS origins in production environment

#### Audit Logging
- All user activities are logged with timestamps
- Logs include: user ID, action type, resource, and changes made
- Retention: 365 days (configurable)

---

### Response Format Standards

**DateTime Format:** ISO 8601 (UTC)
```json
"2025-01-15T14:30:00Z"
```

**Currency:** EUR (€) - Always use EUR for financial values
```json
"premium": "€145.00"
```

**UUIDs:** RFC 4122 v4 format
```json
"id": "550e8400-e29b-41d4-a716-446655440000"
```

---

## Security

### Authentication
- JWT tokens issued with 24-hour expiration
- Token refresh endpoint (planned for v1.1)

### Authorization
- Role-based access control (RBAC)
- Admin-only endpoints protected by `adminMiddleware`
- User can only access own profile data

### Data Protection
- All sensitive data encrypted at rest
- HTTPS required for production
- GDPR-compliant data handling

---

## Compliance

### ACORD Standards
- Risk assessment follows ACORD-compliant scoring model
- Policy codes align with ACORD LOB (Line of Business) classifications
- Data structure compatible with industry-standard insurance systems

### Insurance Codes
- **Health (HLT):** κλάδος υγείας
- **Auto (AUT):** κλάδος αυτοκινήτου
- **Home (HOM):** κλάδος κατοικίας
- **Life (LIF):** κλάδος ζωής
- **Pet (PET):** ασφάλεια κατοικιδίων

---

## Support & Versioning

**Current Version:** 1.0.0  
**Last Updated:** November 27, 2025  
**Support Email:** agents@policywall.gr  

### Planned Enhancements (v1.1)
- Token refresh endpoints
- Policy management endpoints
- Claims submission API
- Appointment booking API
- Bulk customer import

---

**End of Documentation**
