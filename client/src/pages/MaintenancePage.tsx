import { Card } from "@/components/ui/card";
import { MaintenanceTimeline } from "@/components/MaintenanceTimeline";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MaintenancePage() {
  const overdueItems = [
    {
      equipment: "Ford F-550",
      id: "TR-2024-015",
      task: "Oil Change & Filter",
      dueDate: "Nov 3, 2025",
      hours: 5420,
    },
    {
      equipment: "CAT 420F",
      id: "BH-2023-012",
      task: "50-Hour Service",
      dueDate: "Nov 5, 2025",
      hours: 3650,
    },
  ];

  const upcomingItems = [
    {
      equipment: "Graco LineDriver",
      id: "LP-2023-042",
      task: "Annual Inspection",
      dueDate: "Nov 8, 2025",
      hours: 3890,
    },
    {
      equipment: "CAT 320 Excavator",
      id: "EX-2024-001",
      task: "100-Hour Service",
      dueDate: "Nov 15, 2025",
      hours: 1245,
    },
  ];

  const recentlyCompleted = [
    {
      id: "1",
      type: "completed" as const,
      title: "Hydraulic System Check - CAT 320",
      description: "Inspected hydraulic lines and replaced worn seals",
      date: "Nov 1, 2025",
      mechanic: "Sarah Chen",
    },
    {
      id: "2",
      type: "completed" as const,
      title: "Engine Tune-up - Volvo EC220E",
      description: "Full engine diagnostic and adjustment",
      date: "Oct 28, 2025",
      mechanic: "Mike Torres",
    },
    {
      id: "3",
      type: "completed" as const,
      title: "Tire Rotation - RAM 3500",
      description: "Rotated all tires and checked alignment",
      date: "Oct 25, 2025",
      mechanic: "James Wilson",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Maintenance</h1>
          <p className="text-sm text-muted-foreground">Track and schedule equipment maintenance</p>
        </div>
        <Button data-testid="button-add-maintenance">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Maintenance
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{overdueItems.length}</p>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Overdue</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{upcomingItems.length}</p>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Upcoming</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">23</p>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">This Month</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="overdue" className="w-full">
        <TabsList>
          <TabsTrigger value="overdue" data-testid="tab-overdue">Overdue ({overdueItems.length})</TabsTrigger>
          <TabsTrigger value="upcoming" data-testid="tab-upcoming">Upcoming ({upcomingItems.length})</TabsTrigger>
          <TabsTrigger value="completed" data-testid="tab-completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="overdue" className="space-y-3">
          {overdueItems.map((item) => (
            <Card key={item.id} className="p-4 border-l-4 border-l-red-500" data-testid={`card-overdue-${item.id}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{item.equipment}</h3>
                  <p className="text-sm font-mono text-muted-foreground">{item.id}</p>
                  <p className="text-sm text-muted-foreground mt-2">{item.task}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-600">Overdue</p>
                  <p className="text-xs text-muted-foreground">Due: {item.dueDate}</p>
                  <p className="text-xs text-muted-foreground">{item.hours.toLocaleString()} hrs</p>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-3">
          {upcomingItems.map((item) => (
            <Card key={item.id} className="p-4 border-l-4 border-l-yellow-500" data-testid={`card-upcoming-${item.id}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{item.equipment}</h3>
                  <p className="text-sm font-mono text-muted-foreground">{item.id}</p>
                  <p className="text-sm text-muted-foreground mt-2">{item.task}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-yellow-600">Scheduled</p>
                  <p className="text-xs text-muted-foreground">Due: {item.dueDate}</p>
                  <p className="text-xs text-muted-foreground">{item.hours.toLocaleString()} hrs</p>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed">
          <MaintenanceTimeline events={recentlyCompleted} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
