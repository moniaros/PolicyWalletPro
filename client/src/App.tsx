import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import Layout from "@/components/layout";
import Dashboard from "@/pages/dashboard";
import PoliciesPage from "@/pages/policies";
import PolicyDetailsPage from "@/pages/policy-details";
import AppointmentsPage from "@/pages/appointments";
import AnalysisPage from "@/pages/analysis";
import AgentsPage from "@/pages/agents";
import DocumentsPage from "@/pages/documents";
import ClaimsPage from "@/pages/claims";
import HealthWellnessPage from "@/pages/health-wellness";
import AdminDashboard from "@/pages/admin-dashboard";
import LoginPage from "@/pages/login";
import NotFound from "@/pages/not-found";
import { useState, useEffect } from "react";

function Router({ isAuthenticated }: { isAuthenticated: boolean }) {
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/policies" component={PoliciesPage} />
        <Route path="/policies/:id" component={PolicyDetailsPage} />
        <Route path="/appointments" component={AppointmentsPage} />
        <Route path="/analysis" component={AnalysisPage} />
        <Route path="/agents" component={AgentsPage} />
        <Route path="/documents" component={DocumentsPage} />
        <Route path="/claims" component={ClaimsPage} />
        <Route path="/health-wellness" component={HealthWellnessPage} />
        <Route path="/admin" component={AdminDashboard} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("auth_token");
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 text-primary"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="policy-guard-theme">
        <Toaster />
        <Router isAuthenticated={isAuthenticated} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
