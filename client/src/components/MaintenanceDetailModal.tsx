import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Calendar, Clock, User, Wrench, FileText, CheckCircle2 } from "lucide-react";

interface MaintenanceItem {
  id: string;
  equipment: string;
  equipmentId: string;
  task: string;
  dueDate: string;
  hours: number;
  priority: "critical" | "warning" | "normal";
}

interface MaintenanceDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maintenance: MaintenanceItem | null;
}

export function MaintenanceDetailModal({ open, onOpenChange, maintenance }: MaintenanceDetailModalProps) {
  if (!maintenance) return null;

  const priorityColors = {
    critical: "bg-red-100 text-red-800 border-red-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    normal: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const priorityIcons = {
    critical: AlertCircle,
    warning: Clock,
    normal: CheckCircle2,
  };

  const PriorityIcon = priorityIcons[maintenance.priority];

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader className="mb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <SheetTitle className="text-2xl mb-2">{maintenance.task}</SheetTitle>
                <p className="text-sm text-muted-foreground">Maintenance ID: {maintenance.id}</p>
              </div>
              <Badge className={`${priorityColors[maintenance.priority]} uppercase text-xs`}>
                <PriorityIcon className="w-3 h-3 mr-1" />
                {maintenance.priority}
              </Badge>
            </div>
          </SheetHeader>

          <div className="space-y-6">
            {/* Overview Section */}
            <section id="overview">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                Overview
              </h3>
              <Card className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Wrench className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Equipment</p>
                      <p className="text-sm font-medium truncate">{maintenance.equipment}</p>
                      <p className="text-xs font-mono text-muted-foreground">{maintenance.equipmentId}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Due Date</p>
                      <p className="text-sm font-medium">{maintenance.dueDate}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Current Hours</p>
                      <p className="text-sm font-medium font-mono">{maintenance.hours.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Assigned To</p>
                      <p className="text-sm font-medium">Unassigned</p>
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            {/* Task Details Section */}
            <section id="details">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                Task Details
              </h3>
              <Card className="p-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Description</p>
                    <p className="text-sm">
                      Standard maintenance procedure for {maintenance.task.toLowerCase()}. Follow manufacturer
                      specifications and safety protocols.
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Estimated Duration</p>
                    <p className="text-sm">2-3 hours</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Required Parts</p>
                    <p className="text-sm text-muted-foreground">No parts specified</p>
                  </div>
                </div>
              </Card>
            </section>

            {/* Notes Section */}
            <section id="notes">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                Notes
              </h3>
              <Card className="p-4">
                <div className="flex items-start gap-2 text-muted-foreground text-sm">
                  <FileText className="w-4 h-4 mt-0.5" />
                  <p>No notes added yet</p>
                </div>
              </Card>
            </section>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button variant="default" className="flex-1" data-testid="button-complete-maintenance">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mark Complete
              </Button>
              <Button variant="outline" className="flex-1" data-testid="button-reschedule-maintenance">
                <Calendar className="w-4 h-4 mr-2" />
                Reschedule
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
