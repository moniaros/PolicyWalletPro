import { useState } from "react";
import { agents } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Phone, Mail, MessageSquare, Check, UserCheck } from "lucide-react";
import { toast } from "sonner";

export default function AgentsPage() {
  const [currentAgentId, setCurrentAgentId] = useState(agents.find(a => a.isCurrent)?.id || 1);

  const handleSelectAgent = (id: number, name: string) => {
    setCurrentAgentId(id);
    toast.success(`Agent ${name} selected`, {
      description: "Your policies will now be managed by this agent."
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Find an Agent</h1>
        <p className="text-muted-foreground mt-1">Connect with an expert to manage your insurance portfolio.</p>
      </div>

      {/* Current Agent Highlight */}
      {agents.find(a => a.id === currentAgentId) && (
        <div className="mb-10">
           <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              Your Current Agent
           </h2>
           <Card className="border-primary/20 bg-primary/5 overflow-hidden">
              <CardContent className="p-0">
                 <div className="flex flex-col md:flex-row">
                    <div className="p-6 flex items-start gap-4 flex-1">
                       <Avatar className="h-20 w-20 border-4 border-background shadow-xl">
                          <AvatarImage src={agents.find(a => a.id === currentAgentId)?.avatar} />
                          <AvatarFallback>{agents.find(a => a.id === currentAgentId)?.name.charAt(0)}</AvatarFallback>
                       </Avatar>
                       <div>
                          <div className="flex items-center gap-2">
                             <h3 className="text-xl font-bold">{agents.find(a => a.id === currentAgentId)?.name}</h3>
                             <Badge className="bg-primary text-primary-foreground hover:bg-primary">Active</Badge>
                          </div>
                          <p className="text-primary font-medium">{agents.find(a => a.id === currentAgentId)?.specialty}</p>
                          <div className="flex items-center gap-1 text-amber-500 mt-1">
                             <Star className="h-4 w-4 fill-current" />
                             <span className="font-bold text-sm">{agents.find(a => a.id === currentAgentId)?.rating}</span>
                             <span className="text-muted-foreground text-sm">({agents.find(a => a.id === currentAgentId)?.reviews} reviews)</span>
                          </div>
                          <p className="text-muted-foreground text-sm mt-3 max-w-md">{agents.find(a => a.id === currentAgentId)?.about}</p>
                       </div>
                    </div>
                    <div className="bg-background/50 border-l border-border/50 p-6 flex flex-col justify-center gap-3 min-w-[250px]">
                       <Button className="w-full">
                          <MessageSquare className="h-4 w-4 mr-2" /> Chat Now
                       </Button>
                       <Button variant="outline" className="w-full">
                          <Phone className="h-4 w-4 mr-2" /> Schedule Call
                       </Button>
                       <Button variant="ghost" className="w-full">
                          <Mail className="h-4 w-4 mr-2" /> Email
                       </Button>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>
      )}

      <h2 className="text-lg font-semibold mb-4">Available Agents</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {agents.filter(a => a.id !== currentAgentId).map((agent) => (
            <Card key={agent.id} className="hover:shadow-md transition-all duration-300 flex flex-col">
               <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                     <Avatar className="h-14 w-14 border-2 border-muted">
                        <AvatarImage src={agent.avatar} />
                        <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                     </Avatar>
                     <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-md text-xs font-bold">
                        <Star className="h-3 w-3 fill-current" /> {agent.rating}
                     </div>
                  </div>
                  <CardTitle className="mt-3 text-lg">{agent.name}</CardTitle>
                  <CardDescription className="font-medium text-primary">{agent.specialty}</CardDescription>
               </CardHeader>
               <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{agent.about}</p>
                  <div className="text-xs text-muted-foreground">
                     <p>Experience: <span className="font-medium text-foreground">{agent.experience}</span></p>
                     <p>Active Clients: <span className="font-medium text-foreground">{agent.reviews * 2}+</span></p>
                  </div>
               </CardContent>
               <CardFooter className="pt-0">
                  <Button 
                     variant="outline" 
                     className="w-full hover:border-primary hover:text-primary hover:bg-primary/5"
                     onClick={() => handleSelectAgent(agent.id, agent.name)}
                  >
                     Select Agent
                  </Button>
               </CardFooter>
            </Card>
         ))}
      </div>
    </div>
  );
}
