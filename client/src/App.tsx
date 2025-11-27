import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { NetworkStatus } from "@/components/network-status";
import Layout from "@/components/layout";
import { Suspense } from "react";
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
import NotFound from "@/pages/not-found";
import RenewalsPage from "@/pages/renewals";

// Ultra-fast synchronous auth check - no useState needed
const token = typeof window !== 'undefined' ? localStorage.getItem("auth_token") : null;
const isAuthenticatedSync = !!token;

function Router() {
  if (!isAuthenticatedSync) {
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
            <Toaster />
            <Router />
          </Suspense>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
