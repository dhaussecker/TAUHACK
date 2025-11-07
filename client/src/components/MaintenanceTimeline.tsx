import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MaintenanceEvent {
  id: string;
  type: "completed" | "scheduled" | "overdue";
  title: string;
  description: string;
  date: string;
  mechanic?: string;
}

interface MaintenanceTimelineProps {
  events: MaintenanceEvent[];
  className?: string;
}

export function MaintenanceTimeline({ events, className }: MaintenanceTimelineProps) {
  const getIcon = (type: MaintenanceEvent["type"]) => {
    switch (type) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "scheduled":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "overdue":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusColor = (type: MaintenanceEvent["type"]) => {
    switch (type) {
      case "completed":
        return "bg-green-100 border-green-500";
      case "scheduled":
        return "bg-yellow-100 border-yellow-500";
      case "overdue":
        return "bg-red-100 border-red-500";
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {events.map((event, index) => (
        <div key={event.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={cn(
              "p-2 rounded-full border-2",
              getStatusColor(event.type)
            )}>
              {getIcon(event.type)}
            </div>
            {index < events.length - 1 && (
              <div className="w-0.5 h-full min-h-8 bg-border mt-2" />
            )}
          </div>
          
          <Card className="flex-1 p-4" data-testid={`card-maintenance-${event.id}`}>
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <h4 className="font-medium text-foreground">{event.title}</h4>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{event.date}</span>
              </div>
              <p className="text-sm text-muted-foreground">{event.description}</p>
              {event.mechanic && (
                <p className="text-xs text-muted-foreground">Mechanic: {event.mechanic}</p>
              )}
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}
