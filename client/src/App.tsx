import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/layout";
import Dashboard from "@/pages/dashboard";
import PoliciesPage from "@/pages/policies";
import PolicyDetailsPage from "@/pages/policy-details";
import AppointmentsPage from "@/pages/appointments";
import AnalysisPage from "@/pages/analysis";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/policies" component={PoliciesPage} />
        <Route path="/policies/:id" component={PolicyDetailsPage} />
        <Route path="/appointments" component={AppointmentsPage} />
        <Route path="/analysis" component={AnalysisPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;
