import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon, MapPin, Clock, Plus, Edit2, Trash2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  type: string;
  status: "confirmed" | "pending" | "cancelled";
}

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    doctor: "Dr. Papadopoulos",
    specialty: "Cardiologist",
    date: "2025-11-28",
    time: "10:00 AM",
    location: "Hygeia Hospital",
    type: "Annual Checkup (NN)",
    status: "confirmed",
  },
  {
    id: "2",
    doctor: "Vet Clinic 'Happy Paws'",
    specialty: "Veterinarian",
    date: "2025-12-05",
    time: "5:30 PM",
    location: "Kifisia Vet Center",
    type: "Vaccination (Max)",
    status: "confirmed",
  },
];

export default function AppointmentsPage() {
  const { t } = useTranslation();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    doctor: "",
    specialty: "",
    date: "",
    time: "",
    location: "",
    type: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("policyguard_appointments");
    if (saved) {
      try {
        setAppointments(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load appointments", e);
      }
    }
  }, []);

  const saveAppointments = (apts: Appointment[]) => {
    localStorage.setItem("policyguard_appointments", JSON.stringify(apts));
    setAppointments(apts);
  };

  const handleCreateAppointment = () => {
    if (!formData.doctor || !formData.date || !formData.time) {
      toast.error(t("common.errorFillRequired") || "Please fill all required fields");
      return;
    }

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      doctor: formData.doctor,
      specialty: formData.specialty,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      type: formData.type,
      status: "pending",
    };

    saveAppointments([...appointments, newAppointment]);
    setFormData({ doctor: "", specialty: "", date: "", time: "", location: "", type: "" });
    setIsCreateOpen(false);
    toast.success(t("appointments.appointmentCreated") || "Appointment created successfully");
  };

  const handleUpdateAppointment = () => {
    if (!editingId || !formData.doctor || !formData.date || !formData.time) {
      toast.error(t("common.errorFillRequired") || "Please fill all required fields");
      return;
    }

    const updated = appointments.map((apt) =>
      apt.id === editingId
        ? {
            ...apt,
            doctor: formData.doctor,
            specialty: formData.specialty,
            date: formData.date,
            time: formData.time,
            location: formData.location,
            type: formData.type,
          }
        : apt
    );

    saveAppointments(updated);
    setFormData({ doctor: "", specialty: "", date: "", time: "", location: "", type: "" });
    setIsEditOpen(false);
    setEditingId(null);
    toast.success(t("appointments.appointmentUpdated") || "Appointment updated successfully");
  };

  const handleEditClick = (apt: Appointment) => {
    setFormData({
      doctor: apt.doctor,
      specialty: apt.specialty,
      date: apt.date,
      time: apt.time,
      location: apt.location,
      type: apt.type,
    });
    setEditingId(apt.id);
    setIsEditOpen(true);
  };

  const handleDeleteAppointment = (id: string) => {
    const filtered = appointments.filter((apt) => apt.id !== id);
    saveAppointments(filtered);
    toast.success(t("appointments.appointmentCancelled") || "Appointment cancelled");
  };

  const upcomingAppointments = appointments
    .filter((apt) => apt.status !== "cancelled")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">{t("appointments.appointments")}</h1>
          <p className="text-muted-foreground mt-2">{t("appointments.trackVisits")}</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="shadow-lg shadow-primary/20">
              <Plus className="h-5 w-5 mr-2" />
              {t("appointments.newAppointment")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>{t("appointments.scheduleAppointment")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="doctor">
                  {t("appointments.doctor")} *
                </Label>
                <Input
                  id="doctor"
                  placeholder="Dr. Name"
                  value={formData.doctor}
                  onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                  data-testid="input-doctor"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialty">{t("appointments.specialty") || "Specialty"}</Label>
                <Input
                  id="specialty"
                  placeholder="e.g., Cardiologist"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">
                  {t("appointments.appointmentDate")} *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  data-testid="input-appointment-date"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">
                  {t("appointments.appointmentTime")} *
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  data-testid="input-appointment-time"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">{t("appointments.location") || "Location"}</Label>
                <Input
                  id="location"
                  placeholder="Hospital/Clinic"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">{t("appointments.appointmentType") || "Type"}</Label>
                <Input
                  id="type"
                  placeholder="e.g., Annual Checkup"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                />
              </div>
              <Button onClick={handleCreateAppointment} className="w-full">
                {t("common.save")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Calendar & Quick Action */}
        <div className="lg:col-span-1 space-y-6">
          {/* Calendar Card */}
          <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 via-transparent to-transparent">
            <CardContent className="p-4">
              <div className="flex justify-center">
                <DayPicker
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="p-0"
                  modifiersClassNames={{
                    selected: "bg-primary text-white rounded-md",
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Action Card */}
          <Card className="border-0 bg-gradient-to-br from-primary/10 to-primary/5 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start gap-2 mb-3">
                <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <h3 className="font-semibold text-primary">{t("appointments.needCheckup")}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{t("appointments.recommendCheckup")}</p>
              <Button className="w-full shadow-lg shadow-primary/20">{t("appointments.bookAppointment")}</Button>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{upcomingAppointments.length}</div>
                <p className="text-xs text-muted-foreground">{t("appointments.upcoming")}</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {appointments.filter((a) => a.status === "confirmed").length}
                </div>
                <p className="text-xs text-muted-foreground">{t("appointments.confirmed")}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column: Appointments List */}
        <div className="lg:col-span-2">
          {upcomingAppointments.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-12 text-center">
                <CalendarIcon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">{t("appointments.noAppointments") || "No appointments"}</h3>
                <p className="text-muted-foreground mb-4">{t("appointments.scheduleOne") || "Schedule your first appointment"}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((apt) => (
                <Card
                  key={apt.id}
                  className="border-l-4 border-l-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  data-testid={`card-appointment-${apt.id}`}
                >
                  <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Date Badge */}
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 p-3 rounded-xl flex flex-col items-center justify-center min-w-[70px] shadow-sm">
                        <span className="text-xs font-bold uppercase">
                          {new Date(apt.date).toLocaleString("en-US", { month: "short" })}
                        </span>
                        <span className="text-2xl font-bold">{new Date(apt.date).getDate()}</span>
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="font-bold text-lg">{apt.doctor}</h3>
                          <Badge variant="secondary" className="text-xs h-6">
                            {apt.specialty}
                          </Badge>
                          <Badge className={`text-xs h-6 ${getStatusBadgeColor(apt.status)}`}>
                            {t(`appointments.${apt.status}`) || apt.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{apt.type}</p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-lg">
                            <Clock className="h-4 w-4" /> {apt.time}
                          </span>
                          <span className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-lg">
                            <MapPin className="h-4 w-4" /> {apt.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col gap-2">
                      <Dialog open={isEditOpen && editingId === apt.id} onOpenChange={setIsEditOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleEditClick(apt)}
                            data-testid="button-reschedule"
                          >
                            <Edit2 className="h-4 w-4 mr-1" />
                            {t("appointments.reschedule")}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[450px]">
                          <DialogHeader>
                            <DialogTitle>{t("appointments.reschedule")}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-doctor">{t("appointments.doctor")} *</Label>
                              <Input
                                id="edit-doctor"
                                value={formData.doctor}
                                onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-specialty">{t("appointments.specialty") || "Specialty"}</Label>
                              <Input
                                id="edit-specialty"
                                value={formData.specialty}
                                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-date">{t("appointments.appointmentDate")} *</Label>
                              <Input
                                id="edit-date"
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-time">{t("appointments.appointmentTime")} *</Label>
                              <Input
                                id="edit-time"
                                type="time"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-location">{t("appointments.location") || "Location"}</Label>
                              <Input
                                id="edit-location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-type">{t("appointments.appointmentType") || "Type"}</Label>
                              <Input
                                id="edit-type"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                              />
                            </div>
                            <Button onClick={handleUpdateAppointment} className="w-full">
                              {t("common.save")}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteAppointment(apt.id)}
                        data-testid="button-cancel-appointment"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        {t("appointments.cancel")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
