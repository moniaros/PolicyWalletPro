# PolicyWallet ↔ Agent Platform Integration
## Quick Reference: Database Tables & API Specification

---

## PART 1: NEW DATABASE TABLES REQUIRED

### Table 1: `policies` (Move from mockData to persistent DB)

```sql
CREATE TABLE policies (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id),
  
  -- Policy Identification
  policy_number VARCHAR NOT NULL UNIQUE,
  carrier_id VARCHAR NOT NULL,
  provider_name VARCHAR NOT NULL,
  
  -- Classification
  policy_type VARCHAR NOT NULL, -- 'Health', 'Auto', 'Home', 'Life', 'Pet', 'Travel'
  lob VARCHAR NOT NULL, -- ACORD LOB code ('HLT', 'AUT', 'HOP', etc)
  
  -- Coverage Details
  coverage VARCHAR,
  premium DECIMAL(10,2),
  payment_frequency VARCHAR, -- 'Monthly', 'Semi-Annual', 'Annual'
  
  -- Dates
  effective_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  next_payment_due DATE,
  last_payment_date DATE,
  
  -- Status
  status VARCHAR DEFAULT 'Active', -- 'Active', 'Expired', 'Pending', 'Cancelled'
  pending_payments INTEGER DEFAULT 0,
  renewal_status VARCHAR, -- 'Due', 'Renewed', 'Lapsed'
  
  -- Metadata
  ace_properties JSONB, -- ACORD field mappings
  beneficiaries JSONB, -- Array of beneficiary objects
  source VARCHAR, -- 'Manual', 'Scan', 'API'
  
  -- Access Control
  is_visible_to_default_agent BOOLEAN DEFAULT TRUE,
  visible_to_agent_ids TEXT[], -- UUIDs of agents with access
  
  -- Tracking
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Table 2: `agent_user_relationships` (NEW)

```sql
CREATE TABLE agent_user_relationships (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id),
  agent_id VARCHAR NOT NULL, -- UUID from agent platform (no FK, external)
  
  -- Relationship Type
  relationship_type VARCHAR NOT NULL, -- 'DEFAULT', 'SECONDARY', 'REFERRING', 'SUPPORT'
  
  -- Access Control
  access_level VARCHAR NOT NULL DEFAULT 'READ_ONLY', -- 'READ_ONLY', 'EDIT', 'FULL'
  policy_access_level VARCHAR NOT NULL, -- 'ALL', 'SELECTED', 'NONE'
  allowed_policy_ids TEXT[], -- Array of policy IDs agent can access
  allowed_policy_types TEXT[], -- Array of policy types agent can access
  
  -- Permissions
  can_view_policies BOOLEAN DEFAULT TRUE,
  can_view_proposals BOOLEAN DEFAULT TRUE,
  can_create_proposals BOOLEAN DEFAULT FALSE,
  can_view_messages BOOLEAN DEFAULT TRUE,
  can_send_messages BOOLEAN DEFAULT FALSE,
  can_view_claims BOOLEAN DEFAULT FALSE,
  can_modify_notes BOOLEAN DEFAULT FALSE,
  can_schedule_appointment BOOLEAN DEFAULT FALSE,
  can_access_health_data BOOLEAN DEFAULT FALSE,
  
  -- Status
  status VARCHAR DEFAULT 'Active', -- 'Active', 'Archived', 'Suspended'
  assigned_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP, -- Optional: agent access expires
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, agent_id, relationship_type)
);
```

### Table 3: `proposals` (NEW)

```sql
CREATE TABLE proposals (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id),
  agent_id VARCHAR NOT NULL, -- UUID from agent platform
  
  -- Identification
  proposal_number VARCHAR NOT NULL UNIQUE,
  proposal_type VARCHAR NOT NULL, -- 'NEW_POLICY', 'UPGRADE', 'CONSOLIDATION', 'CLAIM_SUPPORT', 'WELLNESS'
  
  -- Content
  title VARCHAR NOT NULL,
  description TEXT,
  recommended_policies JSONB, -- Array of policies being proposed
  
  -- Risk/Profile Context (snapshot at time of proposal)
  based_on_risk_score INTEGER,
  based_on_risk_level VARCHAR,
  based_on_gaps TEXT[],
  based_on_life_stage VARCHAR,
  
  -- Financial
  estimated_annual_premium DECIMAL(10,2),
  estimated_monthly_cost DECIMAL(10,2),
  estimated_annual_savings DECIMAL(10,2),
  roi VARCHAR, -- e.g., 'Payback in 6 months'
  
  -- Status Tracking
  status VARCHAR DEFAULT 'DRAFT', -- 'DRAFT', 'SENT', 'VIEWED', 'DISCUSSED', 'ACCEPTED', 'REJECTED', 'EXPIRED'
  
  -- Dates
  created_at TIMESTAMP DEFAULT NOW(),
  sent_at TIMESTAMP,
  viewed_at TIMESTAMP,
  expires_at TIMESTAMP,
  responded_at TIMESTAMP,
  
  -- Follow-up
  follow_up_required BOOLEAN DEFAULT FALSE,
  follow_up_date TIMESTAMP,
  conversion_value DECIMAL(10,2), -- Revenue if accepted
  
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Table 4: `messages` (NEW)

```sql
CREATE TABLE messages (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id VARCHAR NOT NULL,
  
  -- Parties (one will be NULL - either agent or user)
  from_agent_id VARCHAR, -- UUID from agent platform (NULL if from user)
  from_user_id VARCHAR REFERENCES users(id), -- NULL if from agent
  to_agent_id VARCHAR, -- UUID from agent platform (NULL if to user)
  to_user_id VARCHAR REFERENCES users(id), -- NULL if to agent
  
  -- Content
  message_type VARCHAR NOT NULL, -- 'TEXT', 'PROPOSAL', 'DOCUMENT', 'VOICE', 'VIDEO', 'CALENDAR'
  content TEXT,
  attachment_urls TEXT[], -- URLs to attachments
  
  -- Context
  related_proposal_id VARCHAR REFERENCES proposals(id),
  related_policy_id VARCHAR REFERENCES policies(id),
  
  -- AI Features
  ai_sentiment VARCHAR, -- 'Positive', 'Neutral', 'Negative', 'Question'
  ai_category VARCHAR, -- 'Sales', 'Support', 'Claims', 'General'
  
  -- Status
  status VARCHAR DEFAULT 'Sent', -- 'Sent', 'Delivered', 'Viewed', 'Archived'
  viewed_at TIMESTAMP,
  
  -- Metadata
  channel VARCHAR, -- 'App', 'WhatsApp', 'Viber', 'Email', 'SMS'
  is_automated BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE conversations (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id),
  agent_id VARCHAR NOT NULL, -- UUID from agent platform
  
  subject VARCHAR,
  status VARCHAR DEFAULT 'Active', -- 'Active', 'Archived', 'Resolved'
  priority VARCHAR DEFAULT 'Normal', -- 'Low', 'Normal', 'High', 'Urgent'
  
  message_count INTEGER DEFAULT 0,
  last_message_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Table 5: `claims` (Enhanced existing structure)

```sql
CREATE TABLE claims (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id VARCHAR NOT NULL REFERENCES policies(id),
  user_id VARCHAR NOT NULL REFERENCES users(id),
  agent_id VARCHAR, -- UUID from agent platform (assigned claims handler)
  
  -- Claim Identification
  claim_number VARCHAR NOT NULL UNIQUE,
  incident_date DATE NOT NULL,
  reported_date DATE NOT NULL,
  claim_type VARCHAR NOT NULL, -- 'Medical', 'Accident', 'Theft', 'Damage', 'Other'
  
  -- Amounts
  claim_amount DECIMAL(10,2) NOT NULL,
  estimated_reserve DECIMAL(10,2),
  paid_amount DECIMAL(10,2) DEFAULT 0,
  
  -- Status (ACORD-compliant)
  status VARCHAR NOT NULL DEFAULT 'FNOL', -- 'FNOL', 'COVERAGE_REVIEW', 'APPRAISAL', 'APPROVED', 'PAID', 'DENIED'
  
  -- Support
  assigned_adjuster VARCHAR,
  contact_phone VARCHAR,
  documentation_required TEXT[],
  
  -- Agent Notifications
  notify_agent_on_new_claim BOOLEAN DEFAULT TRUE,
  notify_agent_on_status_update BOOLEAN DEFAULT TRUE,
  notify_agent_support_required BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Table 6: `access_audit_log` (Compliance)

```sql
CREATE TABLE access_audit_log (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id VARCHAR NOT NULL, -- UUID from agent platform
  user_id VARCHAR NOT NULL REFERENCES users(id),
  
  -- What was accessed
  data_type VARCHAR NOT NULL, -- 'PROFILE', 'POLICIES', 'RISK_ASSESSMENT', 'CLAIMS', 'HEALTH_DATA'
  resource_id VARCHAR, -- Specific record accessed
  
  -- Action
  action VARCHAR NOT NULL, -- 'VIEW', 'CREATE', 'UPDATE', 'DELETE'
  
  -- Authorization
  was_authorized BOOLEAN NOT NULL,
  denial_reason VARCHAR, -- If not authorized
  
  -- Technical
  ip_address VARCHAR,
  user_agent VARCHAR,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## PART 2: API ENDPOINTS REQUIRED

### Authentication (OAuth 2.0)

```
POST /api/auth/oauth/authorize
Body:
{
  "client_id": "agent-platform-id",
  "redirect_uri": "https://agent-platform.com/callback",
  "scope": "policies:read messages:read proposals:read proposals:write",
  "state": "random-state-string"
}

Response:
{
  "authorization_code": "auth-code-xyz",
  "expires_in": 600
}
```

```
POST /api/auth/oauth/token
Body:
{
  "grant_type": "authorization_code",
  "code": "auth-code-xyz",
  "client_id": "agent-platform-id",
  "client_secret": "secret-key",
  "redirect_uri": "https://agent-platform.com/callback"
}

Response:
{
  "access_token": "jwt-token",
  "refresh_token": "refresh-token",
  "expires_in": 3600
}
```

### Customer Data Endpoints

```
GET /api/customers/{userId}/profile
Header: Authorization: Bearer {token}

Response:
{
  "id": "user-123",
  "fullName": "John Doe",
  "dateOfBirth": "1982-03-15",
  "ageGroup": "41-50",
  "familyStatus": "Married",
  "dependents": 2,
  "incomeRange": "€60-100k",
  "healthStatus": "Good",
  "travelFrequency": "1-2 times/year",
  "occupationRisk": "Low risk",
  "lifeStageFactors": ["Mortgage", "Young children"],
  "currentCoverages": ["Health", "Auto", "Home"],
  "chronicConditions": []
}
```

```
GET /api/customers/{userId}/policies
Header: Authorization: Bearer {token}

Response:
[
  {
    "id": "policy-123",
    "policyNumber": "NN-ORANGE-992",
    "type": "Health",
    "provider": "NN Hellas",
    "coverage": "Unlimited / 100%",
    "premium": 145.00,
    "effectiveDate": "2025-01-01",
    "expiryDate": "2025-12-31",
    "status": "Active",
    "nextPaymentDue": "2025-12-01"
  }
]
```

```
GET /api/customers/{userId}/policies/{policyId}
Header: Authorization: Bearer {token}

Response:
{
  "id": "policy-123",
  "policyNumber": "NN-ORANGE-992",
  "type": "Health",
  "provider": "NN Hellas",
  "coverage": "Unlimited / 100%",
  "premium": 145.00,
  "effectiveDate": "2025-01-01",
  "expiryDate": "2025-12-31",
  "status": "Active",
  "beneficiaries": [
    {
      "name": "Spouse",
      "relation": "SP",
      "dob": "1985-05-12",
      "allocation": "50%"
    }
  ],
  "coverageLimits": {
    "Annual Aggregate Limit": "Unlimited",
    "Room & Board (Daily)": "100% (Private Room)"
  },
  "claims": [
    {
      "claimNumber": "CLM-NN-001",
      "status": "Paid",
      "amount": 450.00
    }
  ]
}
```

```
GET /api/customers/{userId}/risk-assessment
Header: Authorization: Bearer {token}

Response:
{
  "riskScore": 92,
  "riskLevel": "Low",
  "gaps": [
    "No disability insurance",
    "No life insurance (€1M risk)",
    "Pet insurance coverage"
  ],
  "recommendations": [
    "Add long-term disability (€40/mo)",
    "Add life insurance (€50/mo)",
    "Consider pet insurance (€15/mo)"
  ],
  "nextCheckupDue": "2026-01-15"
}
```

```
GET /api/customers/{userId}/proposals
Header: Authorization: Bearer {token}

Response:
[
  {
    "id": "prop-001",
    "proposalNumber": "PROP-AGENT-001",
    "type": "NEW_POLICY",
    "title": "Add Disability Insurance",
    "description": "...",
    "estimatedAnnualPremium": 480,
    "status": "SENT",
    "createdAt": "2025-11-28",
    "expiresAt": "2025-12-28",
    "agentId": "agent-456"
  }
]
```

```
GET /api/customers/{userId}/messages
Header: Authorization: Bearer {token}

Response:
{
  "conversations": [
    {
      "id": "conv-001",
      "agentId": "agent-456",
      "subject": "Health Insurance Review",
      "status": "Active",
      "lastMessageAt": "2025-11-29T14:30:00Z",
      "messages": [
        {
          "id": "msg-001",
          "fromAgentId": "agent-456",
          "content": "Hi John, I reviewed your health policy...",
          "channel": "App",
          "createdAt": "2025-11-29T10:00:00Z"
        }
      ]
    }
  ]
}
```

### Create/Update Endpoints

```
POST /api/customers/{userId}/proposals
Header: Authorization: Bearer {token}
Body:
{
  "type": "NEW_POLICY",
  "title": "Add Disability Insurance",
  "description": "Long-term disability coverage to protect income",
  "recommendedPolicies": [
    {
      "policyType": "Disability",
      "coverage": "€5,000/month replacement",
      "estimatedPremium": 40,
      "benefits": ["Income protection", "Job-search assistance", "Rehabilitation"]
    }
  ],
  "estimatedAnnualPremium": 480,
  "estimatedMonthlyCost": 40,
  "basedOnGaps": ["No disability insurance"]
}

Response:
{
  "id": "prop-001",
  "proposalNumber": "PROP-AGENT-001",
  "status": "DRAFT",
  "createdAt": "2025-11-29T15:00:00Z"
}
```

```
PUT /api/customers/{userId}/proposals/{proposalId}
Header: Authorization: Bearer {token}
Body:
{
  "status": "SENT"
}

Response:
{
  "id": "prop-001",
  "status": "SENT",
  "sentAt": "2025-11-29T15:05:00Z"
}
```

```
POST /api/customers/{userId}/messages
Header: Authorization: Bearer {token}
Body:
{
  "toAgentId": "agent-456",
  "messageType": "TEXT",
  "content": "Hi Maria, I'm interested in the disability insurance proposal.",
  "channel": "App"
}

Response:
{
  "id": "msg-001",
  "conversationId": "conv-001",
  "status": "Sent",
  "createdAt": "2025-11-29T15:10:00Z"
}
```

```
PUT /api/customers/{userId}/agent-permissions
Header: Authorization: Bearer {token}
Body:
{
  "agentId": "agent-456",
  "accessLevel": "READ_ONLY",
  "policyAccessLevel": "SELECTED",
  "allowedPolicyIds": ["policy-123", "policy-456"],
  "canViewProposals": true,
  "canViewMessages": true,
  "canCreateProposals": false
}

Response:
{
  "id": "rel-001",
  "agentId": "agent-456",
  "status": "Active",
  "permissions": {...}
}
```

### Webhook Endpoints (Sent by PolicyWallet to Agent Platform)

```
POST https://agent-platform.com/webhooks/proposal-status-changed
Body:
{
  "event": "proposal.status_changed",
  "proposalId": "prop-001",
  "userId": "user-123",
  "agentId": "agent-456",
  "oldStatus": "SENT",
  "newStatus": "ACCEPTED",
  "timestamp": "2025-11-29T16:00:00Z"
}
```

```
POST https://agent-platform.com/webhooks/message-received
Body:
{
  "event": "message.received",
  "messageId": "msg-001",
  "conversationId": "conv-001",
  "userId": "user-123",
  "agentId": "agent-456",
  "content": "I'm interested in that proposal",
  "timestamp": "2025-11-29T16:05:00Z"
}
```

---

## PART 3: ACCESS CONTROL MATRIX

| Action | Free Tier | Pro Tier | Agent | Security |
|--------|-----------|----------|-------|----------|
| **View all policies** | User ✓ | User ✓ | ✓ (if authorized) | Check agent_user_relationships |
| **View specific policy** | User ✓ | User ✓ | ✓ (in allowed list) | Check allowed_policy_ids |
| **View risk assessment** | User ✓ | User ✓ | ✓ (if can_view_policies) | Audit log access |
| **Create proposal** | Agent ✓ | Agent ✓ | ✓ (if can_create_proposals) | OAuth + permission check |
| **View proposals** | User ✓ | User ✓ | ✓ (if can_view_proposals) | Audit log access |
| **Send message** | Agent ✓ | Agent ✓ | ✓ (if can_send_messages) | OAuth + permission check |
| **View messages** | User ✓ | User ✓ | ✓ (if can_view_messages) | Audit log access |
| **View health data** | User ✓ | User ✓ | ✗ (never) | Explicit consent required |
| **Manage agent access** | ✗ | User ✓ | ✗ | User only |
| **Multi-agent** | ✗ | User ✓ | N/A | Pro feature |

---

## PART 4: WORKFLOW SCENARIOS

### Scenario 1: Free User, Single Agent (Default)

```
User Signs Up
  └─ Creates account
  └─ System auto-assigns "default agent" role
  └─ agent_user_relationships created:
      {
        relationship_type: "DEFAULT",
        can_view_policies: TRUE,
        can_create_proposals: FALSE,  ← Key: agent can't create proposals in free tier
        policy_access_level: "ALL"
      }

Agent Logs In:
  └─ OAuth flow: Agent Platform → PolicyWallet
  └─ Gets list of assigned customers
  └─ Clicks on customer "John Doe"
  └─ Requests: GET /api/customers/{userId}/policies
  └─ System checks: agent.can_view_policies == TRUE? YES ✓
  └─ Returns: All policies

Agent Creates Proposal:
  └─ Would normally do POST /api/customers/{userId}/proposals
  └─ System checks: agent.can_create_proposals == FALSE ✗
  └─ Returns: 403 Forbidden (Upgrade to Pro to create proposals)
```

### Scenario 2: Pro User, Multi-Agent with Permission Control

```
User Upgrades to Pro
  └─ Stripe payment successful
  └─ User subscription updated to "Pro"
  └─ New UI option appears: "Manage Agents"

User Invites Health Specialist (Agent A):
  └─ Enters Agent A's email
  └─ Creates agent_user_relationships:
      {
        agentId: "agent-A-123",
        relationship_type: "SECONDARY",
        can_create_proposals: TRUE,    ← Pro feature
        policy_access_level: "SELECTED",
        allowedPolicyIds: ["health-policy-123"],
        allowedPolicyTypes: ["Health"]
      }

User Invites Auto Specialist (Agent B):
  └─ Creates agent_user_relationships:
      {
        agentId: "agent-B-456",
        relationship_type: "SECONDARY",
        can_create_proposals: TRUE,
        policy_access_level: "SELECTED",
        allowedPolicyIds: ["auto-policy-456"],
        allowedPolicyTypes: ["Auto"]
      }

Agent A Logs In:
  └─ OAuth: Agent Platform → PolicyWallet
  └─ Requests: GET /api/customers/{userId}/policies
  └─ System checks:
      1. Is Agent A authorized? YES (in agent_user_relationships)
      2. What's their policy access level? SELECTED
      3. Return only: health-policy-123 (not auto-policy-456)
  └─ Agent A sees ONLY health policies

Agent A Creates Proposal:
  └─ POST /api/customers/{userId}/proposals
  └─ System checks: can_create_proposals == TRUE? YES ✓
  └─ Proposal created with status "DRAFT"
  └─ POST /api/customers/{userId}/proposals/{proposalId}
  └─ Body: { status: "SENT" }
  └─ Notification sent to User

User Reviews Proposal:
  └─ Sees Agent A's proposal
  └─ Options: Accept / Reject / Request More Info
  └─ Clicks "Accept"
  └─ PUT /api/customers/{userId}/proposals/{proposalId}
  └─ Body: { status: "ACCEPTED" }
  └─ Webhook sent to Agent Platform: proposal.status_changed

Agent A Receives Notification:
  └─ Webhook received: proposal.accepted
  └─ Commission can be calculated
  └─ Can send follow-up message via:
      POST /api/customers/{userId}/messages
```

---

## PART 5: IMPLEMENTATION PRIORITY

### MUST HAVE (MVP - Phase 1):
- [ ] Policies table (persistent database)
- [ ] agent_user_relationships (role-based access)
- [ ] OAuth 2.0 authentication
- [ ] Basic API endpoints (GET customer data, policies)
- [ ] Audit logging (compliance)

### SHOULD HAVE (Phase 2):
- [ ] Proposals table + API
- [ ] Messages table + API
- [ ] Multi-agent management UI
- [ ] Agent notifications

### NICE TO HAVE (Phase 3):
- [ ] Webhooks to agent platform
- [ ] Advanced analytics
- [ ] WhatsApp/Viber integration
- [ ] AI-powered recommendations

---

## PART 6: TESTING CHECKLIST

```
☐ Free Tier:
  ☐ Single agent can view all policies
  ☐ Agent cannot create proposals (403 error)
  ☐ Agent cannot send messages (403 error)

☐ Pro Tier:
  ☐ Multiple agents can be assigned
  ☐ Each agent sees only assigned policies
  ☐ Agent A cannot see Agent B's policies
  ☐ Agent can create proposals
  ☐ User can revoke agent access
  ☐ Audit log records all accesses

☐ OAuth Flow:
  ☐ Agent Platform → PolicyWallet authorization
  ☐ Token refresh works
  ☐ Expired token rejected

☐ Proposal Workflow:
  ☐ Agent creates proposal (DRAFT)
  ☐ Agent sends proposal (SENT)
  ☐ User receives notification
  ☐ User accepts proposal (ACCEPTED)
  ☐ Webhook sent to Agent Platform
  ☐ Commission tracked

☐ Data Security:
  ☐ Agent cannot access unauthorized policies
  ☐ Health data never shared
  ☐ Access attempts logged
  ☐ GDPR compliance verified

☐ Edge Cases:
  ☐ User revokes agent while proposal pending
  ☐ Agent relationship expires
  ☐ Policy expires mid-proposal
  ☐ Same user, multiple agent platforms
```

---

## PART 7: MIGRATION PATH FROM CURRENT STATE

```
Current: Policies in mockData.ts (frontend only)
    ↓
Step 1: Create policies table in PostgreSQL
    ↓
Step 2: Move policy data from mockData to database
    ↓
Step 3: Update frontend to fetch policies from API
    ↓
Step 4: Add agent_user_relationships table
    ↓
Step 5: Implement OAuth 2.0 integration
    ↓
Step 6: Build API endpoints for agent access
    ↓
Step 7: Test free tier (single agent, read-only)
    ↓
Step 8: Add proposals table + messaging
    ↓
Step 9: Test pro tier (multi-agent, permissions)
    ↓
Step 10: Deploy to production with feature flag
    ↓
Final: Launch to select agent partners for testing
```

---

## KEY METRICS TO TRACK POST-INTEGRATION

```
Agent Adoption:
├─ Agents logging in (daily/weekly)
├─ Customers viewed per agent (avg)
├─ Proposals created per agent (conversion pipeline)
├─ Proposals accepted (close rate %)

User Engagement:
├─ Users with agents assigned (%)
├─ Pro tier adoption rate (%)
├─ Agent message response time (hours)
├─ Proposal response rate (%)

Revenue:
├─ MRR from Pro subscriptions (€)
├─ Commission revenue from proposals (€)
├─ Customer lifetime value (€)
└─ Churn rate (%)
```

---

**Document Version:** 1.0  
**Last Updated:** November 29, 2025  
**Status:** Ready for Implementation
