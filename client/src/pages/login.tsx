import { useState } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertCircle, Mail, Lock, Chrome, Apple, Loader2, CheckCircle, Users, TrendingUp, MessageCircle, Phone, Star, Award, ShieldCheck } from "lucide-react";
import { FormInputWithValidation } from "@/components/form-input-with-validation";
import { SignupFlowModal } from "@/components/signup-flow-modal";
import { toast } from "sonner";

const createEmailValidator = (t: any) => (email: string): string | null => {
  if (!email) return t('login.emailRequired'); 
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return t('login.validEmail');
  return null;
};

const createPasswordValidator = (t: any) => (password: string): string | null => {
  if (!password) return t('login.passwordRequired');
  if (password.length < 6) return t('login.passwordLength');
  return null;
};

const getPartnerLogos = (t: any) => [
  { name: t('login.partners.nnHellas'), color: "from-orange-500 to-orange-600" },
  { name: t('login.partners.generali'), color: "from-red-500 to-red-600" },
  { name: t('login.partners.ergo'), color: "from-blue-600 to-blue-700" },
  { name: t('login.partners.ethniki'), color: "from-emerald-500 to-emerald-600" },
];

const getTrustStats = (t: any) => [
  { value: "250,000+", labelKey: 'login.greeksTrustUs', icon: Users },
  { value: "€2.3M", labelKey: 'login.claimsProcessed', icon: TrendingUp },
  { value: "€495", labelKey: 'login.avgSavings', icon: Award },
];

export default function LoginPage() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [showSignupFlow, setShowSignupFlow] = useState(false);

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
        throw new Error(data.error || t('notifications.authenticationFailed'));
      }

      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("auth_token", data.token || "demo-token");
      localStorage.setItem("user_id", data.id);
      toast.success(t('login.welcome'), {
        description: isLogin ? t('login.signedIn') : t('login.accountCreated')
      });
      if (!isLogin) {
        setShowSignupFlow(true);
      } else {
        setLocation("/");
      }
    },
    onError: (err: any) => {
      setError(err.message);
      toast.error(t('notifications.authenticationFailed'), { description: err.message });
    },
  });

  const emailValidator = createEmailValidator(t);
  const passwordValidator = createPasswordValidator(t);
  const trustStats = getTrustStats(t);

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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      localStorage.setItem("auth_token", `${provider}-demo-token`);
      localStorage.setItem("user_id", `user-${provider}-123`);
      
      toast.success(t('login.socialSignInSuccess', { provider }), {
        description: t('login.connectedVia', { provider })
      });
      
      setLocation("/");
    } catch (err) {
      toast.error(t('login.signInFailed'), {
        description: t('login.couldNotConnect', { provider })
      });
    } finally {
      setSocialLoading(null);
    }
  };

  const handleSignupFlowComplete = () => {
    setShowSignupFlow(false);
    localStorage.setItem("signup_flow_completed", "true");
    setLocation("/");
  };

  return (
    <>
      <SignupFlowModal 
        isOpen={showSignupFlow} 
        onClose={() => {
          setShowSignupFlow(false);
          setLocation("/");
        }}
        onComplete={handleSignupFlowComplete}
      />
      
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      {/* Trust Banner - Top */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-emerald-600 text-white py-3 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-4 md:gap-8 text-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span className="font-medium">{t('login.gdprCertified')}</span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-white/30" />
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="font-medium">{t('login.isoSecurity')}</span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-white/30" />
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            <span className="font-medium">{t('login.bankLicensed')}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-52px)]">
        {/* Left Side - Value Proposition */}
        <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 p-8 lg:p-16 flex flex-col justify-center text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-emerald-300 blur-3xl" />
          </div>

          <div className="relative z-10 space-y-8 max-w-xl">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="text-blue-600 h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{t('brand.name')}</h1>
                <p className="text-blue-100 text-sm">{t('login.tagline')}</p>
              </div>
            </div>

            {/* Main Value Proposition */}
            <div className="space-y-4">
              <Badge className="bg-white/20 text-white border-0 text-sm px-4 py-1.5 hover:bg-white/30">
                {t('login.trustedBy', { count: '250,000+' })}
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                {t('login.heroTitle', { count: 4 })}
                <span className="text-emerald-300"> {t('login.heroHighlight')}</span>
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                {t('login.heroDescription', { amount: '€1,500' })}
              </p>
            </div>

            {/* Trust Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {trustStats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold">{stat.value}</div>
                  <div className="text-xs text-blue-100 mt-1">{t(stat.labelKey)}</div>
                </div>
              ))}
            </div>

            {/* Partner Logos */}
            <div className="pt-6 border-t border-white/20">
              <p className="text-sm text-blue-100 mb-4">{t('login.recommendedBy')}</p>
              <div className="flex flex-wrap gap-3">
                {getPartnerLogos(t).map((partner, i) => (
                  <div key={i} className={`px-4 py-2 rounded-lg bg-gradient-to-r ${partner.color} text-white text-sm font-semibold shadow-lg`}>
                    {partner.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Agent Introduction */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mt-8">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-2xl font-bold">
                    M
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-400 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg">{t('login.agentName')}</h3>
                    <div className="flex">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-blue-100 text-sm" data-testid="text-agent-role">{t('login.agentSpecialist')}</p>
                  <p className="text-white/80 text-sm mt-2" data-testid="text-agent-stats">{t('login.agentStats')}</p>
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    <div className="flex items-center gap-1 text-xs text-emerald-300">
                      <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
                      <span data-testid="text-agent-online">{t('login.onlineNow')}</span>
                    </div>
                    <Button size="sm" variant="secondary" className="h-8 text-xs bg-white/20 hover:bg-white/30 border-0" data-testid="button-chat-agent">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      {t('login.chatWithMaria')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Proof Quote */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-blue-100 italic text-sm">
                "{t('login.testimonial')}"
              </p>
              <p className="text-white font-medium text-sm mt-2">— {t('login.testimonialAuthor')}</p>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
          <div className="w-full max-w-md">
            <Card className="shadow-2xl border-0 overflow-hidden">
              <CardHeader className="space-y-3 text-center pb-6 bg-gradient-to-r from-slate-50 to-blue-50">
                <CardTitle className="text-2xl font-bold text-slate-800">
                  {isLogin ? t('login.welcomeBack') : t('login.getStartedFree')}
                </CardTitle>
                <CardDescription className="text-slate-600">
                  {isLogin 
                    ? t('login.signInDescription') 
                    : t('login.signUpDescription')}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6 pb-6">
                <Tabs value={isLogin ? "signin" : "signup"} onValueChange={(val) => {
                  setIsLogin(val === "signin");
                  setError("");
                  setEmail("");
                  setPassword("");
                }} className="w-full">
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
                        label={t('actions.emailAddress')}
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
                            {t('actions.signingIn')}
                          </>
                        ) : (
                          t('login.signIn')
                        )}
                      </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="px-2 bg-white text-muted-foreground font-medium">{t('login.orContinueWith')}</span>
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
                            {t('login.connecting')}
                          </>
                        ) : (
                          <>
                            <Chrome className="h-5 w-5 mr-2 text-red-500" />
                            {t('login.continueWithGmail')}
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
                            {t('login.connecting')}
                          </>
                        ) : (
                          <>
                            <Apple className="h-5 w-5 mr-2 text-black" />
                            {t('login.continueWithApple')}
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Demo Credentials */}
                    <Alert className="bg-blue-50 border-blue-200 mt-6">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-700 text-xs">
                        <strong>{t('login.demoCredentials')}</strong> demo@example.com / password
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
                        label={t("actions.emailAddress")}
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={setEmail}
                        validator={emailValidator}
                        hint={t('login.keepItSimple')}
                        testId="input-email-signup"
                      />

                      <FormInputWithValidation
                        label={t("login.password")}
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={setPassword}
                        validator={passwordValidator}
                        hint={t('login.passwordMinimum')}
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
                            {t('login.creatingAccount')}
                          </>
                        ) : (
                          t('login.createFreeAccount')
                        )}
                      </Button>
                    </form>

                    {/* Trust Elements */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mt-4">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-emerald-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-emerald-800">{t('login.dataProtected')}</p>
                          <p className="text-xs text-emerald-600 mt-1">{t('login.mariaGuide')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="px-2 bg-white text-muted-foreground font-medium">{t('login.orSignUpWith')}</span>
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
                            {t('login.connecting')}
                          </>
                        ) : (
                          <>
                            <Chrome className="h-5 w-5 mr-2 text-red-500" />
                            {t('login.signUpWithGmail')}
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
                            {t('login.connecting')}
                          </>
                        ) : (
                          <>
                            <Apple className="h-5 w-5 mr-2 text-black" />
                            {t('login.signUpWithApple')}
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Terms */}
                    <p className="text-xs text-center text-muted-foreground mt-6">
                      {t('login.termsText')}{" "}
                      <span className="text-primary font-semibold hover:underline cursor-pointer">{t('login.termsOfService')}</span>
                    </p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Bottom Trust Badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                <span>{t('login.sslSecurity')}</span>
              </div>
              <div className="hidden sm:block">•</div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span>{t('login.gdprCompliant')}</span>
              </div>
              <div className="hidden sm:block">•</div>
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <span>{t('login.support247')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
