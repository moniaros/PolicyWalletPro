import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Phone, 
  Video, 
  Star, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle,
  Clock,
  Mail,
  X
} from "lucide-react";

interface AgentSidebarProps {
  isExpanded?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function AgentSidebar({ isExpanded = true, onToggle, className = "" }: AgentSidebarProps) {
  const [showContactOptions, setShowContactOptions] = useState(false);

  return (
    <Card className={`bg-gradient-to-br from-blue-50 to-emerald-50 border-blue-200/50 shadow-lg ${className}`}>
      <div className="p-4">
        {/* Agent Header */}
        <div className="flex items-start gap-3">
          <div className="relative">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-xl font-bold text-white">
              M
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-emerald-400 rounded-full border-2 border-white flex items-center justify-center">
              <div className="h-2 w-2 bg-white rounded-full animate-pulse" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-slate-800 truncate">Maria Papadopoulou</h3>
              <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
            </div>
            <p className="text-xs text-muted-foreground">Your Insurance Specialist</p>
            <div className="flex items-center gap-1 mt-0.5">
              {[1,2,3,4,5].map((star) => (
                <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-xs text-muted-foreground ml-1">4.9</span>
            </div>
          </div>
        </div>

        {/* Online Status */}
        <div className="flex items-center gap-2 mt-3 p-2 bg-emerald-100/50 rounded-lg">
          <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-emerald-700">Online now</span>
          <span className="text-xs text-emerald-600">• Responds in &lt; 5 min</span>
        </div>

        {isExpanded && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="bg-white/60 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-blue-600">12</p>
                <p className="text-xs text-muted-foreground">Years Exp.</p>
              </div>
              <div className="bg-white/60 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-emerald-600">1,200+</p>
                <p className="text-xs text-muted-foreground">Clients</p>
              </div>
            </div>

            {/* Primary CTA */}
            <Button className="w-full mt-4 h-11 bg-emerald-600 hover:bg-emerald-700 font-semibold" data-testid="button-chat-agent-sidebar">
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat with Maria
            </Button>

            {/* Secondary Contact Options */}
            <div className="mt-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-muted-foreground hover:text-foreground"
                onClick={() => setShowContactOptions(!showContactOptions)}
                data-testid="button-toggle-contact-options"
              >
                More contact options
                {showContactOptions ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
              </Button>
              
              {showContactOptions && (
                <div className="space-y-2 mt-2 animate-in slide-in-from-top-2">
                  <Button variant="outline" size="sm" className="w-full justify-start" data-testid="button-call-agent">
                    <Phone className="h-4 w-4 mr-2" />
                    Call +30 210 123 4567
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" data-testid="button-schedule-video">
                    <Video className="h-4 w-4 mr-2" />
                    Schedule Video Call
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" data-testid="button-email-agent">
                    <Mail className="h-4 w-4 mr-2" />
                    maria@policywallet.gr
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 text-xs" data-testid="button-whatsapp">
                      WhatsApp
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-xs" data-testid="button-viber">
                      Viber
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Availability */}
            <div className="mt-4 pt-4 border-t border-blue-200/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Available Mon-Fri, 9:00-17:00</span>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

export function AgentFloatingBadge({ onClick }: { onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="fixed bottom-20 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
      data-testid="button-agent-floating"
    >
      <div className="relative">
        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
          M
        </div>
        <div className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-emerald-400 rounded-full border-2 border-emerald-500 animate-pulse" />
      </div>
      <span className="font-medium text-sm">Maria is online</span>
      <MessageCircle className="h-4 w-4" />
    </button>
  );
}

export function AgentRecommendationPill({ recommendation, onDismiss }: { recommendation: string; onDismiss?: () => void }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-xl" data-testid="agent-recommendation-pill">
      <div className="relative flex-shrink-0">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-sm font-bold text-white">
          M
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-emerald-400 rounded-full border-2 border-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-slate-800">Maria's Recommendation</span>
          <Badge variant="secondary" className="text-xs">New</Badge>
        </div>
        <p className="text-sm text-slate-600">{recommendation}</p>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="text-muted-foreground hover:text-foreground p-1" data-testid="button-dismiss-recommendation">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
