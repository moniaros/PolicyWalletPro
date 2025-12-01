# PolicyWallet - Insurance Policy Management Platform

## Overview
PolicyWallet is a cross-platform insurance policy management platform designed for Greek and European insurers. It offers ACORD-standard policy management, AI-powered document parsing and gap analysis using Gemini 1.5 Flash, and comprehensive features for claims, appointments, and wellness. The platform supports enterprise authentication and full database persistence, aiming for a unified, secure, and user-friendly experience in managing insurance policies. It is production-ready, highly secure, accessible, and localized for Greek and English markets.

## User Preferences
I prefer simple language and clear explanations. I want iterative development with frequent, small updates. Please ask for my approval before implementing major architectural changes or new features. Ensure all user-facing text is localized and all interactive elements are accessible. I value a mobile-first design approach.

## System Architecture
**UI/UX Decisions:**
- Modern gradient designs and accessible color schemes.
- iOS Human Interface Guidelines compliance for a native feel on mobile, including large navigation titles, rounded search bars, grouped card layouts, and semantic system colors.
- Framer Motion for smooth animations.
- Responsive grid layouts and 44px minimum touch targets for all interactive elements, ensuring mobile and tablet compatibility.
- Dark blue gradient theme with orange accents for onboarding.

**Technical Implementations:**
- **Primary Stack:** React 18, TypeScript, Express, PostgreSQL (Neon serverless).
- **Database:** Drizzle ORM for PostgreSQL, providing full CRUD operations for policies and related entities (beneficiaries, drivers, coverages, vehicles, properties).
- **AI Integration:** Gemini 1.5 Flash for multi-format document parsing (PDF, JPEG, PNG, WebP) with Base64 vision upload, comprehensive extraction of policy details, and confidence scoring.
- **Authentication:** 2FA, PIN login, biometric support, session management (express-session), and secure localStorage patterns.
- **Internationalization:** Comprehensive i18n implementation with Greek and English translations for all user-facing text, using `t()` calls and proper interpolation.
- **Routing:** Wouter for lightweight client-side routing.
- **State Management:** React hooks and localStorage for managing application state.
- **Styling:** Tailwind CSS integrated with Radix UI components for a robust and accessible UI system.
- **Progressive Web App (PWA):** Dedicated app icons, web app manifest, Workbox-based service worker for offline caching, install prompts, update notifications, and share target functionality.
- **Security:** Data isolation ensures users only access their own data via `req.userId` filtering.

**Feature Specifications:**
- **User-Scoped Policy Persistence:** Real-time fetching and full CRUD support for user policies, integrated with authentication and robust error handling.
- **AI-Powered Policy Creation:** Supports nested entity persistence and schema alignment for comprehensive policy data.
- **Onboarding Carousel:** 5-slide fullscreen carousel showcasing key features, with mobile-first design, dark blue gradient theme, and smart flow control.
- **Enhanced Appointment Booking Wizard:** 5-step flow including policy/service/provider selection, advanced date/time scheduling, and dynamic, service-specific forms with full i18n.
- **Policy Renewal Tracker:** Dashboard with quick stats, smart filter tabs, enhanced renewal cards with urgency indicators, and savings opportunities.
- **Payment/Billing Tracker:** 3-tab interface for overview, payment history, and methods, with analytics and invoice download.
- **Email Notifications Preferences:** Multi-channel notification settings (Email, In-App, SMS) with categories and Do Not Disturb scheduling.
- **AI-Powered Recommendations:** Six types of recommendations covering coverage gaps, life events, savings, renewals, and wellness benefits.
- **Dashboard Widgets:** Integrated widgets for renewals, billing, recommendations, insurance health, and payment reminders, dynamically prioritized based on user context.

## External Dependencies
- **Database:** PostgreSQL (Neon serverless)
- **AI:** Google Gemini 1.5 Flash API
- **UI Libraries:** Radix UI components, Tailwind CSS
- **Routing:** Wouter
- **State Management Utilities:** date-fns, zod, react-hook-form
- **Internationalization:** i18next
- **Charting:** recharts
- **Authentication:** passport, express-session
- **Animations:** Framer Motion
- **WebSockets:** ws
- **PWA:** vite-plugin-pwa (Workbox)
- **Toast Notifications:** Sonner
- **Carousel:** embla-carousel-react