import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { policies, inNetworkServices, appointmentServiceTypes, inNetworkProviders, type AppointmentServiceType } from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Calendar as CalendarIcon, MapPin, Clock, Plus, Phone, Trash2, Edit2, AlertCircle, CheckCircle2, Network, FileText, Stethoscope, Timer, ChevronRight, Building2, Sun, Sunset, Moon, CreditCard, Shield, Bell, User, Mail, MessageSquare, Info, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface BookedAppointment {
  id: string;
  policyId: number;
  policyType: string;
  serviceTypeId: string;
  serviceName: string;
  provider: string;
  location: string;
  phone: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled";
  reason?: string;
  notes?: string;
  inNetwork?: boolean;
  coveredByInsurance?: boolean;
  urgency?: "routine" | "urgent" | "emergency";
  formData?: Record<string, any>;
}

export default function AppointmentsPage() {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [bookedAppointments, setBookedAppointments] = useState<BookedAppointment[]>([]);
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedPolicy, setSelectedPolicy] = useState<typeof policies[0] | null>(null);
  const [selectedServiceType, setSelectedServiceType] = useState<AppointmentServiceType | null>(null);
  const [selectedUrgency, setSelectedUrgency] = useState<"routine" | "urgent" | "emergency">("routine");
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentReason, setAppointmentReason] = useState("");
  const [appointmentNotes, setAppointmentNotes] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<BookedAppointment | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "confirmed" | "pending" | "cancelled">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("policyguard_booked_appointments");
    if (saved) {
      try {
        setBookedAppointments(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load appointments", e);
      }
    }
  }, []);

  const saveAppointments = (apts: BookedAppointment[]) => {
    localStorage.setItem("policyguard_booked_appointments", JSON.stringify(apts));
    setBookedAppointments(apts);
  };

  const handleRequestAppointment = () => {
    setStep(1);
    setSelectedPolicy(null);
    setSelectedServiceType(null);
    setSelectedUrgency("routine");
    setSelectedService(null);
    setAppointmentDate("");
    setAppointmentTime("");
    setAppointmentReason("");
    setAppointmentNotes("");
    setEditingId(null);
    setIsOpen(true);
  };

  const handleRescheduleClick = (apt: BookedAppointment) => {
    const policy = policies.find(p => p.id === apt.policyId);
    if (policy) {
      setSelectedPolicy(policy);
      setSelectedService({
        name: apt.serviceName,
        provider: apt.provider,
        location: apt.location,
        phone: apt.phone,
      });
      setAppointmentDate(apt.date);
      setAppointmentTime(apt.time);
      setAppointmentReason(apt.reason || "");
      setAppointmentNotes(apt.notes || "");
      setEditingId(apt.id);
      setStep(4);
      setIsOpen(true);
    }
  };

  const handlePolicySelect = (policy: typeof policies[0]) => {
    setSelectedPolicy(policy);
    setStep(2);
  };

  const getServiceTypesForPolicy = (): AppointmentServiceType[] => {
    if (!selectedPolicy) return [];
    return appointmentServiceTypes[selectedPolicy.type] || [];
  };

  const getProvidersForServiceType = (): any[] => {
    if (!selectedPolicy || !selectedServiceType) return [];
    const providers = inNetworkProviders[selectedPolicy.type] || [];
    return providers.filter(p => p.specialties.includes(selectedServiceType.id));
  };

  const handleServiceTypeSelect = (serviceType: AppointmentServiceType) => {
    setSelectedServiceType(serviceType);
    setSelectedUrgency(serviceType.urgencyLevels[0] || "routine");
    setStep(3);
  };

  const handleProviderSelect = (provider: any) => {
    setSelectedService(provider);
    setStep(4);
  };

  const getTranslatedServiceName = (serviceType: AppointmentServiceType): string => {
    const keyParts = serviceType.nameKey.split(".");
    if (keyParts.length >= 3) {
      const category = keyParts[1];
      const service = keyParts[2];
      return t(`appointmentTypes.${category}.${service}.name`);
    }
    return serviceType.id;
  };

  const getTranslatedServiceDesc = (serviceType: AppointmentServiceType): string => {
    const keyParts = serviceType.descriptionKey.split(".");
    if (keyParts.length >= 3) {
      const category = keyParts[1];
      const service = keyParts[2];
      return t(`appointmentTypes.${category}.${service}.description`);
    }
    return "";
  };

  const getUrgencyColor = (urgency: string): string => {
    switch (urgency) {
      case "emergency": return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
      case "urgent": return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800";
      default: return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
    }
  };

  const handleConfirmAppointment = () => {
    if (!appointmentDate || !appointmentTime) {
      toast.error(t("appointments.errorSelectDateTime"));
      return;
    }

    if (editingId) {
      const updated = bookedAppointments.map(apt =>
        apt.id === editingId
          ? { ...apt, date: appointmentDate, time: appointmentTime, status: "confirmed" as const, reason: appointmentReason, notes: appointmentNotes }
          : apt
      );
      saveAppointments(updated);
      toast.success(t("appointments.appointmentUpdated"));
    } else {
      const serviceName = selectedServiceType ? getTranslatedServiceName(selectedServiceType) : selectedService?.name || "";
      const newAppointment: BookedAppointment = {
        id: Date.now().toString(),
        policyId: selectedPolicy!.id,
        policyType: selectedPolicy!.type,
        serviceTypeId: selectedServiceType?.id || "",
        serviceName: serviceName,
        provider: selectedService?.name || "",
        location: selectedService?.location || "",
        phone: selectedService?.phone || "",
        date: appointmentDate,
        time: appointmentTime,
        status: "confirmed",
        reason: appointmentReason,
        notes: appointmentNotes,
        inNetwork: true,
        coveredByInsurance: true,
        urgency: selectedUrgency,
      };
      saveAppointments([...bookedAppointments, newAppointment]);
      toast.success(t("appointments.appointmentConfirmed"));
    }

    setIsOpen(false);
    setStep(1);
    setEditingId(null);
    setAppointmentReason("");
    setAppointmentNotes("");
  };

  const handleCancelAppointment = (apt: BookedAppointment) => {
    setAppointmentToCancel(apt);
    setCancelConfirmOpen(true);
  };

  const confirmCancel = () => {
    if (appointmentToCancel) {
      const updated = bookedAppointments.map(apt =>
        apt.id === appointmentToCancel.id ? { ...apt, status: "cancelled" as const } : apt
      );
      saveAppointments(updated);
      toast.success(t("appointments.appointmentCancelled"));
    }
    setCancelConfirmOpen(false);
    setAppointmentToCancel(null);
  };

  const handleCallProvider = (phone: string) => {
    window.location.href = `tel:${phone.replace(/\s/g, "")}`;
  };

  const activeAppointments = bookedAppointments.filter(a => filterStatus === "all" ? a.status !== "cancelled" : a.status === filterStatus);
  
  const filteredAppointments = activeAppointments.filter(apt => {
    const query = searchQuery.toLowerCase();
    return (
      apt.serviceName.toLowerCase().includes(query) ||
      apt.provider.toLowerCase().includes(query) ||
      apt.location.toLowerCase().includes(query) ||
      apt.policyType.toLowerCase().includes(query)
    );
  });

  const sortedAppointments = filteredAppointments.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const upcomingAppointments = bookedAppointments.filter(a => a.status !== "cancelled" && new Date(a.date) >= new Date()).length;
  const confirmedAppointments = bookedAppointments.filter(a => a.status === "confirmed").length;
  
  const getDaysUntil = (date: string) => {
    const today = new Date();
    const appointmentDate = new Date(date);
    const diffTime = appointmentDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            {t("appointments.appointments")}
          </h1>
          <p className="text-muted-foreground mt-2">{t("appointments.trackVisits")}</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="shadow-lg shadow-primary/20" onClick={handleRequestAppointment} data-testid="button-request-appointment">
              <Plus className="h-5 w-5 mr-2" />
              {t("appointments.requestAppointment")}
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full text-sm font-bold">
                  {step}
                </div>
                {step === 1 && t("appointments.selectPolicy")}
                {step === 2 && t("appointments.selectService")}
                {step === 3 && t("appointments.scheduleDateTime")}
                {step === 4 && (editingId ? t("appointments.confirmDetails") : t("appointments.additionalInfo"))}
                {step === 2 && selectedPolicy && <span className="text-primary ml-2">({selectedPolicy.type})</span>}
              </DialogTitle>
              <DialogDescription className="sr-only">Booking wizard step {step}</DialogDescription>
            </DialogHeader>

            {/* STEP 1: SELECT POLICY */}
            {step === 1 && (
              <div className="space-y-3 py-4 overflow-y-auto flex-1">
                {policies.map((policy) => {
                  const getDuration = () => {
                    const start = new Date(policy.effectiveDate);
                    const end = new Date(policy.expiry);
                    const months = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
                    return months >= 12 ? `${Math.round(months / 12)} ${t("appointments.policyYears")}` : `${months} ${t("appointments.policyMonths")}`;
                  };
                  
                  const getInsurerName = () => {
                    const insurerKey = `insurers.${policy.provider.toLowerCase().replace(/\s+/g, '')}`;
                    const translated = t(insurerKey);
                    return translated !== insurerKey ? translated : policy.provider;
                  };
                  
                  return (
                    <Card
                      key={policy.id}
                      className="cursor-pointer border-2 hover:border-primary transition-colors"
                      onClick={() => handlePolicySelect(policy)}
                      data-testid={`card-policy-${policy.id}`}
                    >
                      <CardContent className="p-4">
                        {/* Header: Icon, Product Name, Status */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-lg flex-shrink-0 ${policy.color}`}>
                              {policy.icon && <policy.icon className="h-6 w-6" />}
                            </div>
                            <div>
                              <h3 className="font-semibold text-base">{policy.productName || policy.type}</h3>
                              <p className="text-sm text-muted-foreground">{getInsurerName()}</p>
                            </div>
                          </div>
                          <Badge variant={policy.status === "Active" ? "default" : "secondary"} className="flex-shrink-0">
                            {t(`appointments.status${policy.status.replace(/\s+/g, '')}`)}
                          </Badge>
                        </div>

                        {/* Policy Details Grid - Critical Data Only */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm border-t pt-3">
                          {/* Policy Number */}
                          <div className="space-y-0.5">
                            <p className="text-xs text-muted-foreground">{t("appointments.policyNumber")}</p>
                            <p className="font-medium text-foreground">{policy.policyNumber}</p>
                          </div>
                          
                          {/* Policy Type */}
                          <div className="space-y-0.5">
                            <p className="text-xs text-muted-foreground">{t("appointments.policyType")}</p>
                            <p className="font-medium text-foreground">{policy.type}</p>
                          </div>
                          
                          {/* Duration */}
                          <div className="space-y-0.5">
                            <p className="text-xs text-muted-foreground">{t("appointments.policyDuration")}</p>
                            <p className="font-medium text-foreground">{getDuration()}</p>
                          </div>
                          
                          {/* Start Date */}
                          <div className="space-y-0.5">
                            <p className="text-xs text-muted-foreground">{t("appointments.startDate")}</p>
                            <p className="font-medium text-foreground">{new Date(policy.effectiveDate).toLocaleDateString("el-GR")}</p>
                          </div>
                          
                          {/* Vehicle Reg (if Auto policy) */}
                          {policy.vehicleReg && (
                            <div className="space-y-0.5">
                              <p className="text-xs text-muted-foreground">{t("appointments.vehicleReg")}</p>
                              <p className="font-medium text-foreground">{policy.vehicleReg}</p>
                            </div>
                          )}
                          
                          {/* Group Insurance Date (if exists) */}
                          {policy.groupInsuranceDate && (
                            <div className="space-y-0.5">
                              <p className="text-xs text-muted-foreground">{t("appointments.groupInsuranceDate")}</p>
                              <p className="font-medium text-foreground">{new Date(policy.groupInsuranceDate).toLocaleDateString("el-GR")}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* STEP 2: SELECT SERVICE TYPE */}
            {step === 2 && selectedPolicy && (
              <>
                <div className="space-y-3 py-4 max-h-[60vh] overflow-y-auto">
                  <p className="text-sm text-muted-foreground mb-4">{t("appointmentTypes.selectServiceType")}</p>
                  {getServiceTypesForPolicy().map((serviceType) => (
                    <Card
                      key={serviceType.id}
                      className="cursor-pointer border-2 hover:border-primary transition-colors"
                      onClick={() => handleServiceTypeSelect(serviceType)}
                      data-testid={`card-service-type-${serviceType.id}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-base">
                            {getTranslatedServiceName(serviceType)}
                          </h3>
                          <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {getTranslatedServiceDesc(serviceType)}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Timer className="h-3.5 w-3.5" />
                            <span>{t("appointmentTypes.estimatedDuration")}: {serviceType.estimatedDuration}</span>
                          </div>
                          <div className="flex gap-1">
                            {serviceType.urgencyLevels.map((level) => (
                              <Badge 
                                key={level} 
                                variant="outline" 
                                className={`text-xs ${getUrgencyColor(level)}`}
                              >
                                {t(`appointmentTypes.urgency.${level}`)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Button variant="outline" onClick={() => setStep(1)} className="w-full min-h-[44px]" data-testid="button-back-step1">
                  ← {t("common.back")}
                </Button>
              </>
            )}

            {/* STEP 3: SELECT PROVIDER */}
            {step === 3 && selectedPolicy && selectedServiceType && (
              <>
                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-3 space-y-1 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">{t("appointments.service")}</span>
                        <span className="font-semibold">{getTranslatedServiceName(selectedServiceType)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{t("appointments.urgencyLevel")}:</span>
                        <div className="flex gap-1">
                          {selectedServiceType.urgencyLevels.map((level) => (
                            <Badge 
                              key={level}
                              variant="outline"
                              className={`text-xs cursor-pointer transition-all ${
                                selectedUrgency === level 
                                  ? getUrgencyColor(level) + " ring-2 ring-offset-1 ring-current" 
                                  : "opacity-50"
                              }`}
                              onClick={() => setSelectedUrgency(level)}
                              data-testid={`badge-urgency-${level}`}
                            >
                              {t(`appointmentTypes.urgency.${level}`)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <p className="text-sm font-medium">{t("appointments.selectProvider")}</p>
                  
                  {getProvidersForServiceType().length > 0 ? (
                    getProvidersForServiceType().map((provider) => (
                      <Card
                        key={provider.id}
                        className="cursor-pointer border-2 hover:border-primary transition-colors"
                        onClick={() => handleProviderSelect(provider)}
                        data-testid={`card-provider-${provider.id}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold flex items-center gap-2 flex-wrap">
                              <Building2 className="h-4 w-4 text-primary" />
                              {provider.name}
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                                {t("appointments.inNetwork")}
                              </Badge>
                            </h3>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p className="flex items-center gap-2"><MapPin className="h-4 w-4" />{provider.location}</p>
                            <p className="flex items-center gap-2"><Phone className="h-4 w-4" />{provider.phone}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="border-dashed">
                      <CardContent className="p-6 text-center">
                        <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">{t("appointments.noProvidersAvailable")}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
                <Button variant="outline" onClick={() => setStep(2)} className="w-full min-h-[44px]" data-testid="button-back-step2">
                  ← {t("common.back")}
                </Button>
              </>
            )}

            {/* STEP 4: SELECT DATE & TIME */}
            {step === 4 && selectedPolicy && selectedService && (
              <>
                <div className="space-y-5 py-4 max-h-[70vh] overflow-y-auto">
                  {/* Progress Indicator */}
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">4</span>
                      <span className="hidden sm:inline">{t("appointments.step")} 4 {t("appointments.of")} 5</span>
                    </span>
                  </div>

                  {/* Section Header */}
                  <div className="text-center space-y-1">
                    <h3 className="font-semibold text-lg flex items-center justify-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                      {t("appointments.selectDateTime")}
                    </h3>
                    <p className="text-sm text-muted-foreground">{t("appointments.choosePreferredSlot")}</p>
                  </div>

                  {/* Compact Summary */}
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Stethoscope className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{selectedServiceType ? getTranslatedServiceName(selectedServiceType) : ""}</p>
                      <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {selectedService?.name}
                      </p>
                    </div>
                    {selectedUrgency && (
                      <Badge variant="outline" className={`text-xs flex-shrink-0 ${getUrgencyColor(selectedUrgency)}`}>
                        {t(`appointmentTypes.urgency.${selectedUrgency}`)}
                      </Badge>
                    )}
                  </div>

                  {/* Quick Date Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t("appointments.quickSelect")}</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: t("appointments.today"), days: 0 },
                        { label: t("appointments.tomorrow"), days: 1 },
                        { label: t("appointments.thisWeek"), days: 3 },
                      ].map(({ label, days }) => {
                        const targetDate = new Date();
                        targetDate.setDate(targetDate.getDate() + days);
                        const dateStr = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, "0")}-${String(targetDate.getDate()).padStart(2, "0")}`;
                        const isSelected = appointmentDate === dateStr;
                        return (
                          <Button
                            key={days}
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            className="min-h-[44px]"
                            onClick={() => setAppointmentDate(dateStr)}
                            data-testid={`button-quick-date-${days}`}
                          >
                            {label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Calendar */}
                  <div className="bg-card p-3 rounded-lg border flex justify-center">
                    <DayPicker
                      mode="single"
                      selected={appointmentDate ? new Date(appointmentDate) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          const yyyy = date.getFullYear();
                          const mm = String(date.getMonth() + 1).padStart(2, "0");
                          const dd = String(date.getDate()).padStart(2, "0");
                          setAppointmentDate(`${yyyy}-${mm}-${dd}`);
                        }
                      }}
                      className="p-0"
                      disabled={(date) => date < new Date() || date.getDay() === 0}
                    />
                  </div>

                  {/* Time Selection */}
                  <div className="space-y-3">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t("appointments.selectTime")}</label>
                    
                    {/* Time Period Tabs */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {[
                        { period: "morning", icon: Sun, times: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"] },
                        { period: "afternoon", icon: Sunset, times: ["12:00", "12:30", "13:00", "14:00", "14:30", "15:00"] },
                        { period: "evening", icon: Moon, times: ["16:00", "16:30", "17:00", "17:30", "18:00", "18:30"] },
                      ].map(({ period, icon: Icon }) => (
                        <div key={period} className="text-center">
                          <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/30">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{t(`appointments.${period}`)}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Time Slots Grid */}
                    <div className="grid grid-cols-4 gap-2">
                      {["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "14:00", "14:30", "15:00", "16:00", "17:00"].map((time) => {
                        const isSelected = appointmentTime === time;
                        return (
                          <Button
                            key={time}
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            className={`min-h-[44px] text-sm font-medium ${isSelected ? "ring-2 ring-primary ring-offset-2" : ""}`}
                            onClick={() => setAppointmentTime(time)}
                            data-testid={`button-time-${time.replace(":", "")}`}
                          >
                            {time}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selected Slot Summary */}
                  {(appointmentDate || appointmentTime) && (
                    <Card className="border-primary/30 bg-primary/5">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <Clock className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground">{t("appointments.selectedSlot")}</p>
                            <p className="font-semibold">
                              {appointmentDate ? new Date(appointmentDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : t("appointments.noDateSelected")}
                              {appointmentTime && ` • ${appointmentTime}`}
                            </p>
                          </div>
                          {appointmentDate && appointmentTime && (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" onClick={() => setStep(3)} className="flex-1 min-h-[48px]" data-testid="button-back-step3">
                      ← {t("common.back")}
                    </Button>
                    <Button 
                      onClick={() => setStep(5)} 
                      className="flex-1 min-h-[48px] shadow-lg shadow-primary/20"
                      disabled={!appointmentDate || !appointmentTime}
                      data-testid="button-next-step5"
                    >
                      {t("common.next")} →
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* STEP 5: ADDITIONAL INFO & CONFIRM */}
            {step === 5 && selectedPolicy && selectedService && appointmentDate && appointmentTime && (
              <>
                <div className="space-y-5 py-4 max-h-[70vh] overflow-y-auto">
                  {/* Progress Indicator */}
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">5</span>
                      <span className="hidden sm:inline">{t("appointments.step")} 5 {t("appointments.of")} 5</span>
                    </span>
                  </div>

                  {/* Section Header */}
                  <div className="text-center space-y-1">
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-2">
                      <Sparkles className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-semibold text-lg">{t("appointments.reviewAndConfirm")}</h3>
                    <p className="text-sm text-muted-foreground">{t("appointments.almostDone")}</p>
                  </div>

                  {/* Appointment Summary Card */}
                  <Card className="border-2 border-primary/20 overflow-hidden">
                    <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-2 border-b">
                      <h4 className="font-medium text-sm flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        {t("appointments.appointmentSummary")}
                      </h4>
                    </div>
                    <CardContent className="p-4 space-y-4">
                      {/* Service & Provider */}
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Stethoscope className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold">{selectedServiceType ? getTranslatedServiceName(selectedServiceType) : ""}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {selectedService?.name}
                          </p>
                        </div>
                        {selectedUrgency && (
                          <Badge variant="outline" className={`text-xs ${getUrgencyColor(selectedUrgency)}`}>
                            {t(`appointmentTypes.urgency.${selectedUrgency}`)}
                          </Badge>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="border-t border-dashed" />

                      {/* Date & Time */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">{t("appointments.date")}</p>
                            <p className="font-medium text-sm">
                              {new Date(appointmentDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">{t("appointments.time")}</p>
                            <p className="font-medium text-sm">{appointmentTime}</p>
                          </div>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <p className="text-sm">{selectedService?.location}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Visit Details Form */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm flex items-center gap-2 text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      {t("appointments.visitDetails")}
                    </h4>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t("appointments.reasonForVisit")}</label>
                      <input
                        type="text"
                        placeholder={t("appointments.reasonPlaceholder")}
                        value={appointmentReason}
                        onChange={(e) => setAppointmentReason(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[48px] bg-background"
                        data-testid="input-appointment-reason"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t("appointments.appointmentNotes")}</label>
                      <textarea
                        placeholder={t("appointments.notesPlaceholder")}
                        value={appointmentNotes}
                        onChange={(e) => setAppointmentNotes(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none bg-background"
                        data-testid="textarea-appointment-notes"
                      />
                    </div>
                  </div>

                  {/* Insurance & Coverage Card */}
                  <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0">
                          <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-green-900 dark:text-green-100 flex items-center gap-2">
                            {t("appointments.insuranceCoverage")}
                            <Badge className="bg-green-600 text-white text-xs">{t("appointments.fullyCovaried")}</Badge>
                          </h4>
                          <p className="text-sm text-green-700 dark:text-green-300 mt-1">{t("appointments.noOutOfPocket")}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-green-200 dark:border-green-800 grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm text-green-800 dark:text-green-200">
                          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span>{t("appointments.inNetwork")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-green-800 dark:text-green-200">
                          <CreditCard className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span>{t("appointments.coveredByInsurance")}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* What to Expect */}
                  <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      {t("appointments.whatToExpect")}
                    </h4>
                    <div className="space-y-2">
                      {[
                        { icon: User, text: t("appointments.bringId") },
                        { icon: Clock, text: t("appointments.arriveEarly") },
                        { icon: Bell, text: t("appointments.confirmationSent") },
                      ].map(({ icon: Icon, text }, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm text-muted-foreground">
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          <span>{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" onClick={() => setStep(4)} className="flex-1 min-h-[48px]" data-testid="button-back-step4">
                      ← {t("common.back")}
                    </Button>
                    <Button 
                      onClick={handleConfirmAppointment} 
                      className="flex-1 min-h-[48px] shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-primary/90"
                      data-testid="button-confirm-booking"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      {editingId ? t("appointments.updateAppointment") : t("appointments.confirmBooking")}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters & Search */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder={t("appointments.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                data-testid="input-search-appointments"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "confirmed", "pending", "cancelled"] as const).map((status) => (
                <Button
                  key={status}
                  size="sm"
                  variant={filterStatus === status ? "default" : "outline"}
                  onClick={() => setFilterStatus(status)}
                  data-testid={`button-filter-${status}`}
                >
                  {t(`appointments.filter${status.charAt(0).toUpperCase() + status.slice(1)}`) || status}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Left: Calendar & Stats */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-4">
              <div className="flex justify-center">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="p-0"
                  modifiersClassNames={{ selected: "bg-primary text-white rounded-md" }}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{bookedAppointments.filter(a => a.status !== "cancelled").length}</div>
                <p className="text-xs text-muted-foreground">{t("appointments.total")}</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {confirmedAppointments}
                </div>
                <p className="text-xs text-muted-foreground">{t("appointments.confirmed")}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right: Appointments List */}
        <div className="lg:col-span-2">
          {sortedAppointments.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-12 text-center">
                <CalendarIcon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">{t("appointments.noAppointments")}</h3>
                <p className="text-muted-foreground mb-4">{t("appointments.requestNew")}</p>
                <Button onClick={handleRequestAppointment} size="sm" data-testid="button-book-now">
                  <Plus className="h-4 w-4 mr-2" />
                  {t("appointments.bookNow")}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sortedAppointments.map((apt) => {
                const daysUntil = getDaysUntil(apt.date);
                const isUrgent = daysUntil <= 3 && daysUntil > 0;
                
                return (
                  <Card
                    key={apt.id}
                    className={`border-l-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                      isUrgent ? "border-l-amber-500 bg-amber-50/30" : "border-l-primary"
                    }`}
                    data-testid={`card-appointment-${apt.id}`}
                  >
                    <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 p-3 rounded-xl flex flex-col items-center justify-center min-w-[70px] shadow-sm">
                          <span className="text-xs font-bold uppercase">
                            {new Date(apt.date).toLocaleString("en-US", { month: "short" })}
                          </span>
                          <span className="text-2xl font-bold">{new Date(apt.date).getDate()}</span>
                          {daysUntil > 0 && <span className="text-xs text-blue-600 font-medium">{daysUntil}d away</span>}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="font-bold text-lg">{apt.serviceName}</h3>
                            <Badge variant="secondary" className="text-xs h-6">{apt.policyType}</Badge>
                            <Badge className={`text-xs h-6 ${apt.status === "confirmed" ? "bg-emerald-100 text-emerald-800" : apt.status === "pending" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}`}>
                              {apt.status === "confirmed" ? "✓ " : ""}{t(`appointments.${apt.status}`)}
                            </Badge>
                            {isUrgent && <Badge className="text-xs h-6 bg-amber-100 text-amber-800"><AlertCircle className="h-3 w-3 mr-1" />{t("appointments.upcoming")}</Badge>}
                          </div>
                          <p className="text-sm font-semibold text-foreground mb-2">{apt.provider}</p>
                          {apt.reason && <p className="text-xs text-muted-foreground mb-2"><FileText className="h-3 w-3 inline mr-1" />{apt.reason}</p>}
                          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-lg">
                              <Clock className="h-4 w-4" /> {apt.time}
                            </span>
                            <span className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-lg">
                              <MapPin className="h-4 w-4" /> {apt.location}
                            </span>
                            {apt.inNetwork && <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200"><Network className="h-3 w-3 mr-1" />{t("appointments.inNetwork")}</Badge>}
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col gap-2 sm:items-end">
                        <Button size="sm" variant="outline" onClick={() => handleCallProvider(apt.phone)} data-testid="button-call-provider">
                          <Phone className="h-4 w-4 mr-1" /> {t("appointments.call")}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleRescheduleClick(apt)} data-testid="button-reschedule">
                          <Edit2 className="h-4 w-4 mr-1" /> {t("appointments.reschedule")}
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleCancelAppointment(apt)} data-testid="button-cancel-appointment">
                          <Trash2 className="h-4 w-4 mr-1" /> {t("appointments.cancel")}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelConfirmOpen} onOpenChange={setCancelConfirmOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{t("appointments.cancelConfirm")}</DialogTitle>
            <DialogDescription>
              {t("appointments.cancelMessage")}
            </DialogDescription>
          </DialogHeader>
          {appointmentToCancel && (
            <div className="space-y-2 my-4 p-3 bg-muted rounded-lg">
              <p className="text-sm font-semibold">{appointmentToCancel.serviceName}</p>
              <p className="text-xs text-muted-foreground">{appointmentToCancel.provider}</p>
              <p className="text-xs text-muted-foreground">{appointmentToCancel.date} at {appointmentToCancel.time}</p>
            </div>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCancelConfirmOpen(false)} className="flex-1">
              {t("common.cancel")}
            </Button>
            <Button onClick={confirmCancel} className="flex-1 bg-red-600 hover:bg-red-700" data-testid="button-confirm-cancel">
              {t("appointments.confirm")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
