import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertCircle, Mail, Lock } from "lucide-react";
import { FormInputWithValidation } from "@/components/form-input-with-validation";

const emailValidator = (email: string): string | null => {
  if (!email) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Please enter a valid email";
  return null;
};

const passwordValidator = (password: string): string | null => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return null;
};

const errorValidator = (val: string): string | null => null;

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Authentication failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("auth_token", data.token || "demo-token");
      localStorage.setItem("user_id", data.id);
      setLocation("/");
    },
    onError: (err: any) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const emailError = emailValidator(email);
    const passwordError = passwordValidator(password);

    if (emailError || passwordError) {
      setError(emailError || passwordError || "");
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-2 text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
                <Shield className="text-primary-foreground h-6 w-6" />
              </div>
            </div>
            <CardTitle className="text-3xl">PolicyWallet</CardTitle>
            <CardDescription>
              {isLogin ? "Welcome back" : "Create your account"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && !errorValidator(email) && !errorValidator(password) && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <FormInputWithValidation
                label="Email or Username"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={setEmail}
                validator={emailValidator}
                hint="Use the demo email: demo@example.com"
                testId="input-email"
              />

              <FormInputWithValidation
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={setPassword}
                validator={passwordValidator}
                hint={
                  isLogin ? "Demo password: password" : "At least 6 characters"
                }
                testId="input-password"
              />

              <Button
                type="submit"
                className="w-full"
                disabled={
                  mutation.isPending ||
                  !!emailValidator(email) ||
                  !!passwordValidator(password)
                }
                data-testid="button-submit"
              >
                {mutation.isPending
                  ? "Loading..."
                  : isLogin
                    ? "Sign In"
                    : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary font-semibold hover:underline"
                  data-testid="button-toggle-auth"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t space-y-2">
              <p className="text-xs text-center text-muted-foreground font-medium">
                DEMO CREDENTIALS
              </p>
              <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1">
                <p>
                  <span className="font-semibold">Email:</span> demo@example.com
                </p>
                <p>
                  <span className="font-semibold">Password:</span> password
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Insurance policy management for EU citizens • GDPR Compliant
        </p>
      </div>
    </div>
  );
}
