# PolicyWallet ↔ Agent Platform Integration Strategy
## Digital Product Architecture & Data Sharing Model

**Document Type:** Strategic Product Architecture (No Code)  
**Date:** November 29, 2025  
**Audience:** Product Managers, Architects, Stakeholders  
**Status:** Recommendation for Review

---

## EXECUTIVE SUMMARY

### Current State Assessment
**PolicyWallet Capabilities:**
- ✅ Multi-policy aggregation (4+ insurers: NN Hellas, Generali, ERGO, NN)
- ✅ Rich user profiling (demographic, financial, health risk assessment)
- ✅ AI gap analysis engine (ACORD-compliant risk scoring)
- ✅ Appointment booking & health wellness tracking
- ✅ Claims management visibility
- ⚠️ **CRITICAL GAP:** No persistent policy storage (mockData only)
- ⚠️ **CRITICAL GAP:** No agent relationship model
- ⚠️ **CRITICAL GAP:** No message/communication tracking
- ⚠️ **CRITICAL GAP:** No proposal/recommendation tracking
- ⚠️ **CRITICAL GAP:** No multi-agent access control

### Agent Platform Requirements
To enable deep PolicyWallet ↔ Agent Platform integration, agents need:
1. **Real-time visibility** into assigned customers' policies, coverage, and gaps
2. **Smart recommendations** based on user profile + risk assessment + policy gaps
3. **Communication history** (proposals, messages, interactions)
4. **Access control** (default agent vs. multiple agents, policy-level permissions)
5. **Pro features** (multi-agent collaboration, advanced analytics)

### Revenue Impact Opportunity
- **Free Tier:** Single agent access, read-only policies
- **Pro Tier:** Multiple agents, permission control, advanced recommendations
- **Enterprise:** API access, white-label, SLA support

---

## INTEGRATION ARCHITECTURE OVERVIEW

### Current Gap: Why Integration is Complex

```
Current Architecture:
┌─────────────────────┐
│   PolicyWallet      │
│   (User-Centric)    │
│                     │
│ ✓ Users             │
│ ✓ Health Data       │
│ ✓ Risk Assessment   │
│ ✓ Appointments      │
│ ✗ Policies (mock)   │
│ ✗ Agents            │
│ ✗ Messages          │
│ ✗ Proposals         │
└─────────────────────┘

Required for Integration:
        ↕ (Bi-directional Sync)
        
┌─────────────────────┐
│  Agent Platform     │
│  (Agent-Centric)    │
│                     │
│ ✓ Agent Profiles    │
│ ✓ Assignments       │
│ ✓ Sales Pipeline    │
│ ? Customer Data     │
│ ? Policy Data       │
│ ? Communication     │
└─────────────────────┘
```

### Solution: Unified Data Layer with Role-Based Access

```
After Integration:

        ┌──────────────────────────────┐
        │   Shared Data Layer          │
        │   (Sync Engine)              │
        │                              │
        │ • Policies                   │
        │ • Proposals                  │
        │ • Messages                   │
        │ • Agent-User Relationships   │
        │ • Access Permissions         │
        └──────────────────────────────┘
                    ↕ ↕
         ┌──────────┴──────────┐
         │                     │
    ┌────────────┐     ┌──────────────┐
    │PolicyWallet│     │Agent Platform│
    │  (Users)   │     │   (Agents)   │
    └────────────┘     └──────────────┘
```

---

## PHASE 1: CRITICAL DATA THAT MUST BE SHARED

### 1.1 Policy Data (Core)
**Currently:** Stored in mockData.ts (frontend only) - NOT PERSISTENT  
**Required:** Move to PostgreSQL database

**Policy Record Structure:**
```
Policy {
  id: UUID (primary key)
  userId: UUID (policy holder)
  carrierId: string (e.g., "NN-GR-001")
  policyNumber: string (e.g., "NN-ORANGE-992")
  type: enum ("Health", "Auto", "Home", "Life", "Pet", "Travel")
  lob: string (ACORD line of business code)
  provider: string (insurer name)
  status: enum ("Active", "Expired", "Pending", "Cancelled")
  
  // Coverage Details
  coverage: string (e.g., "Unlimited / 100%")
  premium: decimal (€)
  paymentFrequency: enum ("Monthly", "Quarterly", "Semi-Annual", "Annual")
  effectiveDate: date
  expiryDate: date
  nextPaymentDue: date
  lastPaymentDate: date
  
  // Metadata (ACORD Compliance)
  aceProperties: jsonb (ACORD field mappings)
  beneficiaries: array of { name, relation_code, dob, allocation%, primary }
  
  // Status Tracking
  pendingPayments: integer
  renewalStatus: enum ("Due", "Renewed", "Lapsed")
  
  // Accessibility
  isVisibleToDefaultAgent: boolean
  isVisibleToAgentIds: array of UUID (for multi-agent access)
  
  // Metadata
  createdAt: timestamp
  updatedAt: timestamp
  source: enum ("Manual", "Scan", "InsureSync", "API")
}
```

**Why Agents Need This:**
- **Revenue Generation:** See coverage gaps, recommend upgrades (bundle discounts)
- **Claims Support:** Understand what user is covered for
- **Retention:** Track expiring policies, proactive renewal outreach
- **Compliance:** Document what was offered/recommended to customer

### 1.2 Agent-User Relationship (NEW)
**Why:** Answer "Who can access what?"

```
AgentUserRelationship {
  id: UUID
  userId: UUID (policy holder)
  agentId: UUID (from agent platform)
  
  // Relationship Type
  relationshipType: enum {
    "DEFAULT" → Primary agent (free tier)
    "SECONDARY" → Additional agent (pro tier)
    "REFERRING" → Referred the customer
    "SUPPORT" → Support/claims handling
  }
  
  // Access Scope
  accessLevel: enum {
    "READ_ONLY" → Can view policies, not modify
    "EDIT" → Can modify proposals, notes
    "FULL" → Can access all features
  }
  
  // Policy Visibility
  policyAccessLevel: enum {
    "ALL" → Can see all customer policies
    "SELECTED" → Only policies in allowedPolicyIds
    "NONE" → No policy access
  }
  
  allowedPolicyIds: array of UUID (specific policies agent can see)
  allowedPolicyTypes: array of string (e.g., ["Health", "Auto"])
  
  // Status
  status: enum ("Active", "Archived", "Suspended")
  
  // Permissions (Feature Access)
  permissions: {
    canViewPolicies: boolean
    canViewProposals: boolean
    canCreateProposals: boolean
    canViewMessages: boolean
    canSendMessages: boolean
    canViewClaims: boolean
    canModifyNotes: boolean
    canScheduleAppointment: boolean
    canAccessHealthData: boolean (sensitive)
  }
  
  // Timestamps
  assignedAt: timestamp
  expiresAt: timestamp (optional - agent access expires)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Why This Matters:**
- **Pro Version:** Multiple agents with different access levels
- **Security:** User controls what each agent can see
- **Compliance:** GDPR - audit trail of who accessed what
- **Sales:** Enables multi-agency support without data leaks

### 1.3 Proposals (NEW)
**Why:** Track agent recommendations → conversions

```
Proposal {
  id: UUID
  userId: UUID
  agentId: UUID
  
  // Proposal Details
  proposalNumber: string (e.g., "PROP-AGENT-001")
  type: enum {
    "NEW_POLICY" → Suggesting new coverage
    "UPGRADE" → Upgrade existing policy
    "CONSOLIDATION" → Bundle recommendation
    "CLAIM_SUPPORT" → Claims assistance
    "WELLNESS" → Health/preventive recommendation
  }
  
  // What's Being Proposed
  title: string (e.g., "Add Disability Insurance")
  description: text
  recommendedPolicies: array of {
    policyType: string
    coverage: string
    estimatedPremium: decimal (€)
    annualCost: decimal (€)
    benefits: string[]
    estimatedSavings: decimal (if bundle)
  }
  
  // Current Profile Data (snapshot at proposal time)
  basedOnRiskScore: integer (0-100)
  basedOnRiskLevel: string ("Low", "Moderate", "High")
  basedOnGaps: string[] (coverage gaps identified)
  basedOnLifeStage: string (e.g., "Young Family with Mortgage")
  
  // Financial Impact
  estimatedAnnualPremium: decimal (€)
  estimatedMonthlyCost: decimal (€)
  estimatedAnnualSavings: decimal (if consolidation)
  ROI: string (e.g., "Payback in 6 months")
  
  // Interaction Tracking
  status: enum {
    "DRAFT" → Agent creating
    "SENT" → Delivered to customer
    "VIEWED" → Customer opened/viewed
    "DISCUSSED" → In conversation
    "ACCEPTED" → Customer agreed
    "REJECTED" → Customer declined
    "EXPIRED" → Proposal outdated
  }
  
  // Timeline
  createdAt: timestamp
  sentAt: timestamp
  viewedAt: timestamp
  expiresAt: timestamp (30 days default)
  respondedAt: timestamp
  
  // Follow-up
  followUpRequired: boolean
  followUpDate: timestamp
  conversionValue: decimal (€ if accepted)
}
```

**Why Agents Need This:**
- **Sales Pipeline:** Track proposal status → conversion metrics
- **Follow-up:** Know which proposals need attention
- **Commission Tracking:** Link recommendations to conversions
- **User Engagement:** Show users their pending proposals

### 1.4 Messages & Communication (NEW)
**Why:** Keep record of all agent-customer interactions

```
Message {
  id: UUID
  conversationId: UUID (groups messages)
  
  // Parties
  fromAgentId: UUID (or NULL if from user)
  fromUserId: UUID (or NULL if from agent)
  
  // Content
  messageType: enum {
    "TEXT" → Plain message
    "PROPOSAL" → Proposal shared
    "DOCUMENT" → Policy/claim document
    "VOICE" → Voice message transcription
    "VIDEO" → Video call reference
    "CALENDAR" → Meeting invitation
  }
  
  content: text
  attachmentUrls: array of string (proposal PDFs, policy documents)
  
  // AI-Powered Features
  relatedProposalId: UUID (if referencing proposal)
  relatedPolicyId: UUID (if referencing specific policy)
  aiSentiment: enum ("Positive", "Neutral", "Negative", "Question")
  aiCategory: enum ("Sales", "Support", "Claims", "General")
  
  // Status
  status: enum ("Sent", "Delivered", "Viewed", "Archived")
  viewedAt: timestamp
  
  // Metadata
  channel: enum ("App", "WhatsApp", "Viber", "Email", "SMS")
  isAutomated: boolean (TRUE if AI-generated recommendation)
  
  timestamps
  createdAt: timestamp
  readAt: timestamp
}

Conversation {
  id: UUID
  userId: UUID
  agentId: UUID
  
  subject: string
  status: enum ("Active", "Archived", "Resolved")
  priority: enum ("Low", "Normal", "High", "Urgent")
  
  messageCount: integer
  lastMessageAt: timestamp
  
  createdAt: timestamp
}
```

**Why Messaging Matters:**
- **Engagement:** 2-way communication track record
- **Compliance:** GDPR audit trail (who said what, when)
- **Multi-channel:** Integrate WhatsApp/Viber/Email
- **AI Features:** Auto-categorize, sentiment analysis, smart replies
- **Pro Feature:** Multi-agent collaboration on single customer

### 1.5 Claims Visibility (Enhanced)
**Currently:** Mock data shows claims but not linked to agent

```
Claim {
  id: UUID
  policyId: UUID
  userId: UUID
  agentId: UUID (assigned claim handler, optional)
  
  // Claim Details
  claimNumber: string (ACORD format)
  incidentDate: date
  reportedDate: date
  claimType: enum ("Medical", "Accident", "Theft", "Damage", "Other")
  
  // Amount Tracking
  claimAmount: decimal (€)
  estimatedReserve: decimal (€)
  paidAmount: decimal (€)
  
  // Status (ACORD-Compliant)
  status: enum {
    "FNOL" → First Notice of Loss
    "COVERAGE_REVIEW" → Under review
    "APPRAISAL" → Being assessed
    "APPROVED" → Ready to pay
    "PAID" → Payment made
    "DENIED" → Claim rejected
  }
  
  // Support
  assignedAdjuster: string (claims specialist)
  contactPhone: string (24/7 support)
  documentationRequired: string[]
  
  // Agent Involvement
  agentNotifications: {
    newClaimAlert: boolean
    statusUpdates: boolean
    supportRequired: boolean
  }
}
```

**Why Agents Need This:**
- **Claims Support:** Help customer with claim process
- **Customer Retention:** Proactive support during claim = loyal customer
- **Upselling:** Post-claim interaction → opportunity to discuss coverage gaps

---

## PHASE 2: CORE RELATIONSHIPS & ACCESS CONTROL

### 2.1 Free Tier (Single Agent Model)
```
Free Tier User (Standard) {
  ├─ Default Agent Assigned (only 1)
  │  ├─ Can view: All policies
  │  ├─ Can access: Recommendations, proposals
  │  ├─ Cannot modify: User data (read-only)
  │  └─ Communications: App-based only
  │
  └─ Full Control: User can unassign/reassign default agent
}
```

**Agent Receives:**
- ✅ User profile (age, family status, income range, occupations, dependents)
- ✅ All policies (type, coverage, premium, expiry dates)
- ✅ Risk assessment (score, gaps, health factors)
- ✅ Previous recommendations
- ✅ Claims history
- ❌ Health data (too sensitive)
- ❌ Sensitive financial records

**Use Case:** Small independent agent, 1-on-1 relationship

### 2.2 Pro Tier (Multi-Agent Model)
```
Pro Tier User (Premium) {
  ├─ Multiple Agents Assigned
  │  │
  │  ├─ Agent 1 (Default - Primary Agent)
  │  │  ├─ Access Level: Full
  │  │  ├─ Can see: All policies
  │  │  └─ Role: Main point of contact
  │  │
  │  ├─ Agent 2 (Secondary Agent)
  │  │  ├─ Access Level: Read-Only
  │  │  ├─ Can see: [Health, Auto] policies only (user chosen)
  │  │  └─ Role: Specialist (e.g., health insurance expert)
  │  │
  │  └─ Agent 3 (Claims Handler)
  │     ├─ Access Level: Claims-Only
  │     ├─ Can see: Current claims + related policy
  │     └─ Role: Claims support specialist
  │
  ├─ Policy-Level Permissions:
  │  ├─ Can hide specific policies from certain agents
  │  ├─ Can set expiry dates on agent access
  │  └─ Audit trail of access
  │
  └─ Communication Control:
     ├─ Choose which agents can message
     └─ Opt-out of agent contact (mute agent)
}
```

**Agent Receives (if authorized):**
- ✅ Assigned user profile (same as free tier)
- ✅ Assigned policies (per permission level)
- ✅ Risk assessment (only if authorized)
- ✅ Claims (only if assigned as claims handler)
- ✅ Previous interactions/proposals from ANY agent
- ❌ Data they're not assigned

**Use Case:** 
- Multi-family scenario (parent + kids with different agents)
- Corporate + personal insurance (different specialists)
- Primary agent + claims specialist

### 2.3 Access Control Matrix

| Feature | Free | Pro | Agent Can | User Can |
|---------|------|-----|-----------|----------|
| View user profile | ✅ | ✅ | READ | EDIT |
| View all policies | ✅ | ✅* | READ | EDIT |
| View specific policy type | ✅ | ✅* | READ | EDIT |
| View risk assessment | ✅ | ✅* | READ | VIEW ONLY |
| Create proposal | ✅ | ✅ | CREATE | REVIEW/ACCEPT |
| Send message | ✅ | ✅ | SEND | REPLY |
| View claims | ✅ | ✅* | READ | VIEW |
| Access health data | ❌ | ❌* | NEVER | OWN ONLY |
| Manage agents | ❌ | ✅ | N/A | FULL |
| Multi-agent | ❌ | ✅ | N/A | FULL |

*= User controls granularly

---

## PHASE 3: AGENT PLATFORM INTEGRATION POINTS

### 3.1 Data Flow Diagram

```
Agent Platform                                PolicyWallet App
┌─────────────────────┐                      ┌────────────────────┐
│   Agent Dashboard   │◄──────────────────►│  User Dashboard    │
│                     │                      │                    │
│ Agent Log In        │                      │ User Log In        │
│ ↓                   │                      │ ↓                  │
│ My Customers ◄──┐   │                      │ My Policies        │
│ • John Doe    │   │  Sync Engine           │ • Policy A         │
│ • Jane Smith  │   │  ┌────────────────┐   │ • Policy B         │
│ • Bob Jones   │   └─►│                │   │                    │
│   ↓           │      │ Real-time Sync │◄──│ Coverage Gaps      │
│ View Customer │      │ (OAuth 2.0)    │   │ Proposals          │
│ • Profile     │      │ • Policies     │   │ Messages           │
│ • Policies    │      │ • Proposals    │   │                    │
│ • Gaps        │      │ • Messages     │   │ Agent Actions      │
│ • Risk Score  │      │                │   │ [Propose] [Message]│
│ • Proposals   │      │                │   │                    │
│ • Claims      │      │                │   │ Settings           │
│   ↓           │      │                │   │ [Manage Agents]    │
│ Create        │      │                │   │                    │
│ Proposal      │      │ REST API       │   │                    │
│ ↓             │      │ (Agent ←→ User)│   │                    │
│ Send to User  │      │                │   │                    │
│   ↓           │      │                │   │                    │
│ Track Status  │      │                │   │                    │
│ (Accepted?)   │      │                │   │                    │
│   ↓           │      │                │   │                    │
│ Commission    │      │                │   │                    │
│ Tracking      │      │                │   │                    │
└─────────────────────┘                      └────────────────────┘
```

### 3.2 Required API Endpoints (Agent Platform Perspective)

**Authentication & Authorization:**
```
POST   /api/agents/oauth/authorize
       (PolicyWallet redirects user to authorize agent access)
       
GET    /api/agents/oauth/callback
       (PolicyWallet returns authorization token)
       
POST   /api/agents/refresh-token
       (Refresh OAuth token when expired)
```

**Read Customer Data:**
```
GET    /api/customers/{userId}/profile
       (Get basic user profile)
       
GET    /api/customers/{userId}/policies
       (Get policies user allows agent to see)
       
GET    /api/customers/{userId}/policies/{policyId}
       (Get specific policy details)
       
GET    /api/customers/{userId}/risk-assessment
       (Get current risk score + gaps)
       
GET    /api/customers/{userId}/proposals
       (Get proposals from all agents)
       
GET    /api/customers/{userId}/messages
       (Get message history)
       
GET    /api/customers/{userId}/claims
       (Get claims if agent authorized)
```

**Create/Update Data:**
```
POST   /api/customers/{userId}/proposals
       (Agent creates proposal for customer)
       Body: { type, title, description, policies, premium, etc. }
       
PUT    /api/customers/{userId}/proposals/{proposalId}
       (Update proposal status)
       Body: { status: "SENT", "DISCUSSED", "ACCEPTED", etc. }
       
POST   /api/customers/{userId}/messages
       (Send message from agent to customer)
       Body: { content, channel, proposalId?, attachments? }
       
PUT    /api/customers/{userId}/agent-permissions
       (Update agent access levels - USER ACTION, not agent)
       Body: { agentId, accessLevel, policyIds, permissions }
```

**Notifications:**
```
POST   /api/webhooks/proposal-status-changed
POST   /api/webhooks/message-received
POST   /api/webhooks/policy-expiring-soon
POST   /api/webhooks/claim-status-updated
```

---

## PHASE 4: PRO TIER EXCLUSIVE FEATURES

### 4.1 Multi-Agent Collaboration
```
Scenario: Customer with Health Specialist + Auto Specialist

User Pro Account {
  Agents: [
    { id: A1, type: "Health Specialist", policies: ["Health"] },
    { id: A2, type: "Auto Specialist", policies: ["Auto"] }
  ]
}

Both A1 and A2 can:
✅ See customer's profile
✅ See their assigned policies
✅ Send proposals for their specialty
✅ Communicate with customer
✅ View other agent's proposals (transparency)
✅ Coordinate handoff (e.g., recommend to other agent)

Neither can:
❌ See other agent's policies
❌ Delete/modify other agent's proposals
❌ Contact customer outside their scope (unless escalated)
```

### 4.2 Advanced Analytics (Agent Dashboard)
```
Agent Views Per-Customer:

Performance Dashboard:
├─ Proposals Sent: 5
├─ Proposals Accepted: 2 (40% close rate)
├─ Revenue Generated: €1,200/year
├─ Pending Follow-ups: 1 (due 3 days)
├─ Customer Engagement Score: 8/10
│  ├─ Messages opened: Yes
│  ├─ Proposal reviewed: Yes
│  ├─ Last contact: 2 days ago
│  └─ Recommendation: Send follow-up
│
└─ Next Actions:
   ├─ Upsell opportunity: Add dental coverage (customer has gap)
   ├─ Renewal alert: Auto policy renews in 15 days
   └─ Bundling opportunity: Consolidate health + auto (€200 savings)
```

### 4.3 Recommendation Engine (AI-Powered)
```
Agent receives smart recommendations:

"Based on John's profile:"
├─ Age: 35, Married, 2 kids
├─ Current: Health + Auto
├─ Gaps Identified:
│  ├─ No life insurance (€1M risk)
│  ├─ No disability (income at risk)
│  └─ No pet insurance (owns dog)
│
└─ Recommended Actions:
   ├─ #1 Priority: Life Insurance (€25/mo, protects family)
   ├─ #2 Priority: Disability (€40/mo, replaces income)
   └─ #3 Priority: Pet Insurance (€15/mo, optional but trending)
```

### 4.4 Audit Trail & Compliance
```
Every interaction logged:

Access Log:
├─ 2025-11-29 10:15 - Agent A1 viewed policies
├─ 2025-11-29 10:20 - Agent A1 created proposal
├─ 2025-11-29 11:05 - User viewed proposal
├─ 2025-11-29 11:30 - Agent A1 sent message
├─ 2025-11-29 14:00 - User replied to message
└─ 2025-11-29 15:30 - Proposal status changed to ACCEPTED

Purpose:
✅ GDPR compliance (data access trail)
✅ Dispute resolution (what was promised)
✅ Commission tracking (when did customer accept)
✅ Quality assurance (agent behavior review)
```

---

## PHASE 5: REVENUE MODEL & MONETIZATION

### 5.1 Tier Comparison

| Feature | Free | Pro | Enterprise |
|---------|------|-----|-----------|
| **Price** | €0 | €4.99/mo | Custom |
| **Policies Stored** | Unlimited | Unlimited | Unlimited |
| **Agents Assigned** | 1 | Unlimited | Unlimited |
| **Agent Access Control** | No | Yes (granular) | Yes (granular) |
| **Proposals** | View only | Create + manage | + API |
| **Messages** | App only | App + WhatsApp* | + SMS/Email |
| **Health Data Share** | No | No | Custom |
| **Analytics** | Basic | Advanced | Custom |
| **API Access** | No | No | Yes |
| **Custom Branding** | No | No | Yes |
| **SLA Support** | Email | Priority | 24/7 |

### 5.2 Revenue Streams

**1. User Subscription (Pro Tier)**
- €4.99/month per user
- Target: 15% of free users convert
- Retention: 80% monthly

**2. Agent Commission (Revenue Share)**
- PolicyWallet takes 5-15% of insurance premiums
- If customer buys €1,200/year policy → €60-180 to PolicyWallet
- Agent platform retains remainder

**3. Enterprise API Licensing**
- Large insurers integrate directly
- €5,000-50,000/month depending on volume

**4. White-Label Options**
- Insurer brands PolicyWallet for customers
- €10,000/month + per-transaction fees

---

## PHASE 6: IMPLEMENTATION ROADMAP

### Immediate (Months 1-2): Foundation
```
MUST DO:
☐ Move policies from mockData → PostgreSQL database
  └─ Requires: Policy table schema + migration
  
☐ Create Agent-User relationship model
  └─ Requires: New database tables + API endpoints
  
☐ Build OAuth 2.0 integration layer
  └─ Requires: Auth middleware + token management
  
☐ Implement proposal data model
  └─ Requires: Database + CRUD operations
  
☐ Create message/communication table
  └─ Requires: Database + notification system
```

### Phase 2 (Months 2-3): Agent Platform Integration
```
MUST DO:
☐ Implement access control rules
  └─ Requires: Permission middleware, policy checks
  
☐ Build agent-facing API endpoints
  └─ Requires: REST API + authentication
  
☐ Create proposal workflow (send → track → accept)
  └─ Requires: Status machine + notifications
  
☐ Implement messaging system
  └─ Requires: Database + real-time notifications
```

### Phase 3 (Months 3-4): Pro Tier Features
```
SHOULD DO:
☐ Multi-agent management UI (user-facing)
☐ Agent analytics dashboard
☐ Advanced recommendation engine
☐ Audit trail & compliance logging
☐ WhatsApp/Viber integration for messaging
```

### Phase 4 (Months 4-5): Launch & Monetize
```
NICE TO HAVE:
☐ Tier comparison marketing
☐ Payment integration (Stripe)
☐ Enterprise API documentation
☐ White-label options
```

---

## DATA GOVERNANCE & COMPLIANCE

### 6.1 GDPR Considerations

```
User Consent:
├─ Agent can access data: EXPLICIT CONSENT REQUIRED
├─ Data retention: Max 24 months after relationship ends
├─ Right to deletion: User can revoke agent access anytime
└─ Data portability: User can export all their data

Agent Access:
├─ Only access what's authorized
├─ Logging: All access must be audited
├─ Retention: Access logs kept 3+ years
└─ Training: Agents must sign data protection agreement

Health Data:
├─ NEVER shared by default
├─ Only with explicit user consent (separate checkbox)
├─ Treated as sensitive personal data
└─ Requires enhanced security
```

### 6.2 Insurance Regulatory (Greece/EU)

```
ACORD Compliance:
├─ Policy codes must match ACORD standards
├─ Claim tracking must be FNOL-compliant
├─ Agent commissions documented

Insurance Distribution Directive (IDD):
├─ Agent recommendations must be documented
├─ Proposal acceptance creates legally binding record
├─ Customer has right to withdraw within 14 days

Greeks Insurance Regulator (ASFAA):
├─ All proposals must be retained for audit
├─ Agent credentials must be verified
└─ Customer complaints process must be documented
```

---

## SECURITY & DATA ISOLATION

### 7.1 Agent Data Access (Principle of Least Privilege)

```
Agent A requests customer data
    ↓
Check: Is Agent A authorized for this customer? YES ✓
    ↓
Check: Is Agent A authorized for this data type? YES ✓
    ↓
Check: Did customer consent to Agent A accessing this data? YES ✓
    ↓
Check: Is this data sensitive (health)? NO ✓
    ↓
Log access with timestamp + IP address
    ↓
Return data filtered to only authorized fields
```

### 7.2 Encryption & Storage

```
At Rest (Database):
├─ Health data: Encrypted with customer's key
├─ Policy data: Encrypted
├─ Messages: Encrypted
└─ Health metrics: Encrypted

In Transit (API):
├─ All APIs: HTTPS only
├─ OAuth tokens: Refresh every 24 hours
└─ Webhook delivery: Signed with HMAC

Access Logging:
├─ All agent accesses logged
├─ Immutable audit trail
└─ Retention: 7 years minimum
```

---

## INTEGRATION CHECKLIST

### Before Agent Platform Integration:

**Data Layer:**
- [ ] Policies table created + migrated
- [ ] Agent-User relationship model finalized
- [ ] Proposal data model designed
- [ ] Message/communication table created
- [ ] Access control rules defined
- [ ] GDPR consent model implemented

**API Layer:**
- [ ] OAuth 2.0 endpoints ready
- [ ] Customer data GET endpoints built
- [ ] Proposal POST/PUT endpoints built
- [ ] Message endpoints built
- [ ] Webhook endpoints ready
- [ ] Rate limiting + authentication secured

**UI Changes (PolicyWallet):**
- [ ] Multi-agent management interface
- [ ] Proposal viewing + acceptance flow
- [ ] Message interface
- [ ] Pro tier upgrade prompt
- [ ] Settings for agent permissions

**Agent Platform Changes (Required from Agent Team):**
- [ ] OAuth consumer implemented
- [ ] Agent dashboard receives PolicyWallet data
- [ ] Agent can create/send proposals
- [ ] Agent notifications for new proposals/messages
- [ ] Commission tracking integrated

**Testing:**
- [ ] Free tier: Single agent access works
- [ ] Pro tier: Multi-agent with granular permissions
- [ ] Proposal workflow end-to-end
- [ ] Message delivery + notifications
- [ ] GDPR consent + audit logging
- [ ] Security: Agents can't access unauthorized data

**Compliance:**
- [ ] Legal review: Data sharing agreements
- [ ] Compliance review: GDPR requirements met
- [ ] ASFAA requirements validated
- [ ] Insurance Distribution Directive (IDD) requirements met

---

## SUCCESS METRICS

### Agent Engagement:
- Agent login frequency (target: 3+ per week)
- Proposals created per agent (target: 5+ per month)
- Conversion rate (target: 30%+ proposals accepted)
- Customer satisfaction with agent (target: 4.5+/5.0)

### User Engagement:
- Pro tier adoption (target: 15% of free users)
- Multi-agent scenarios (target: 10% of pro users)
- Proposal response time (target: <24 hours)
- Message response rate (target: 80%)

### Revenue:
- MRR from Pro subscriptions (target: €50k+ by year 2)
- Commission revenue from proposed policies
- Enterprise deals (target: 3+ in year 2)

---

## CONCLUSION & NEXT STEPS

This integration transforms PolicyWallet from **user-centric policy aggregation** into a **bi-directional agent-customer engagement platform**.

### Key Wins:
1. ✅ Agents get real-time visibility into customer needs
2. ✅ Users get personalized recommendations from trusted agents
3. ✅ Creates sustainable revenue through Pro tier + commission share
4. ✅ Enables data-driven sales (proposals tracked, analytics available)
5. ✅ Builds trust through transparency + audit trails

### Financial Impact:
- **Free tier:** 0€ revenue but 100k+ users
- **Pro tier:** 4.99€/mo × 15,000 users = €900k/year
- **Commission:** 5-15% of €200M+ annual policies = €10-30M potential

### Next Steps:
1. Share this document with Agent Platform team for feedback
2. Prioritize which features are critical for initial launch
3. Create detailed technical specifications for each data model
4. Plan database migration strategy (move policies from mockData)
5. Begin OAuth integration development

---

**Document Owner:** Product Management  
**Last Updated:** November 29, 2025  
**Approval Status:** Awaiting Stakeholder Review
