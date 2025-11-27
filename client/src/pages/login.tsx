import { useState } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertCircle, Mail, Lock, Chrome, Apple, Loader2 } from "lucide-react";
import { FormInputWithValidation } from "@/components/form-input-with-validation";
import { toast } from "sonner";

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
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

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
      toast.success(t('login.welcome'), {
        description: isLogin ? t('login.signedIn') : t('login.accountCreated')
      });
      setLocation("/");
    },
    onError: (err: any) => {
      setError(err.message);
      toast.error("Authentication failed", { description: err.message });
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

  const handleSocialAuth = async (provider: string) => {
    setSocialLoading(provider);
    try {
      // Simulate OAuth flow - in production, would redirect to OAuth provider
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      localStorage.setItem("auth_token", `${provider}-demo-token`);
      localStorage.setItem("user_id", `user-${provider}-123`);
      
      toast.success(`${provider} Sign In`, {
        description: `Connected via ${provider}. Welcome to PolicyWallet!`
      });
      
      setLocation("/");
    } catch (err) {
      toast.error("Sign In Failed", {
        description: `Could not connect to ${provider}. Please try again.`
      });
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 overflow-hidden">
          {/* Header */}
          <CardHeader className="space-y-3 text-center pb-6 bg-gradient-to-r from-blue-600 to-emerald-600 text-white">
            <div className="flex justify-center">
              <div className="h-14 w-14 bg-white rounded-lg flex items-center justify-center shadow-lg">
                <Shield className="text-emerald-600 h-7 w-7" />
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl font-bold text-white">PolicyWallet</CardTitle>
              <CardDescription className="text-emerald-50 text-sm mt-1">
                Your personal insurance wallet
              </CardDescription>
            </div>
          </CardHeader>

          {/* Content */}
          <CardContent className="pt-8 pb-6">
            <Tabs value={isLogin ? "signin" : "signup"} onValueChange={(val) => {
              setIsLogin(val === "signin");
              setError("");
              setEmail("");
              setPassword("");
            }} className="w-full">
              {/* Tab Triggers */}
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
                <TabsTrigger value="signin" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">
                  {t('login.signIn')}
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-white data-[state=active]:text-emerald-600">
                  {t('login.signUp')}
                </TabsTrigger>
              </TabsList>

              {/* Sign In Tab */}
              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive" className="animate-in fade-in">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <FormInputWithValidation
                    label={t('login.emailOrUsername')}
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={setEmail}
                    validator={emailValidator}
                    hint={t('login.demoEmail')}
                    testId="input-email-signin"
                  />

                  <FormInputWithValidation
                    label={t('login.password')}
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={setPassword}
                    validator={passwordValidator}
                    hint={t('login.demoPassword')}
                    testId="input-password-signin"
                  />

                  <Button
                    type="submit"
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    disabled={
                      mutation.isPending ||
                      !!emailValidator(email) ||
                      !!passwordValidator(password)
                    }
                    data-testid="button-signin"
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white text-muted-foreground font-medium">or continue with</span>
                  </div>
                </div>

                {/* Social Auth Buttons */}
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 border-2 hover:bg-blue-50 hover:border-blue-300 font-semibold"
                    onClick={() => handleSocialAuth("Gmail")}
                    disabled={socialLoading !== null}
                    data-testid="button-gmail-signin"
                  >
                    {socialLoading === "Gmail" ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Chrome className="h-5 w-5 mr-2 text-red-500" />
                        Gmail
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 border-2 hover:bg-blue-50 hover:border-blue-300 font-semibold"
                    onClick={() => handleSocialAuth("Microsoft")}
                    disabled={socialLoading !== null}
                    data-testid="button-microsoft-signin"
                  >
                    {socialLoading === "Microsoft" ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path fill="#00A4EF" d="M11.4 24H0V12.6h11.4V24z" />
                          <path fill="#7FBA00" d="M24 24H12.6V12.6H24V24z" />
                          <path fill="#00A4EF" d="M11.4 11.4H0V0h11.4v11.4z" />
                          <path fill="#FFB900" d="M24 11.4H12.6V0H24v11.4z" />
                        </svg>
                        Microsoft
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 border-2 hover:bg-gray-50 hover:border-gray-400 font-semibold"
                    onClick={() => handleSocialAuth("Apple")}
                    disabled={socialLoading !== null}
                    data-testid="button-apple-signin"
                  >
                    {socialLoading === "Apple" ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Apple className="h-5 w-5 mr-2 text-black" />
                        Apple
                      </>
                    )}
                  </Button>
                </div>

                {/* Demo Credentials */}
                <Alert className="bg-blue-50 border-blue-200 mt-6">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-700 text-xs">
                    <strong>Demo credentials:</strong> demo@example.com / password
                  </AlertDescription>
                </Alert>
              </TabsContent>

              {/* Sign Up Tab */}
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive" className="animate-in fade-in">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <FormInputWithValidation
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={setEmail}
                    validator={emailValidator}
                    hint="We'll use this to create your account"
                    testId="input-email-signup"
                  />

                  <FormInputWithValidation
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={setPassword}
                    validator={passwordValidator}
                    hint="Minimum 6 characters"
                    testId="input-password-signup"
                  />

                  <Button
                    type="submit"
                    className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                    disabled={
                      mutation.isPending ||
                      !!emailValidator(email) ||
                      !!passwordValidator(password)
                    }
                    data-testid="button-signup"
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white text-muted-foreground font-medium">or sign up with</span>
                  </div>
                </div>

                {/* Social Auth Buttons */}
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 border-2 hover:bg-blue-50 hover:border-blue-300 font-semibold"
                    onClick={() => handleSocialAuth("Gmail")}
                    disabled={socialLoading !== null}
                    data-testid="button-gmail-signup"
                  >
                    {socialLoading === "Gmail" ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Chrome className="h-5 w-5 mr-2 text-red-500" />
                        Gmail
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 border-2 hover:bg-blue-50 hover:border-blue-300 font-semibold"
                    onClick={() => handleSocialAuth("Microsoft")}
                    disabled={socialLoading !== null}
                    data-testid="button-microsoft-signup"
                  >
                    {socialLoading === "Microsoft" ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path fill="#00A4EF" d="M11.4 24H0V12.6h11.4V24z" />
                          <path fill="#7FBA00" d="M24 24H12.6V12.6H24V24z" />
                          <path fill="#00A4EF" d="M11.4 11.4H0V0h11.4v11.4z" />
                          <path fill="#FFB900" d="M24 11.4H12.6V0H24v11.4z" />
                        </svg>
                        Microsoft
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 border-2 hover:bg-gray-50 hover:border-gray-400 font-semibold"
                    onClick={() => handleSocialAuth("Apple")}
                    disabled={socialLoading !== null}
                    data-testid="button-apple-signup"
                  >
                    {socialLoading === "Apple" ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Apple className="h-5 w-5 mr-2 text-black" />
                        Apple
                      </>
                    )}
                  </Button>
                </div>

                {/* Terms */}
                <p className="text-xs text-center text-muted-foreground mt-6">
                  By creating an account, you agree to our{" "}
                  <span className="text-primary font-semibold hover:underline cursor-pointer">Terms of Service</span>
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Trust Badges */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            <span>256-bit SSL</span>
          </div>
          <div>•</div>
          <div>GDPR Compliant</div>
          <div>•</div>
          <div>EU Protected</div>
        </div>
      </div>
    </div>
  );
}
