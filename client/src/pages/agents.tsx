import { useState } from "react";
import { useTranslation } from "react-i18next";
import { agents } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Star, Phone, Mail, MessageSquare, Clock, MapPin, Briefcase, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";

const AGENT_PHONE = "+306956338110";
const AGENT_WHATSAPP = "306956338110"; // Without +
const AGENT_EMAIL = "agent@policyguard.gr";

export default function AgentsPage() {
  const { t } = useTranslation();
  const [contactSent, setContactSent] = useState(false);
  // Using first agent as current agent
  const currentAgent = agents[0];

  const handleCall = () => {
    window.location.href = `tel:${AGENT_PHONE}`;
    toast.success(t('agents.openingCall'), { description: `${t('agents.callingAgent')} ${AGENT_PHONE}` });
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${AGENT_WHATSAPP}?text=Hello%20${currentAgent.name}%2C%20I%20would%20like%20to%20discuss%20my%20insurance%20policies.`, "_blank");
    toast.success(t('agents.openingWhatsapp'), { description: `${t('agents.chatOnWhatsapp')} ${currentAgent.name}` });
  };

  const handleViber = () => {
    window.location.href = `viber://contact?number=${AGENT_WHATSAPP}`;
    toast.success(t('agents.openingViber'), { description: `${t('agents.chatOnViber')} ${currentAgent.name}` });
  };

  const handleEmail = () => {
    window.location.href = `mailto:${AGENT_EMAIL}?subject=Insurance%20Inquiry`;
    toast.success(t('agents.openingEmail'), { description: `${t('agents.emailTo')} ${currentAgent.name}` });
  };

  const handleMessage = () => {
    setContactSent(true);
    toast.success(t('agents.messageSent'), { description: `${currentAgent.name} ${t('agents.willGetBack')}` });
    setTimeout(() => setContactSent(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-full sm:max-w-4xl">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">{t('agents.agentDetails')}</h1>
        <p className="text-muted-foreground mt-2 text-lg">{t('common.actions')}</p>
      </div>

      {/* Main Agent Card */}
      <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-blue-50 overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {/* Agent Info Section */}
            <div className="md:col-span-2 p-8 space-y-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                  <AvatarImage src={currentAgent.avatar} />
                  <AvatarFallback className="text-2xl">{currentAgent.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-3xl font-bold">{currentAgent.name}</h2>
                    <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">Active</Badge>
                  </div>
                  <p className="text-emerald-700 font-semibold mt-1">{currentAgent.specialty}</p>
                  <div className="flex items-center gap-1 text-amber-600 mt-2">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-bold text-sm">{currentAgent.rating}/5</span>
                    <span className="text-muted-foreground text-sm">({currentAgent.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">{currentAgent.about}</p>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-white rounded-lg border border-emerald-100">
                  <p className="text-xs text-muted-foreground">{ t("details.experience") }</p>
                  <p className="font-bold text-lg">{currentAgent.experience}</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-emerald-100">
                  <p className="text-xs text-muted-foreground">Active Clients</p>
                  <p className="font-bold text-lg">{currentAgent.reviews * 2}+</p>
                </div>
              </div>
            </div>

            {/* Contact Methods Section */}
            <div className="bg-white border-l border-emerald-100 p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Contact Methods</p>

                {/* Phone Call */}
                <Button
                  onClick={handleCall}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-start"
                  data-testid="button-call-agent"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>

                {/* WhatsApp */}
                <Button
                  onClick={handleWhatsApp}
                  className="w-full bg-green-600 hover:bg-green-700 text-white justify-start"
                  data-testid="button-whatsapp-agent"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>

                {/* Viber */}
                <Button
                  onClick={handleViber}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white justify-start"
                  data-testid="button-viber-agent"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Viber
                </Button>

                {/* Email */}
                <Button
                  onClick={handleEmail}
                  variant="outline"
                  className="w-full border-2 border-gray-300 hover:bg-gray-50 justify-start"
                  data-testid="button-email-agent"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
              </div>

              {/* Phone Number Display */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-xs text-muted-foreground mb-1">Direct Phone</p>
                <p className="font-mono font-bold text-lg text-blue-600">{AGENT_PHONE}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Availability & Response Time */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-emerald-600" />
            Availability & Response Times
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-muted-foreground">Working Hours</p>
              <p className="font-bold text-lg">Monday - Friday</p>
              <p className="text-sm text-muted-foreground">09:00 - 18:00 (EET)</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-muted-foreground">Call Response</p>
              <p className="font-bold text-lg">Average 2 mins</p>
              <p className="text-sm text-muted-foreground">During business hours</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm text-muted-foreground">Message Response</p>
              <p className="font-bold text-lg">Average 1 hour</p>
              <p className="text-sm text-muted-foreground">WhatsApp & Email</p>
            </div>
          </div>

          <Alert className="bg-emerald-50 border-emerald-200">
            <MapPin className="h-4 w-4 text-emerald-600" />
            <AlertDescription className="text-emerald-700">
              <strong>{t('agentServices.basedInAthens')}</strong> - {t('agentServices.servingClients')}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Services Provided */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-emerald-600" />
            {t('agentServices.servicesProvided')}
          </CardTitle>
          <CardDescription>{t('agentServices.whatYouCanGetHelp')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              t('agentServices.policySelection'),
              t('agentServices.claimsAssistance'),
              t('agentServices.policyReviews'),
              t('agentServices.coverageGapAnalysis'),
              t('agents.quoteRequests'),
              t('agentServices.policyRenewals'),
              t('agentServices.documentSupport'),
              t('agentServices.emergencySupport'),
            ].map((service, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="h-5 w-5 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <p className="text-sm font-medium">{service}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Contact Section */}
      <Card className="bg-gradient-to-r from-emerald-50 to-blue-50">
        <CardHeader>
          <CardTitle>{t('agentServices.sendQuickMessage')}</CardTitle>
          <CardDescription>{t('agentServices.dontSeeQuestion')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <textarea
              placeholder={t('agentServices.tellUsWhatNeed')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              rows={3}
              data-testid="textarea-agent-message"
            />
            <Button
              onClick={handleMessage}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              data-testid="button-send-message"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {contactSent ? t('agents.messageSent') : t('agents.sendMessage')}
            </Button>
          </div>

          <Alert className="bg-white border-emerald-200">
            <AlertDescription className="text-sm">
              💡 For urgent matters, calling during business hours is fastest. We're here to help!
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
