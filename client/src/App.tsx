import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { NetworkStatus } from "@/components/network-status";
import { PWAUpdatePrompt } from "@/components/pwa-update-prompt";
import Layout from "@/components/layout";
import { Suspense, useState, useEffect } from "react";
import Dashboard from "@/pages/dashboard";
import ProfilePage from "@/pages/profile";
import UserSettingsPage from "@/pages/user-settings";
import PoliciesPage from "@/pages/policies";
import PolicyDetailsPage from "@/pages/policy-details";
import AppointmentsPage from "@/pages/appointments";
import AnalysisPage from "@/pages/analysis";
import GapAnalysisPage from "@/pages/gap-analysis";
import AgentsPage from "@/pages/agents";
import DocumentsPage from "@/pages/documents";
import ClaimsPage from "@/pages/claims";
import HealthWellnessPage from "@/pages/health-wellness";
import AdminDashboard from "@/pages/admin-dashboard";
import LoginPage from "@/pages/login";
import OnboardingPage from "@/pages/onboarding";
import SignupPage from "@/pages/signup";
import NotFound from "@/pages/not-found";
import RenewalsPage from "@/pages/renewals";
import BillingPage from "@/pages/billing";
import RecommendationsPage from "@/pages/recommendations";
import NotificationsCenterPage from "@/pages/notifications-center";
import InsuranceHealthPage from "@/pages/insurance-health";
import AddPolicyPage from "@/pages/add-policy";

function Router() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(() => {
    return localStorage.getItem("hasSeenOnboarding") === "true";
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("auth_token");
  });

  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("auth_token"));
      setHasSeenOnboarding(localStorage.getItem("hasSeenOnboarding") === "true");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleOnboardingGetStarted = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    setHasSeenOnboarding(true);
    setShowSignup(true);
  };

  const handleOnboardingSignIn = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    setHasSeenOnboarding(true);
    setShowSignup(false);
  };

  const handleSignupComplete = () => {
    localStorage.setItem("auth_token", "demo_token");
    setIsAuthenticated(true);
    setShowSignup(false);
  };

  const handleSwitchToLogin = () => {
    setShowSignup(false);
  };

  const handleSwitchToSignup = () => {
    setShowSignup(true);
  };

  if (!hasSeenOnboarding) {
    return (
      <OnboardingPage 
        onComplete={handleOnboardingGetStarted} 
        onSignIn={handleOnboardingSignIn}
      />
    );
  }

  if (!isAuthenticated) {
    if (showSignup) {
      return (
        <SignupPage 
          onComplete={handleSignupComplete}
          onSignIn={handleSwitchToLogin}
        />
      );
    }
    return <LoginPage />;
  }

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/settings" component={UserSettingsPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/policies" component={PoliciesPage} />
        <Route path="/policies/:id" component={PolicyDetailsPage} />
        <Route path="/appointments" component={AppointmentsPage} />
        <Route path="/analysis" component={AnalysisPage} />
        <Route path="/gap-analysis" component={GapAnalysisPage} />
        <Route path="/agents" component={AgentsPage} />
        <Route path="/documents" component={DocumentsPage} />
        <Route path="/claims" component={ClaimsPage} />
        <Route path="/health-wellness" component={HealthWellnessPage} />
        <Route path="/renewals" component={RenewalsPage} />
        <Route path="/billing" component={BillingPage} />
        <Route path="/recommendations" component={RecommendationsPage} />
        <Route path="/notifications" component={NotificationsCenterPage} />
        <Route path="/insurance-health" component={InsuranceHealthPage} />
        <Route path="/add-policy" component={AddPolicyPage} />
        <Route path="/admin" component={AdminDashboard} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="policy-guard-theme">
          <Suspense fallback={<div>Loading...</div>}>
            <NetworkStatus />
            <PWAUpdatePrompt />
            <Toaster />
            <Router />
          </Suspense>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
