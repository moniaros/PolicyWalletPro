import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { appointments } from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, MapPin, Clock, Plus } from "lucide-react";

export default function AppointmentsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Appointments</h1>
        <p className="text-muted-foreground mt-1">Track your doctor visits and checkups.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Calendar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded-2xl border shadow-sm flex justify-center">
            <DayPicker
              mode="single"
              selected={date}
              onSelect={setDate}
              className="p-0"
              modifiersClassNames={{
                selected: "bg-primary text-white rounded-md"
              }}
            />
          </div>
          
          <div className="mt-6 bg-primary/5 p-6 rounded-2xl border border-primary/10">
            <h3 className="font-semibold text-primary mb-2">Need a checkup?</h3>
            <p className="text-sm text-muted-foreground mb-4">Based on your age and history, we recommend a dental cleaning soon.</p>
            <Button className="w-full shadow-lg shadow-primary/20">Book Appointment</Button>
          </div>
        </div>

        {/* Right Column: List */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Upcoming</h2>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Appointment
              </Button>
           </div>

           <div className="space-y-4">
             {appointments.map((apt) => (
               <Card key={apt.id} className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
                 <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                   <div className="flex items-start gap-4">
                     <div className="bg-blue-50 text-blue-600 p-3 rounded-xl flex flex-col items-center justify-center min-w-[60px]">
                       <span className="text-xs font-bold uppercase">{new Date(apt.date).toLocaleString('default', { month: 'short' })}</span>
                       <span className="text-xl font-bold">{new Date(apt.date).getDate()}</span>
                     </div>
                     
                     <div>
                       <div className="flex items-center gap-2 mb-1">
                         <h3 className="font-bold text-lg">{apt.doctor}</h3>
                         <Badge variant="secondary" className="text-[10px] h-5">{apt.specialty}</Badge>
                       </div>
                       <p className="text-muted-foreground">{apt.type}</p>
                       
                       <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                         <span className="flex items-center gap-1">
                           <Clock className="h-3.5 w-3.5" /> {apt.time}
                         </span>
                         <span className="flex items-center gap-1">
                           <MapPin className="h-3.5 w-3.5" /> {apt.location}
                         </span>
                       </div>
                     </div>
                   </div>
                   
                   <div className="flex sm:flex-col gap-2">
                     <Button variant="outline" size="sm" className="flex-1">Reschedule</Button>
                     <Button variant="ghost" size="sm" className="flex-1 text-muted-foreground hover:text-destructive">Cancel</Button>
                   </div>
                 </CardContent>
               </Card>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}
