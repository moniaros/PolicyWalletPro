# 🛡️ AgentRise Insurance Policy Wallet

A cross-platform insurance policy management application for Greek/European insurers (Ethniki, Generali, Ergo, NN) with ACORD-standard policy management, AI-powered dynamic gap analysis, and comprehensive user experience.

## 📋 Overview

AgentRise transforms insurance policy management into an intelligent, mobile-first experience that addresses Greek market-specific pain points including bureaucracy (ENFIA tax compliance), hospital network clarity, localized policy features, and distinction between accident care vs roadside assistance.

### 🎯 Key Objectives
- **Policy Wallet**: ACORD-compliant policy management with type-specific quick views and detailed coverage information
- **Protection Gap Analysis**: Dynamic, revenue-generating recommendation engine with 7 type-specific visualizations
- **Greek Localization**: Full Greek language support with market-specific features (ENFIA badges, green card status, Δήλωση vs Οδική Βοήθεια)
- **Dual Purchase Pathways**: Direct purchase + agent-assisted flows for all coverage types
- **Health Wellness Tracking**: Integration with health checkups and preventive care recommendations
- **Claims Management**: Streamlined claims filing and status tracking
- **In-Network Booking**: Appointment booking with hospital and clinic networks
- **Enterprise Security**: Multi-factor authentication, social login, role-based access

---

## ✨ Core Features

### 1. 📱 Policy Card System (Quick View)
Type-specific cards answering **"Am I covered?"**:
- **Health**: Hospital class (A/B/C), coordination center, annual checkup included
- **Auto**: License plate + vehicle model, coverage tier (Πλήρες Kasko), green card validity, named drivers
- **Home**: ENFIA tax deduction badge, property address, catastrophe coverage (Fire/Earthquake/Flood)
- **Investment Life**: Fund value + YTD growth, tax-free maturity status, guaranteed vs linked split
- **Pet**: Microchip number, annual limit progress, breed-specific disease coverage (Leishmania)

### 2. 🔍 Detailed Coverage Views
In-depth information answering **"What is covered?" & "How do I use it?"**:
- **Health**: Συντονιστικό Κέντρο (coordination center), network hospital list, excluded providers, free annual checkup
- **Auto**: Legal & road coverage (Δήλωση Ατυχήματος 🚨 vs Οδική Βοήθεια 🚙 - distinct phone numbers), named drivers, green card status
- **Home**: ENFIA tax criteria validation, catastrophe coverage status, mortgagee bank, 24/7 technical assistance
- **Investment**: Fund allocation breakdown, guaranteed vs unit-linked, beneficiaries, last premium details
- **Pet**: Breed health radar, covered/uncovered hereditary conditions, vet network, direct payment status

### 3. 💰 Dynamic Gap Analysis Engine
Revenue-generating recommendation system with **€0-€1,500/policy opportunity**:

#### Home & Liability
- Construction cost index comparison (€1,600/sqm Athens)
- Safe replacement value slider visualization
- ENFIA tax criteria validation (Fire + Earthquake + Flood)
- Estimated revenue: €150-400/year

#### Auto (Motor)
- Vehicle depreciation analysis
- Overinsurance detection ("Wasting €X/year")
- Underinsurance risk display ("Will lose €Y in total loss")
- Legal protection vs average court costs
- Market value meter visualization
- Estimated revenue: €200-600/year

#### Health
- Hospital cost simulation (5-day surgery scenario)
- Out-of-pocket payment calculation
- Deductible vs emergency savings gap analysis
- Estimated revenue: €180-400/year

#### Investment Life
- Goal timeline visualization (Target vs Current Path)
- Purchasing power erosion analysis
- Inflation-adjusted shortfall calculation
- Estimated revenue: €250-800/year

#### Pet Insurance
- Breed-specific hereditary condition radar
- Waiting period status tracking
- Greek disease coverage (Leishmania/Κάλαζαρ)
- Estimated revenue: €80-150/year

#### Doctor Civil Liability
- Career protection timeline (unprotected years highlighted)
- Retroactive coverage gap detection
- Specialty-specific settlement benchmarks
- Estimated revenue: €500-1,500/year

#### Marine (Yacht)
- Cruising area warranty verification
- Tender (dinghy) coverage detection
- Area mismatch potential savings identification
- Estimated revenue: €300-500/year

### 4. 🏥 Health & Wellness
- Annual health checkups tracking
- Health metrics (BP, heart rate, BMI, cholesterol, blood sugar)
- Risk assessments with scoring (0-100)
- Preventive care recommendations
- Appointment booking with network providers

### 5. 📅 In-Network Appointment Booking
- Hospital & clinic discovery by service type
- Cardiology, Dental, Auto Repair, etc.
- Status tracking (Scheduled/Completed/Cancelled)
- Direct integration with policy coverage

### 6. 🚨 Claims Management
- Quick claim filing with policy selection
- Claim type & amount input
- Status tracking throughout lifecycle
- Mock agent integration for 24/7 support

### 7. 👤 Universal Broker Actions
Available on every policy detail view:
- **💳 Pay Now** (Πληρώστε Τώρα)
- **📋 File Claim** (Αναφορά Ζημιάς)
- **✏️ Modify Policy** (Τροποποίηση)
- **☎️ Agent Contact** (24/7 Agent Nikos: +30 694 123 4567)
- **📄 Documents** (ENFIA cards, Green Cards, Hospital forms, Certificates)

---

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Wouter** for routing
- **TailwindCSS** + Radix UI components for styling
- **React Hook Form** for form management
- **Zod** for schema validation
- **TanStack React Query** for state management
- **Recharts** for data visualization
- **Framer Motion** for animations
- **Sonner** for toast notifications

### Backend
- **Express.js** with TypeScript
- **Drizzle ORM** for database abstraction
- **PostgreSQL** (Neon-backed via Replit)
- **Passport.js** for authentication
- **express-session** for session management

### Database
- **PostgreSQL** with Drizzle migrations
- Tables: users, user_profiles, health_checkups, health_metrics, risk_assessments, preventive_recommendations, appointments

---

## 📁 Project Structure

```
.
├── client/
│   └── src/
│       ├── components/
│       │   ├── policy-card.tsx                    # Quick view cards
│       │   ├── policy-detail-sections.tsx         # Type-specific detailed views
│       │   ├── gap-analysis-visualizations.tsx    # Visualization components
│       │   ├── dynamic-gap-recommendations.tsx    # Revenue engine UI
│       │   └── policy-recommendations.tsx         # Static recommendations
│       ├── pages/
│       │   ├── policies.tsx                       # Policy list/dashboard
│       │   ├── policy-details.tsx                 # Policy detail view with tabs
│       │   ├── profile.tsx                        # User profile setup
│       │   ├── health.tsx                         # Health & wellness tracking
│       │   ├── appointments.tsx                   # Appointment booking
│       │   └── claims.tsx                         # Claims management
│       ├── lib/
│       │   ├── mockData.ts                        # Mock policies & data
│       │   ├── gap-calculation.ts                 # Static gap analysis
│       │   └── enhanced-gap-analysis.ts           # Dynamic gap engine
│       ├── hooks/
│       │   └── useUserProfile.ts                  # Profile data hook
│       └── App.tsx                                # Router setup
├── server/
│   ├── routes.ts                                  # API endpoints
│   ├── storage.ts                                 # Database abstraction
│   ├── auth.ts                                    # Authentication logic
│   └── index.ts                                   # Server entry point
├── shared/
│   └── schema.ts                                  # Database schema & types
├── README.md                                      # This file
└── package.json

```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Replit provides one automatically)

### Installation

1. **Clone & Install**
   ```bash
   npm install
   ```

2. **Database Setup**
   ```bash
   npm run db:push
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   App runs on `http://localhost:5000`

### Demo Credentials
- **Email**: demo@example.com
- **Password**: password
- **Agent**: Nikos (+30 694 123 4567) - Available 24/7

---

## 📊 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user

### Policies
- `GET /api/policies` - List all policies
- `GET /api/policies/:id` - Get policy details

### Health & Wellness
- `POST /api/health/checkup` - Record health checkup
- `GET /api/health/checkups` - List checkups
- `POST /api/health/metrics` - Record health metrics
- `GET /api/risk-assessment` - Get risk assessment

### Appointments
- `POST /api/appointments` - Book appointment
- `GET /api/appointments` - List appointments
- `PUT /api/appointments/:id` - Update appointment status

### Claims
- `POST /api/claims` - File claim
- `GET /api/claims` - List claims
- `GET /api/claims/:id` - Claim details

---

## 💾 Database Schema

### Users Table
```typescript
{
  id: uuid (primary key),
  username: string (unique),
  password: string (hashed)
}
```

### User Profiles
```typescript
{
  userId: uuid (unique),
  fullName: string,
  dateOfBirth: string,
  ageGroup: enum ("18-30" | "31-45" | "46-60" | "60+"),
  familyStatus: enum ("Single" | "Married" | "Domestic Partner"),
  dependents: integer,
  incomeRange: enum,
  healthStatus: enum,
  emergencyFund: enum,
  travelFrequency: enum,
  occupationRisk: enum,
  currentCoverages: text[],
  chronicConditions: text[],
  dependentDetails: jsonb
}
```

### Health Checkups
```typescript
{
  id: uuid,
  userId: uuid,
  checkupDate: timestamp,
  checkupType: string ("Annual" | "Dental" | "Eye" | "Cardiac"),
  provider: string,
  results: text,
  fileUrls: text[]
}
```

### Appointments
```typescript
{
  id: uuid,
  userId: uuid,
  policyType: string,
  serviceType: string,
  providerName: string,
  location: string,
  appointmentDate: timestamp,
  appointmentTime: string,
  status: enum ("Scheduled" | "Completed" | "Cancelled")
}
```

---

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3b82f6) - Main actions, links
- **Success**: Emerald (#10b981) - Positive states, coverage
- **Warning**: Amber (#f59e0b) - Caution, recommendations
- **Danger**: Red (#ef4444) - Alerts, gaps
- **Info**: Indigo (#6366f1) - Information, insights

### Typography
- **Display**: Font Bold 32px - Page titles
- **Heading**: Font Bold 24px - Section titles
- **Body**: Font Regular 14px - Content
- **Caption**: Font Regular 12px - Secondary info

### Greek Localization
All UI elements use Greek labels:
- **Πληρώστε Τώρα** - Pay Now
- **Αναφορά Ζημιάς** - File Claim
- **Τροποποίηση** - Modify
- **Συντονιστικό Κέντρο** - Coordination Center
- **Δήλωση Ατυχήματος** - Accident Care Declaration
- **Οδική Βοήθεια** - Roadside Assistance
- **Πράσινη Κάρτα** - Green Card
- **ENFIA** - Tax deduction badge

---

## 🔒 Security Features

- **Password Hashing**: bcrypt for secure password storage
- **Session Management**: express-session with PostgreSQL store
- **CSRF Protection**: Built into session middleware
- **Input Validation**: Zod schema validation on all inputs
- **Environment Variables**: API keys stored as Replit secrets
- **Role-Based Access**: User-level data isolation
- **SQL Injection Prevention**: Drizzle ORM parameterized queries

---

## 📈 Revenue Opportunities

The gap analysis engine identifies **€0-€1,500 annual revenue per policy**:

| Insurance Type | Gap Type | Revenue Potential |
|---|---|---|
| Home & Liability | ENFIA compliance + underinsurance | €150-€400 |
| Auto | Overinsurance detection | €200-€600 |
| Health | Hospital coverage gaps | €180-€400 |
| Investment Life | Shortfall + inflation erosion | €250-€800 |
| Pet | Breed-specific coverage | €80-€150 |
| Doctor Liability | Career protection gaps | €500-€1,500 |
| Marine | Tender + area coverage | €300-€500 |

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Login with demo credentials
- [ ] View all 5 policy types with quick views
- [ ] Click into each policy and review detailed views
- [ ] Check "Analysis" tab shows dynamic gap recommendations
- [ ] Test appointment booking flow
- [ ] File a test claim
- [ ] Review health checkup tracking

---

## 🚢 Deployment

Deploy to Replit publishing:
1. Ensure app builds: `npm run build`
2. Verify dev server runs: `npm run dev`
3. Use Replit's publish button for live deployment
4. App will be available at `.replit.app` domain

---

## 📝 License

Proprietary - AgentRise Insurance Platform

---

## 👨‍💼 Support

**Agent Contact**: Nikos  
📞 +30 694 123 4567  
🕐 Available 24/7 for questions, claims, and policy modifications

---

## 🎯 Roadmap

### Phase 2
- [ ] Real insurer API integration (Ethniki, Generali, Ergo, NN)
- [ ] Social login (Google, Apple, Facebook)
- [ ] Payment processing (Stripe integration)
- [ ] Advanced claims analytics dashboard
- [ ] PDF policy document generation
- [ ] Multi-language support (EN, DE, FR)
- [ ] Mobile app (React Native)

### Phase 3
- [ ] AI chatbot for instant support
- [ ] Personalized insurance recommendations
- [ ] Claims history analytics
- [ ] Family account management
- [ ] Corporate plans support
- [ ] API for B2B partners

---

**Built with ❤️ for Greek Insurance Market** 🇬🇷
