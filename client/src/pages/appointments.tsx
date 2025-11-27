import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { policies, inNetworkServices } from "@/lib/mockData";
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
import { Calendar as CalendarIcon, MapPin, Clock, Plus, Phone, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";

interface BookedAppointment {
  id: string;
  policyId: number;
  policyType: string;
  serviceName: string;
  provider: string;
  location: string;
  phone: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled";
}

export default function AppointmentsPage() {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [bookedAppointments, setBookedAppointments] = useState<BookedAppointment[]>([]);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedPolicy, setSelectedPolicy] = useState<typeof policies[0] | null>(null);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<BookedAppointment | null>(null);

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
    setSelectedService(null);
    setAppointmentDate("");
    setAppointmentTime("");
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
      setEditingId(apt.id);
      setStep(3);
      setIsOpen(true);
    }
  };

  const handlePolicySelect = (policy: typeof policies[0]) => {
    setSelectedPolicy(policy);
    setStep(2);
  };

  const getServicesForPolicy = () => {
    if (!selectedPolicy) return [];
    return (inNetworkServices as any)[selectedPolicy.type] || [];
  };

  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
    setStep(3);
  };

  const handleConfirmAppointment = () => {
    if (!appointmentDate || !appointmentTime) {
      toast.error(t("appointments.errorSelectDateTime") || "Please select date and time");
      return;
    }

    if (editingId) {
      const updated = bookedAppointments.map(apt =>
        apt.id === editingId
          ? { ...apt, date: appointmentDate, time: appointmentTime, status: "confirmed" as const }
          : apt
      );
      saveAppointments(updated);
      toast.success(t("appointments.appointmentUpdated") || "Appointment rescheduled!");
    } else {
      const newAppointment: BookedAppointment = {
        id: Date.now().toString(),
        policyId: selectedPolicy!.id,
        policyType: selectedPolicy!.type,
        serviceName: selectedService.name,
        provider: selectedService.provider,
        location: selectedService.location,
        phone: selectedService.phone,
        date: appointmentDate,
        time: appointmentTime,
        status: "confirmed",
      };
      saveAppointments([...bookedAppointments, newAppointment]);
      toast.success(t("appointments.appointmentConfirmed") || "Appointment booked successfully!");
    }

    setIsOpen(false);
    setStep(1);
    setEditingId(null);
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
      toast.success(t("appointments.appointmentCancelled") || "Appointment cancelled");
    }
    setCancelConfirmOpen(false);
    setAppointmentToCancel(null);
  };

  const handleCallProvider = (phone: string) => {
    window.location.href = `tel:${phone.replace(/\s/g, "")}`;
  };

  const activeAppointments = bookedAppointments.filter(a => a.status !== "cancelled");
  const sortedAppointments = activeAppointments.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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
            <Button size="lg" className="shadow-lg shadow-primary/20" onClick={handleRequestAppointment}>
              <Plus className="h-5 w-5 mr-2" />
              {t("appointments.requestAppointment") || "Request Appointment"}
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full text-sm font-bold">
                  {step}
                </div>
                {step === 1 && (t("appointments.selectPolicy") || "Select Your Policy")}
                {step === 2 && (t("appointments.selectService") || "Select Service")}
                {step === 3 && (editingId ? t("appointments.reschedule") : t("appointments.scheduleDateTime") || "Schedule Date & Time")}
                {step === 2 && selectedPolicy && <span className="text-primary ml-2">({selectedPolicy.type})</span>}
              </DialogTitle>
              <DialogDescription className="sr-only">Booking wizard step {step}</DialogDescription>
            </DialogHeader>

            {/* STEP 1: SELECT POLICY */}
            {step === 1 && (
              <div className="space-y-3 py-4">
                {policies.map((policy) => (
                  <Card
                    key={policy.id}
                    className="cursor-pointer border-2 hover:border-primary transition-colors"
                    onClick={() => handlePolicySelect(policy)}
                    data-testid={`card-policy-${policy.id}`}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg ${policy.color}`}>
                          {policy.icon && <policy.icon className="h-6 w-6" />}
                        </div>
                        <div>
                          <h3 className="font-semibold">{policy.type}</h3>
                          <p className="text-sm text-muted-foreground">{policy.provider}</p>
                          <p className="text-xs text-muted-foreground mt-1">{policy.policyNumber}</p>
                        </div>
                      </div>
                      <Badge variant={policy.status === "Active" ? "default" : "secondary"}>
                        {policy.status}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* STEP 2: SELECT SERVICE */}
            {step === 2 && selectedPolicy && (
              <>
                <div className="space-y-3 py-4 max-h-96 overflow-y-auto">
                  {getServicesForPolicy().map((service: any) => (
                    <Card
                      key={service.id}
                      className="cursor-pointer border-2 hover:border-primary transition-colors"
                      onClick={() => handleServiceSelect(service)}
                      data-testid={`card-service-${service.id}`}
                    >
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">{service.name}</h3>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p><strong>{service.provider}</strong></p>
                          <p className="flex items-center gap-2"><MapPin className="h-4 w-4" />{service.location}</p>
                          <p className="flex items-center gap-2"><Phone className="h-4 w-4" />{service.phone}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Button variant="outline" onClick={() => setStep(1)} className="w-full">
                  ← {t("common.back")}
                </Button>
              </>
            )}

            {/* STEP 3: SELECT DATE & TIME */}
            {step === 3 && selectedPolicy && selectedService && (
              <>
                <div className="space-y-6 py-4">
                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-4 space-y-2 text-sm">
                      <div><p className="text-xs text-muted-foreground">{t("appointments.policy")}</p><p className="font-semibold">{selectedPolicy.type}</p></div>
                      <div><p className="text-xs text-muted-foreground">{t("appointments.service")}</p><p className="font-semibold">{selectedService.name}</p></div>
                      <div><p className="text-xs text-muted-foreground">{t("appointments.provider")}</p><p className="font-semibold">{selectedService.provider}</p></div>
                    </CardContent>
                  </Card>

                  <div className="bg-white p-3 rounded-lg border flex justify-center">
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
                      disabled={(date) => date < new Date()}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">{t("appointments.appointmentTime")}</label>
                    <input
                      type="time"
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      data-testid="input-appointment-time"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                      ← {t("common.back")}
                    </Button>
                    <Button onClick={handleConfirmAppointment} className="flex-1 shadow-lg shadow-primary/20">
                      {editingId ? t("appointments.reschedule") : t("appointments.confirmBooking") || "Confirm"}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

          <div className="grid grid-cols-2 gap-3">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{activeAppointments.length}</div>
                <p className="text-xs text-muted-foreground">{t("appointments.total") || "Total"}</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {activeAppointments.filter((a) => a.status === "confirmed").length}
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
                <p className="text-muted-foreground">{t("appointments.requestNew")}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sortedAppointments.map((apt) => (
                <Card
                  key={apt.id}
                  className="border-l-4 border-l-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  data-testid={`card-appointment-${apt.id}`}
                >
                  <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 p-3 rounded-xl flex flex-col items-center justify-center min-w-[70px] shadow-sm">
                        <span className="text-xs font-bold uppercase">
                          {new Date(apt.date).toLocaleString("en-US", { month: "short" })}
                        </span>
                        <span className="text-2xl font-bold">{new Date(apt.date).getDate()}</span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="font-bold text-lg">{apt.serviceName}</h3>
                          <Badge variant="secondary" className="text-xs h-6">{apt.policyType}</Badge>
                          <Badge className="text-xs h-6 bg-emerald-100 text-emerald-800">
                            {apt.status === "confirmed" ? "✓ " : ""}{t(`appointments.${apt.status}`) || apt.status}
                          </Badge>
                        </div>
                        <p className="text-sm font-semibold text-foreground mb-2">{apt.provider}</p>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-lg">
                            <Clock className="h-4 w-4" /> {apt.time}
                          </span>
                          <span className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-lg">
                            <MapPin className="h-4 w-4" /> {apt.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-2 sm:items-end">
                      <Button size="sm" variant="outline" onClick={() => handleCallProvider(apt.phone)} data-testid="button-call-provider">
                        <Phone className="h-4 w-4 mr-1" /> Call
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleRescheduleClick(apt)} data-testid="button-reschedule">
                        <Edit2 className="h-4 w-4 mr-1" /> Reschedule
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleCancelAppointment(apt)} data-testid="button-cancel-appointment">
                        <Trash2 className="h-4 w-4 mr-1" /> Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelConfirmOpen} onOpenChange={setCancelConfirmOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{t("appointments.cancelConfirm") || "Cancel Appointment?"}</DialogTitle>
            <DialogDescription>
              {t("appointments.cancelMessage") || "Are you sure you want to cancel this appointment?"}
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
              {t("appointments.confirm") || "Cancel Appointment"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
