import { Card } from "@/components/ui/card";
import { DataTable, SortableHeader } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

interface MaintenanceItem {
  id: string;
  equipment: string;
  equipmentId: string;
  task: string;
  dueDate: string;
  hours: number;
  priority: "critical" | "warning" | "normal";
}

export default function MaintenancePage() {
  const [selectedTab, setSelectedTab] = useState("overdue");

  const overdueItems: MaintenanceItem[] = [
    {
      id: "M-001",
      equipment: "Ford F-550",
      equipmentId: "TR-2024-015",
      task: "Oil Change & Filter",
      dueDate: "Nov 3, 2025",
      hours: 5420,
      priority: "critical",
    },
    {
      id: "M-002",
      equipment: "CAT 420F Backhoe",
      equipmentId: "BH-2023-012",
      task: "50-Hour Service",
      dueDate: "Nov 5, 2025",
      hours: 3650,
      priority: "critical",
    },
  ];

  const upcomingItems: MaintenanceItem[] = [
    {
      id: "M-003",
      equipment: "Graco LineDriver",
      equipmentId: "LP-2023-042",
      task: "Annual Inspection",
      dueDate: "Nov 8, 2025",
      hours: 3890,
      priority: "warning",
    },
    {
      id: "M-004",
      equipment: "CAT 320 Excavator",
      equipmentId: "EX-2024-001",
      task: "100-Hour Service",
      dueDate: "Nov 15, 2025",
      hours: 1245,
      priority: "normal",
    },
    {
      id: "M-005",
      equipment: "Volvo EC220E",
      equipmentId: "EX-2023-087",
      task: "Hydraulic Check",
      dueDate: "Nov 20, 2025",
      hours: 2890,
      priority: "normal",
    },
  ];

  const completedItems: MaintenanceItem[] = [
    {
      id: "M-006",
      equipment: "CAT 320 Excavator",
      equipmentId: "EX-2024-001",
      task: "Oil Change",
      dueDate: "Oct 15, 2025",
      hours: 1200,
      priority: "normal",
    },
    {
      id: "M-007",
      equipment: "Volvo EC220E",
      equipmentId: "EX-2023-087",
      task: "Engine Tune-up",
      dueDate: "Oct 28, 2025",
      hours: 2850,
      priority: "normal",
    },
  ];

  const columns: ColumnDef<MaintenanceItem>[] = [
    {
      accessorKey: "equipment",
      header: ({ column }) => <SortableHeader column={column}>Equipment</SortableHeader>,
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.equipment}</div>
          <div className="text-xs font-mono text-muted-foreground">{row.original.equipmentId}</div>
        </div>
      ),
    },
    {
      accessorKey: "task",
      header: ({ column }) => <SortableHeader column={column}>Task</SortableHeader>,
      cell: ({ row }) => <div className="text-sm">{row.original.task}</div>,
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => <SortableHeader column={column}>Due Date</SortableHeader>,
      cell: ({ row }) => <div className="text-sm">{row.original.dueDate}</div>,
    },
    {
      accessorKey: "hours",
      header: ({ column }) => <SortableHeader column={column}>Hours</SortableHeader>,
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.original.hours.toLocaleString()}</div>
      ),
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const colors = {
          critical: "text-red-600 font-semibold",
          warning: "text-yellow-600 font-medium",
          normal: "text-muted-foreground",
        };
        return (
          <div className={`text-sm uppercase text-xs ${colors[row.original.priority]}`}>
            {row.original.priority}
          </div>
        );
      },
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

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList>
          <TabsTrigger value="overdue" data-testid="tab-overdue">
            Overdue ({overdueItems.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming" data-testid="tab-upcoming">
            Upcoming ({upcomingItems.length})
          </TabsTrigger>
          <TabsTrigger value="completed" data-testid="tab-completed">
            Completed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overdue" className="mt-4">
          <DataTable
            columns={columns}
            data={overdueItems}
            onRowClick={(item) => console.log("View maintenance:", item.id)}
          />
        </TabsContent>

        <TabsContent value="upcoming" className="mt-4">
          <DataTable
            columns={columns}
            data={upcomingItems}
            onRowClick={(item) => console.log("View maintenance:", item.id)}
          />
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          <DataTable
            columns={columns}
            data={completedItems}
            onRowClick={(item) => console.log("View maintenance:", item.id)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
